const Http = require('http');
const Mongo = require('./mongo');
const Log4js = require('log4js');
const Config = require('./config');

// Set logger
const logger = Log4js.getLogger('weather');

// openweathermap url setup
const path = Config.openweathermap.path
  .replace('{city}', Config.openweathermap.city)
  .replace('{apikey}', Config.openweathermap.apikey);
var options = {
  host: Config.openweathermap.host,
  path: path
};

// Mongo connection
const mongo = new Mongo();

const write = function (response) {
  let weather = '';
  //another chunk of data has been received, so append it to `str`
  response.on('data', function (chunk) {
    weather += chunk;
  });
  //the whole response has been received, so we just print it out here
  response.on('end', function () {
    logger.debug(weather);
    mongo.writeWeather(JSON.parse(weather));
  });
};

// Expose reader
module.exports = function () {
  // Collect weather every 15 mins
  Http.request(options, write).end();
  this.start = function () {
    setInterval(function () {
      Http.request(options, write).end();
    }, 15 * 60 * 1000);
  };
};
