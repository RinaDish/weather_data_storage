const express = require('express');
const queries = require('../db/queries');
const { successResponse, failureResponse } = require('../utils/responses');
const { convertDate } = require('../utils/date');
const getWeatherData = require('../weather/forecast');
const insertData = require('../db/inserting');
const citiesList = require('../citiesList');

const {
  isRowExist,
  getCityId,
} = require('../utils/db');

const queryToCities = queries('cities');
const queryToWeather = queries('weather');

const router = new express.Router();

router.get('/city/europecapitals', async (req, res) => {
  try {
    const forecast = await getWeatherData(citiesList);
    await insertData(forecast);

    return successResponse(res, forecast);
  } catch (e) {
    return failureResponse(res, e);
  }
});

// Get list of cities
router.get('/city/list', async (req, res) => {
  try {
    // Get list of cities
    const cities = await queryToCities.selectFields('name, country');
    if (!isRowExist(cities)) return failureResponse(res, 'Cities not found', 404);

    return successResponse(res, cities.rows);
  } catch (e) {
    return failureResponse(res, e);
  }
});

// Get weather in the city by date
// GET /city/London?dt=2021-03-01
// GET /city/London?dt=today
// GET /city/London?dt=yesterday
router.get('/city/:city', async ({ params: { city }, query: { dt } }, res) => {
  try {
    // Get weather and update request counter

    if (!dt) return failureResponse(res, 'Parameter "dt" for date is required');
    const date = convertDate(dt);

    let cityRow = await getCityId(city);

    if (!isRowExist(cityRow)) { // For providing custom city
      const forecast = await getWeatherData([city]);
      if (forecast.length === 0) return failureResponse(res, 'City not found at weather service', 404);

      await insertData(forecast);
      cityRow = await getCityId(city);
    }

    // Increment requests field in cities table
    await queryToCities.incrementRequests([city]);

    const weather = await queryToWeather.selectAllByDateAndCityId([date, cityRow.rows[0].id]);

    if (!isRowExist(weather)) return failureResponse(res, 'Weather data not found', 404);

    return successResponse(res, weather.rows);
  } catch (e) {
    return failureResponse(res, e);
  }
});

// Get average temperature in the city
router.get('/avgtemp/:city', async ({ params }, res) => {
  try {
    // Get average temperature
    const cityRow = await getCityId(params.city);
    if (!isRowExist(cityRow)) return failureResponse(res, 'City not found', 404);

    const avgtempRow = await queryToWeather.selectAvgTemp([cityRow.rows[0].id]);
    if (!isRowExist(avgtempRow)) return failureResponse(res, 'Average temperature not found', 404);

    // To round to 1 sign after decimal
    const avgTemp = Math.round(avgtempRow.rows[0].avg * 10) / 10;
    return successResponse(res, { avgTemp }, 200);
  } catch (e) {
    return failureResponse(res, e);
  }
});

// Get the most popular city
router.get('/popular', async (req, res) => {
  try {
    // Get the most popular city
    const popularRow = await queryToCities.selectBiggestRequests();

    if (!isRowExist(popularRow)) return failureResponse(res, 'Average temperature not found', 404);

    return successResponse(res, popularRow.rows[0]);
  } catch (e) {
    return failureResponse(res, e);
  }
});

module.exports = router;
