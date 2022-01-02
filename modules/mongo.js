var Mongo = require('mongodb');
const Log4js = require('log4js');
const Config = require('./config');

// Set logger
const logger = Log4js.getLogger('mongo');

// Mongo client
const client = Mongo.MongoClient;
const host = Config.mongo.host;
const port = Config.mongo.port;
const dbName = Config.mongo.db;
const url = 'mongodb://' + host + ':' + port + '/' + dbName;
logger.debug('connection url: ', url);

async function connect() {
  let conn = null;
  try {
    conn = await client.connect(url);
    logger.trace('db connected successfully');
  } catch (err) {
    logger.error('connection error: ', err.message);
    throw err;
  }
  return conn;
}

// Expose reader
module.exports = function () {
  // Initialize db
  this.init = async function () {
    logger.debug('init database started');
    let conn = await connect();
    conn.close();
    logger.debug('init database complete');
  };

  // Write energy instant reading
  this.writeInstant = async function (instant) {
    let conn = await connect();
    const db = conn.db(dbName);
    try {
      const res = await db
        .collection(Config.mongo.collection.instant)
        .insertOne(instant);
      logger.debug('instant inserted at doc: ', res.insertedId.toHexString());
      conn.close();
    } catch (err) {
      logger.error('instant insert error: ', err.message);
      throw err;
    }
  };

  // Write weather reading
  this.writeWeather = async function (weather) {
    let conn = await connect();
    const db = conn.db(dbName);
    try {
      const res = await db
        .collection(Config.mongo.collection.weather)
        .insertOne(weather);
      logger.debug('weather inserted at doc: ', res.insertedId.toHexString());
      conn.close();
    } catch (err) {
      logger.error('weather insert error: ', err.message);
      throw err;
    }
  };
};
