const queries = require('./queries');

const queryToCities = queries('cities');
const queryToWeather = queries('weather');

const getCityId = async (city) => {
  await queryToCities.insertCityRow([city.name, city.country]);

  const { rows: [row] } = await queryToCities.selectAllByName([city.name]);

  return row.id;
};

// Create new weather data row if not exist
const insertWeatherRow = async (day, cityId) => {
  await queryToWeather.insertWeatherRow([...Object.values(day), cityId]);

  const { rows: [row] } = await queryToWeather.selectAllByDateAndCityId([day.date, cityId]);

  return row;
};

const fulfilleWeatherTable = async (city, cityId) => {
  const insertingPromises = city.weather.map((day) => insertWeatherRow(day, cityId));
  const rows = await Promise.all(insertingPromises);
  return rows;
};

const insertData = async (weatherData) => {
  const promises = weatherData.map(async (city) => {
    const cityId = await getCityId(city);
    fulfilleWeatherTable(city, cityId);
  });
  const rows = await Promise.all(promises);
  return rows;
};

module.exports = insertData;
