const moment = require('moment');
const db = require('./db/db');

const getDateRange = () => {
  const currentDate = moment(new Date()).format('YYYY-MM-DD');
  const startDate = moment().subtract(6, 'd').format('YYYY-MM-DD');
  return { currentDate, startDate };
};

const successResponse = (response, data, status = 200) => response.status(status).send(data);

const failureResponse = (response, error, status = 400) => {
  console.log(error);
  return response.status(status).send(error);
};

const isRowExist = (data) => data.rows.length !== 0;

const getCityId = async (cityName) => {
  const id = await db.query('SELECT id from cities WHERE name=$1;', [cityName]);
  return id;
};

module.exports = {
  getDateRange,
  successResponse,
  failureResponse,
  isRowExist,
  getCityId,
};
