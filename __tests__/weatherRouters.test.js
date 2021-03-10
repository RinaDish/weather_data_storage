const request = require('supertest');
const getWeatherData = require('../src/weather/forecast');
const { getTodayDate } = require('../src/utils/date');
const insertData = require('../src/db/inserting');
const citiesList = require('../src/citiesList');
const queries = require('../src/db/queries');
const app = require('../src/app');

const cityName = 'Madrid';
const notExistingCityName = 'Hogsmeade';
const queryToCities = queries('cities');

beforeAll(async () => {
  const forecast = await getWeatherData(citiesList);
  await insertData(forecast);
}, 50000);

test('Should get list of cities', async () => {
  const { body } = await request(app).get('/city/list').send().expect(200);

  expect(body).not.toHaveLength(0);
});

test('Should get average temperature in the city', async () => {
  const {
    body: { avgTemp },
  } = await request(app).get(`/avgtemp/${cityName}`).send().expect(200);

  expect(typeof avgTemp).toBe('number');
});

test('Should NOT get average temperature in the city', async () => {
  const {
    body: { avgTemp },
  } = await request(app)
    .get(`/avgtemp/${notExistingCityName}`)
    .send()
    .expect(404);

  expect(avgTemp).toBeUndefined();
});

test('Should get the most popular city', async () => {
  const {
    body: { name, country },
  } = await request(app).get('/popular').send().expect(200);

  expect(name).not.toBeUndefined();
  expect(country).not.toBeUndefined();
});

test('Should get weather in the city by date', async () => {
  const {
    body: [weatherRow],
  } = await request(app).get(`/city/${cityName}?dt=today`).send().expect(200);

  expect(weatherRow).not.toBeUndefined();
  expect(weatherRow.date).toMatch(getTodayDate());

  const {
    rows: [row],
  } = await queryToCities.selectIdByName([cityName]);
  const cityId = row.id;
  expect(weatherRow.city_id).toBe(cityId);
});

test('Should NOT get weather in the city by date', async () => {
  await request(app)
    .get(`/city/${notExistingCityName}?dt=today`)
    .send()
    .expect(404);

  await request(app).get(`/city/${cityName}?dt=tomorrow`).send().expect(404);
});

test('Should increment requests field in cities table', async () => {
  const {
    rows: [{ requests: beforeRequest }],
  } = await queryToCities.selectRequestsByName([cityName]);

  await request(app).get(`/city/${cityName}?dt=today`).send().expect(200);

  const {
    rows: [{ requests: afterRequest }],
  } = await queryToCities.selectRequestsByName([cityName]);

  expect(afterRequest - beforeRequest).toBe(1);
});
