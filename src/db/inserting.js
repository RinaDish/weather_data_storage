const db = require("./db");

const insertData = async (weatherData) => {
  try {
    for (const city of weatherData) {
      const newCityId = await db.query(
        `INSERT INTO cities (name, country) VALUES ($1, $2) RETURNING *;`,
        [city.name, city.country]
      ).rows[0].id;

      for (const day of city.weather) {
        await db.query(
          `INSERT INTO weather 
        (date, maxtemp_c, mintemp_c, avgtemp_c,maxwind_kph, totalprecip_mm, avgvis_km, avghumidity, condition, city_id ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
          [...Object.values(day), newCityId]
        );
      }
    }
    return true;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = insertData;
