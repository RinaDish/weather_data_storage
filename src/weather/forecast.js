const fetch = require('node-fetch');
const { getDateRange } = require('../utils/date');

const forecast = (startDate, endDate) => async (location) => {
  const url = `http://api.weatherapi.com/v1/history.json?key=${process.env.WEATHERAPI_KEY}&q=${location}&dt=${startDate}&end_dt=${endDate}`;

  const response = await fetch(url)
    .then((res) => res.json())
    .catch((e) => e);
  if (response.error) return { error: response.error.message };
  if (response.message) return { error: response.message };

  return response;
};

const structureWeatherData = (weatherData) => {
  const filtered = weatherData.filter((e) => !e.error);

  return filtered.map(({ location: { name, country }, forecast: { forecastday } }) => ({
    name,
    country,
    weather: forecastday.map(({ date, day }) => ({
      date,
      maxtemp_c: day.maxtemp_c,
      mintemp_c: day.mintemp_c,
      avgtemp_c: day.avgtemp_c,
      maxwind_kph: day.maxwind_kph,
      totalprecip_mm: day.totalprecip_mm,
      avgvis_km: day.avgvis_km,
      avghumidity: day.avghumidity,
      condition: day.condition.text,
    })),
  }));
};

const getWeatherData = async (citiesList) => {
  const { startDate, currentDate } = getDateRange();
  const promices = citiesList.map(forecast(startDate, currentDate));

  const data = await Promise.allSettled(promices);

  return structureWeatherData(data.map((el) => el.value));
};

module.exports = getWeatherData;
