require("dotenv").config();
const AWS = require("aws-sdk");
const axios = require("axios");

// ✅ Load specific AWS CLI profile credentials
// const credentials = new AWS.SharedIniFileCredentials({
//   profile: "perpion-sanka",
// });
// AWS.config.credentials = credentials;
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

  const result = await cognito.adminInitiateAuth(params).promise();
  return result.AuthenticationResult.IdToken;
};

const getAllNotes = async (token) => {
  const API_URL = `${process.env.TEST_ROOT}/notes`;

  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Notes Retrieved:");
    console.log(response.data);
  } catch (err) {
    console.error(
      "❌ Failed to fetch notes:",
      err.response?.status,
      err.response?.data || err.message
    );
  }
};

(async () => {
  try {
    const token = await getToken();
    console.log("✅ ID Token:", token.slice(0, 40) + "...");
    await getAllNotes(token);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
})();
