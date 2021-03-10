const express = require('express');
const weatherRouter = require('./routers/weatherRouters');
const getWeatherData = require('./weather/forecast');
const insertData = require('./db/inserting');
const queries = require('./db/queries');
const { isEqualDate } = require('./utils/date');
const { successResponse, failureResponse } = require('./utils/responses');

const queryToWeather = queries('weather');

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const lastDateInDbRow = await queryToWeather.selectLastDateInDb();

    // For checking if date changed and it possible to fetch NEW weather data
    if (!(isEqualDate(lastDateInDbRow))) {
      const forecast = await getWeatherData();
      await insertData(forecast);

      return successResponse(res, forecast);
    }
    return successResponse(res);
  } catch (e) {
    return failureResponse(res, e);
  }
});

app.use(weatherRouter);

module.exports = app;
