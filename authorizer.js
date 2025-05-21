const { CognitoJwtVerifier } = require("aws-jwt-verify");

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: "us-east-1_8U2KNApFS",
  tokenUse: "id",
  clientId: "2g2ds1dak4m2mmog75poj8hcbt",
});

const generatePolicy = (principleId, effect, resource) => {
  var authResponse = {};

  authResponse.principalId = principleId;
  if (effect && resource) {
    let policyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke", // default action
          Effect: effect,
          Resource: resource,
        },
      ],
    };
    authResponse.policyDocument = policyDocument;
  }

  authResponse.context = {
    foo: "bar",
  };
  console.log(JSON.stringify(authResponse));
  return authResponse;
};

exports.handler = async (event, context, callback) => {
  // lambda authorizer function code
  var token = event.authorizationToken; // "allow" or "deny"
  console.log("Token: ", token);

  // Validate the JWT token
  try {
    const payload = await jwtVerifier.verify(token);
    console.log(JSON.stringify(payload));
    callback(null, generatePolicy("user", "Allow", event.methodArn));
  } catch (err) {
    console.log("Error: ", err);
    callback("Unauthorized"); // Return a 401 Unauthorized response
  }

  // switch (token) {
  //   case "allow":
  //     callback(null, generatePolicy("user", "Allow", event.methodArn));
  //     break;
  //   case "deny":
  //     callback(null, generatePolicy("user", "Deny", event.methodArn));
  //     break;
  //   case "unauthorized":
  //     callback("Unauthorized"); // Return a 401 Unauthorized response
  //     break;
  //   default:
  //     callback("Error: Invalid token"); // Return a 500 Invalid token response
  // }
};
