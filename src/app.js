const express = require("express");
const db = require("./db/db");
const getWeatherData = require("./weather/forecast");
const weatherRouter = require("./routers/weatherRouters");

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  const forecast = await getWeatherData();

  res.json(forecast);
});

app.use(weatherRouter);

module.exports = app;
