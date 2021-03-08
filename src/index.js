const express = require("express");
const db = require("./db/db");

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
  getWeatherData();
});
