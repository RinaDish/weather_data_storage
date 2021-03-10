# Weather Data Storage

Simple API for getting a history of weather conditions in the city for 7 past days. Based on https://www.weatherapi.com/ API. Using PostgreSql.

List of cities in <b>`/src/citiesList.js`</b> using for tests and `/city/europecapitals` endpoint.

- [How It Works](#Howitworks)
  - [Running](#Running)
  - [Migrations](#Migrations)
  - [Testing](#Testing)
- [`API`](#API)

## How It Works

### Running

Create DataBase named <b>`weather_storage`</b>.

Install dependencies before running:

```sh
npm i
```

Running server:

```sh
$ npm start
```

Running in developer mode (with nodemon):

```sh
$ npm run dev
```

### Migrations

Running mingrations:

```sh
npm run migration:up
```

Rollback the database:

```sh
npm run migration:down
```

Create new migration:

```sh
npm run migration:create
```

### Testing

- Postman collection in root derrectory named `WeatherDataStorage.postman_collection.json`

- Run unit-tests:

```sh
npm test
```

## API

 - Fetch weather data at European capitals from weather service for the past 7 days
```
GET /city/europecapitals
```

 - Get list of cities
```
GET /city/list
```

 - Get weather in the city by date
`dt` parameter is required
```
GET /city/:city

GET /city/London?dt=2021-03-01
GET /city/London?dt=today
GET /city/London?dt=yesterday
```

 - Get average temperature in the city
```
GET /avgtemp/:city

GET /avgtemp/London
```

 - Get the most popular city
```
GET /popular
```
