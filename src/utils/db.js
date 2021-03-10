const queries = require('../db/queries');

const queryToCities = queries('cities');

const isRowExist = (data) => data.rows.length !== 0;

const getCityId = async (cityName) => {
  const id = await queryToCities.selectIdByName([cityName]);
  return id;
};

module.exports = {
  isRowExist,
  getCityId,
};
