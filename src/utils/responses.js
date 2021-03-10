const successResponse = (response, data, status = 200) => response.status(status).send(data);

const failureResponse = (response, error, status = 400) => {
  console.log(error);
  return response.status(status).send(error);
};

module.exports = {
  successResponse,
  failureResponse,
};
