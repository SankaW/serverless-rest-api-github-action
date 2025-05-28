import { APIGatewayTokenAuthorizerEvent, Context, Callback, PolicyDocument, APIGatewayAuthorizerResult } from "aws-lambda";
import { CognitoJwtVerifier } from "aws-jwt-verify";

// Environment variables
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || "";
const COGNITO_WEB_CLIENT_ID = process.env.COGNITO_WEB_CLIENT_ID || "";

// JWT verifier setup
const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  tokenUse: "id",
  clientId: COGNITO_WEB_CLIENT_ID,
});

// Generate IAM policy
const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string
): APIGatewayAuthorizerResult => {
  const policyDocument: PolicyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  };

  return {
    principalId,
    policyDocument,
    context: {
      foo: "bar",
    },
  };
};

// Lambda handler
export const handler = async (
  event: APIGatewayTokenAuthorizerEvent,
  context: Context,
  callback: Callback
): Promise<void> => {
  const token = event.authorizationToken;
  console.log("Token: ", token);

  try {
    const payload = await jwtVerifier.verify(token);
    console.log("Payload:", JSON.stringify(payload));
    callback(null, generatePolicy("user", "Allow", event.methodArn));
  } catch (err) {
    console.error("Verification error:", err);
    callback("Unauthorized");
  }
};
