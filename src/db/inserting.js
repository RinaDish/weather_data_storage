const db = require('./db');

const getCityId = async (city) => {
  await db.query(
    'INSERT INTO cities (name, country) VALUES ($1, $2) ON CONFLICT DO NOTHING;',
    [city.name, city.country],
  );

  const { rows: [row] } = await db.query('SELECT * from cities WHERE name=$1;', [
    city.name,
  ]);

  return row.id;
};

// Create new weather data row if not exist
const insertWeatherRow = async (day, cityId) => {
  await db.query(
    `INSERT INTO weather 
        (date, maxtemp_c, mintemp_c, avgtemp_c, maxwind_kph, totalprecip_mm, avgvis_km, avghumidity, condition, city_id ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT DO NOTHING;`,
    [...Object.values(day), cityId],
  );

  const { rows: [row] } = await db.query(
    'SELECT * from weather WHERE date=$1 AND city_id=$2;',
    [day.date, cityId],
  );

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
