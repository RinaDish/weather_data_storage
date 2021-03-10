const request = require('supertest');
const moment = require('moment');
const app = require('../src/app');
const getWeatherData = require('../src/weather/forecast');
const insertData = require('../src/db/inserting');
const db = require('../src/db/db');

beforeAll(async () => {
  const forecast = await getWeatherData();
  await insertData(forecast);
}, 50000);

test('Should get list of cities', async () => {
  const { body } = await request(app)
    .get('/city/list')
    .send()
    .expect(200);

  expect(body).not.toHaveLength(0);
});

test('Should get weather in the city by date', async () => {
  const cityName = 'Madrid';
  const { body: [weatherRow] } = await request(app)
    .get(`/city/${cityName}?dt=today`)
    .send()
    .expect(200);

  expect(weatherRow).not.toBeUndefined();
  expect(weatherRow.date).toMatch(moment(new Date()).format('YYYY-MM-DD'));

  const cityIdRow = await db.query('SELECT id FROM cities WHERE name=$1;', [cityName]);
  const cityId = cityIdRow.rows[0].id;
  expect(weatherRow.city_id).toBe(cityId);
});
