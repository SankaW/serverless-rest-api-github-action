require("dotenv").config();
const AWS = require("aws-sdk");
const axios = require("axios");

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

const createNote = async (token) => {
  const API_URL = `${process.env.TEST_ROOT}/notes`;

  const newNote = {
    title: "New Note Title",
    body: "This is the body of the new note.",
  };

  try {
    const response = await axios.post(API_URL, newNote, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Note Created:");
    console.log(response.data);
  } catch (err) {
    console.error(
      "❌ Failed to create note:",
      err.response?.status,
      err.response?.data || err.message
    );
  }
};

(async () => {
  try {
    const token = await getToken();
    console.log("✅ ID Token:", token.slice(0, 40) + "...");
    await createNote(token);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
})();
