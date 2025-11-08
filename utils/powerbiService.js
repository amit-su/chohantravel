const axios = require("axios");
const querystring = require("querystring");
async function getAccessToken(reportId) {
  const resourceUri = "https://analysis.windows.net/powerbi/api";
  const authority = `https://login.microsoftonline.com/${process.env.TenantId}`;

  // Define form data
  const formData = querystring.stringify({
    client_id: process.env.ClientId,
    scope: "openid",
    resource: resourceUri,
    username: process.env.powerbi_username,
    password: process.env.powerbi_password,
    grant_type: "password",
    client_secret: process.env.clientSecret,
  });

  // Define request config
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    // Make POST request to get access token
    const tokenResponse = await axios.post(
      `${authority}/oauth2/token`,
      formData,
      config
    );

    // Extract access token from response
    const accessToken = tokenResponse.data.access_token;
    const workspaceId = "08354ce4-d4a1-4ada-b6a1-aed2ebbb5858";

    const url = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`;
    console.log("start Access token:", accessToken);
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Check if the request was successful
    if (response.status === 200) {
      return { ...response.data, token: accessToken };
    } else {
      // Handle non-successful response
      console.error("Failed to fetch report data");
      return "";
    }
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
}

module.exports = getAccessToken;
