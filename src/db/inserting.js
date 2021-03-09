const db = require("./db");
const { isRowExist } = require("./../utils");

const getCityId = async (city) => {
  // Get city_id if this city exist in cities table or create new row if doesn`t
  const cityRow = await db.query(`SELECT * from cities WHERE name=$1;`, [
    city.name,
  ]);

  const currentCity = !isRowExist(cityRow)
    ? await db.query(
        `INSERT INTO cities (name, country) VALUES ($1, $2) RETURNING *;`,
        [city.name, city.country]
      )
    : cityRow;

  return currentCity.rows[0].id;
};

// Create new weather data row if not exist
const insertWeatherRow = async (day, cityId) => {
  const weatherRow = await db.query(
    `SELECT * from weather WHERE date=$1 AND city_id=$2;`,
    [day.date, cityId]
  );

  if (!isRowExist(weatherRow)) {
    await db.query(
      `INSERT INTO weather 
          (date, maxtemp_c, mintemp_c, avgtemp_c, maxwind_kph, totalprecip_mm, avgvis_km, avghumidity, condition, city_id ) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
      [...Object.values(day), cityId]
    );
  }
};

const insertData = async (weatherData) => {
  try {
    for (const city of weatherData) {
      const cityId = await getCityId(city);

      for (const day of city.weather) {
        await insertWeatherRow(day, cityId);
      }
    }
    return true;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = insertData;
