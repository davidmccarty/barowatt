const Express = require('express');
const BodyParser = require('body-parser');
const Log4js = require('log4js');
const Config = require('./modules/config');
const Mock = require('./modules/mock');
const Reader = require('./modules/reader');
const Mongo = require('./modules/mongo');
const Weather = require('./modules/weather');

// Set logger
const logger = Log4js.getLogger('index');
Log4js.configure({
  appenders: { console: { type: 'console' } },
  categories: { default: { appenders: ['console'], level: 'debug' } }
});

// Start server
const app = Express();
port = Config.server.port;
app.use(BodyParser.json());
app.get('/', (req, res) => {
  const msg = 'Hello from Barowatt';
  logger.debug(msg);
  res.send(msg);
});
app.listen(port, () => {
  logger.info('Server listening on the port:' + port);
});

// Init mongo
logger.info('Initializing mongo connection');
const db = new Mongo();
db.init();

// If mocking start generate data
if (Config.server.mock) {
  logger.info('Starting mock serial data generator');
  const mp = new Mock();
  const port = mp.start();
  const rp = new Reader();
  rp.start(port);
} else {
  // Start reader
  logger.info('Starting serial data reader');
  const rp = new Reader();
  rp.start();
}

// start weather
logger.info('Starting weather data collector');
const weather = new Weather();
weather.start();
