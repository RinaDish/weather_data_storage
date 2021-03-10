const request = require('supertest');
const moment = require('moment');
const app = require('../src/app');
const getWeatherData = require('../src/weather/forecast');
const insertData = require('../src/db/inserting');
const db = require('../src/db/db');

const cityName = 'Madrid';

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

test('Should get average temperature in the city', async () => {
  const { body: { avgTemp } } = await request(app)
    .get(`/avgtemp/${cityName}`)
    .send()
    .expect(200);

  expect(typeof avgTemp).toBe('number');
});

test('Should get the most popular city', async () => {
  const { body: { name, country } } = await request(app)
    .get('/popular')
    .send()
    .expect(200);

  expect(name).not.toBeUndefined();
  expect(country).not.toBeUndefined();
});

test('Should get weather in the city by date', async () => {
  const { body: [weatherRow] } = await request(app)
    .get(`/city/${cityName}?dt=today`)
    .send()
    .expect(200);

  expect(weatherRow).not.toBeUndefined();
  expect(weatherRow.date).toMatch(moment(new Date()).format('YYYY-MM-DD'));

  const { rows: [row] } = await db.query('SELECT id FROM cities WHERE name=$1;', [cityName]);
  const cityId = row.id;
  expect(weatherRow.city_id).toBe(cityId);
});
