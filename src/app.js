const express = require('express');
const weatherRouter = require('./routers/weatherRouters');
const getWeatherData = require('./weather/forecast');
const insertData = require('./db/inserting');

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
  const forecast = await getWeatherData();
  await insertData(forecast);

  res.json(forecast);
});

app.use(weatherRouter);

module.exports = app;
