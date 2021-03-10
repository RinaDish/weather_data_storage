exports.up = async function (db) {
  await db.runSql(
    `CREATE TABLE IF NOT EXISTS cities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE,
        country VARCHAR(255),
        requests INTEGER DEFAULT 0
  );

    CREATE TABLE IF NOT EXISTS weather (
        maxtemp_c DECIMAL,
        mintemp_c DECIMAL,
        avgtemp_c DECIMAL,
        maxwind_kph DECIMAL,
        totalprecip_mm DECIMAL,
        avgvis_km DECIMAL,
        avghumidity DECIMAL,
        condition VARCHAR(255),
        date VARCHAR(255),
        city_id INTEGER,
        FOREIGN KEY (city_id) REFERENCES cities (id),
        PRIMARY KEY (date, city_id)
    );`,
  );
};

exports.down = async function (db) {
  await db.dropTable('weather');
  await db.dropTable('cities');
};

exports._meta = {
  version: 1,
};
