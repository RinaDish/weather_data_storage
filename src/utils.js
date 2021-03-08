const moment = require("moment");

const getDateRange = () => {
  const currentDate = moment(new Date()).format("YYYY-MM-DD");
  const startDate = moment().subtract(6, "d").format("YYYY-MM-DD");
  return { currentDate, startDate };
};

const successResponse = (response, data, status = 200) =>
  response.status(status).send(data);

const failureResponse = (response, error, status = 400) =>
  response.status(status).send(error);

module.exports = { getDateRange, successResponse, failureResponse };
