const db = require('../db/db');

const isRowExist = (data) => data.rows.length !== 0;

const getCityId = async (cityName) => {
  const id = await db.query('SELECT id from cities WHERE name=$1;', [cityName]);
  return id;
};

module.exports = {
  isRowExist,
  getCityId,
};
