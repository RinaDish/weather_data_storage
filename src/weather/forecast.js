const fetch = require("node-fetch");

const forecast = async (location, startDate, endDate) => {
  const url = `http://api.weatherapi.com/v1/history.json?key=${process.env.WEATHERAPI_KEY}&q=${location}&dt=${startDate}&end_dt=${endDate}`;

  const response = await fetch(url)
    .then((response) => response.json())
    .catch((e) => e);
  if (response.error) return { error: response.error.message };
  if (response.message) return { error: response.message };

  return response;
};

module.exports = forecast;
