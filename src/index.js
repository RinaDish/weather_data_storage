const express = require("express");
const db = require("./db/db");
const getWeatherData = require("./weather/forecast");

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  const forecast = await getWeatherData();

  res.json(forecast);
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
