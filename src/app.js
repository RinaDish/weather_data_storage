const express = require("express");
const db = require("./db/db");
const getWeatherData = require("./weather/forecast");
const weatherRouter = require("./routers/weatherRouters");
const insertData = require("./db/inserting");

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  const forecast = await getWeatherData();
  const inserting = await insertData(forecast);

  res.json(inserting);
});

app.use(weatherRouter);

module.exports = app;
