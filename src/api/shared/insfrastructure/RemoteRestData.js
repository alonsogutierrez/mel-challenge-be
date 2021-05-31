const axios = require('axios');
const HTTPStatus = require('http-status-codes');

const logger = console;

const GETRequest = async (baseURL, url, query) => {
  try {
    const response = await axios({
      baseURL,
      method: 'GET',
      url,
      params: {
        q: query
      }
    });
    return response.data;
  } catch (err) {
    logger.error(HTTPStatus.getStatusText(HTTPStatus.SERVICE_UNAVAILABLE), {
      statusCode: HTTPStatus.SERVICE_UNAVAILABLE,
      baseURL,
      url,
      query,
      errorDescription: e.message
    });
    throw new Error(`Can't get products from API: ${err.message}`);
  }
};

module.exports = {
  GETRequest
};
