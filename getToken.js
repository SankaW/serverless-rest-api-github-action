require("dotenv").config();
const AWS = require("aws-sdk");

// ✅ Load specific profile from ~/.aws/credentials
const credentials = new AWS.SharedIniFileCredentials({
  profile: "perpion-sanka",
});
AWS.config.credentials = credentials;
AWS.config.update({ region: "us-east-1" });

const cognito = new AWS.CognitoIdentityServiceProvider();

const getToken = async () => {
  const USER_POOL_ID = process.env.USER_POOL_ID;
  const CLIENT_ID = process.env.CLIENT_ID;
  const USERNAME = process.env.USER_NAME;
  const PASSWORD = process.env.PASSWORD;

  const params = {
    AuthFlow: "ADMIN_NO_SRP_AUTH",
    ClientId: CLIENT_ID,
    UserPoolId: USER_POOL_ID,
    AuthParameters: {
      USERNAME,
      PASSWORD,
    },
  };

  try {
    const result = await cognito.adminInitiateAuth(params).promise();
    console.log("✅ ID Token:");
    console.log(result.AuthenticationResult.IdToken);
  } catch (err) {
    console.error(
      "❌ Failed to authenticate:",
      err.message,
      USER_POOL_ID,
      CLIENT_ID,
      USERNAME,
      PASSWORD
    );
  }
};

getToken();
