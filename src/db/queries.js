const db = require('./db');

const queries = (tableName) => ({
  selectIdByName: async (vars) => {
    const rows = await db.query(`SELECT id FROM ${tableName} WHERE name=$1;`, vars);
    return rows;
  },
  selectAllByName: async (vars) => {
    const rows = await db.query(`SELECT * from ${tableName} WHERE name=$1;`, vars);
    return rows;
  },
  selectAllByDateAndCityId: async (vars) => {
    const rows = await db.query(`SELECT * from ${tableName} WHERE date=$1 AND city_id=$2;`, vars);
    return rows;
  },
  selectFields: async (fields) => {
    const rows = await db.query(`SELECT ${fields} FROM ${tableName};`);
    return rows;
  },
  selectRequestsByName: async (vars) => {
    const rows = await db.query(`SELECT requests FROM ${tableName} WHERE name=$1;`, vars);
    return rows;
  },
  selectLastDateInDb: async () => {
    const rows = await db.query(`SELECT date from ${tableName} ORDER BY date desc LIMIT 1;`);
    return rows;
  },
  selectAvgTemp: async (vars) => {
    const rows = await db.query(
      `SELECT AVG(CAST(avgtemp_c as float))
        FROM ${tableName}
        WHERE city_id=$1;`, vars,
    );
    return rows;
  },
  selectBiggestRequests: async () => {
    const rows = await db.query(
      `SELECT name, country
        FROM cities
        WHERE requests IN (SELECT MAX(requests) FROM cities GROUP BY name)
        ORDER BY requests desc
        LIMIT 1;`,
    );
    return rows;
  },
  insertCityRow: async (vars) => {
    const rows = await db.query('INSERT INTO cities (name, country) VALUES ($1, $2) ON CONFLICT DO NOTHING;', vars);
    return rows;
  },
  insertWeatherRow: async (vars) => {
    const rows = await db.query(
      `INSERT INTO weather 
        (date, maxtemp_c, mintemp_c, avgtemp_c, maxwind_kph, totalprecip_mm, avgvis_km, avghumidity, condition, city_id ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT DO NOTHING;`, vars,
    );
    return rows;
  },
  incrementRequests: async (vars) => {
    const rows = await db.query(
      `UPDATE cities
        SET requests = requests + 1
        WHERE name=$1;`, vars,
    );
    return rows;
  },

});

module.exports = queries;
