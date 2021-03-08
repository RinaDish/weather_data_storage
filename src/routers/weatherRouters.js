const express = require("express");
const { successResponse, failureResponse } = require("./../utils");

const router = new express.Router();
const data = "";

// Get list of cities
router.get("/city/list", async (req, res) => {
  try {
    // Get list of cities
    return successResponse(res, "ok list");
  } catch (e) {
    return failureResponse(res, e);
  }
});

// Get weather in the city by date
// GET /city/London?dt=2021-03-01
router.get("/city/:city", async (req, res) => {
  try {
    // Get weather
    return successResponse(res, data);
  } catch (e) {
    return failureResponse(res, e);
  }
});

// Get average temperature in the city
router.get("/averagetemp/:city", async (req, res) => {
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
