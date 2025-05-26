require("dotenv").config();
const AWS = require("aws-sdk");

// const credentials = new AWS.SharedIniFileCredentials({
//   profile: process.env.AWS_PROFILE,
// });
// AWS.config.credentials = credentials;
AWS.config.update({ region: "us-east-1" });

const cognito = new AWS.CognitoIdentityServiceProvider();

exports.getIdToken = async () => {
  const params = {
    AuthFlow: "ADMIN_NO_SRP_AUTH",
    ClientId: process.env.CLIENT_ID,
    UserPoolId: process.env.USER_POOL_ID,
    AuthParameters: {
      USERNAME: process.env.USER_NAME,
      PASSWORD: process.env.PASSWORD,
    },
  };

  const result = await cognito.adminInitiateAuth(params).promise();
  return result.AuthenticationResult.IdToken;
};

// // Optional self-execution
// if (require.main === module) {
//   (async () => {
//     try {
//       const token = await exports.getIdToken();
//       console.log("✅ ID Token:", token);
//     } catch (err) {
//       console.error("❌ Error fetching token:", err.message);
//     }
//   })();
// }
