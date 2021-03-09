const express = require("express");
const { successResponse, failureResponse, isRowExist } = require("./../utils");
const db = require("./../db/db");

const router = new express.Router();
const data = "";

// Get list of cities
router.get("/city/list", async (req, res) => {
  try {
    // Get list of cities
    const cities = await db.query(`SELECT name, country from cities;`);
    if (!isRowExist(cityRow))
      return failureResponse(res, "Cities not found", 404);

    return successResponse(res, cities.rows);
  } catch (e) {
    return failureResponse(res, e);
  }
});

// Get weather in the city by date
// GET /city/London?dt=2021-03-01
router.get("/city/:city", async (req, res) => {
  try {
    // Get weather and update request counter
    const cityName = req.params.city;
    const date = req.query.dt;
    const cityRow = await db.query(`SELECT id from cities WHERE name=$1;`, [
      cityName,
    ]);

    if (!isRowExist(cityRow))
      return failureResponse(res, "City not found", 404);

    // Increment requests field in cities table
    await db.query(
      `UPDATE cities
        SET requests = requests + 1
        WHERE name=$1;`,
      [cityName]
    );

    const weather = await db.query(
      `SELECT * from weather WHERE city_id=$1 AND date=$2`,
      [cityRow.rows[0].id, date]
    );

    if (!isRowExist(weather))
      return failureResponse(res, "Weather data not found", 404);

    return successResponse(res, weather.rows);
  } catch (e) {
    return failureResponse(res, e);
  }
});

// Get average temperature in the city
router.get("/avgtemp/:city", async (req, res) => {
  try {
    // Get average temperature
    return successResponse(res, data);
  } catch (e) {
    return failureResponse(res, e);
  }
});

// Get the most popular city
router.get("/popular", async (req, res) => {
  try {
    // Get the most popular city
    return successResponse(res, data);
  } catch (e) {
    return failureResponse(res, e);
  }
});

module.exports = router;
