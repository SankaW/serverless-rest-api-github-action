const axios = require("axios");

const apiRoot = process.env.TEST_ROOT;

exports.apiClient = (idToken) => ({
  get: (path) =>
    axios.get(`${apiRoot}/${path}`, {
      headers: { Authorization: `Bearer ${idToken}` },
    }),

  post: (path, data) =>
    axios.post(`${apiRoot}/${path}`, data, {
      headers: { Authorization: `Bearer ${idToken}` },
    }),

  put: (path, data) =>
    axios.put(`${apiRoot}/${path}`, data, {
      headers: { Authorization: `Bearer ${idToken}` },
    }),

  del: (path) =>
    axios.delete(`${apiRoot}/${path}`, {
      headers: { Authorization: `Bearer ${idToken}` },
    }),
});
