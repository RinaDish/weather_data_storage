const moment = require("moment");

const getDataRange = () => {
  const currentDate = moment(new Date()).format("YYYY-MM-DD");
  const startDate = moment().subtract(6, "d").format("YYYY-MM-DD");
  return { currentDate, startDate };
};

module.exports = { getDataRange };
