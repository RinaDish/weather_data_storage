const moment = require('moment');

const getTodayDate = () => moment(new Date()).format('YYYY-MM-DD');

const getPreviousDate = (daysAgo) => moment(new Date()).add(-daysAgo, 'd').format('YYYY-MM-DD');

const getDateRange = () => {
  const currentDate = getTodayDate();
  const startDate = getPreviousDate(6);
  return { currentDate, startDate };
};

const isEqualDate = (lastDateInDbRow) => {
  const lastDate = lastDateInDbRow.rows[0] ? lastDateInDbRow.rows[0].date : '';

  const currentDate = getTodayDate();

  return lastDate === currentDate;
};

const convertDate = (param) => {
  if (param === 'today') return getTodayDate();
  if (param === 'yesterday') return getPreviousDate(1);
  return param;
};

module.exports = {
  getTodayDate,
  getPreviousDate,
  getDateRange,
  isEqualDate,
  convertDate,
};
