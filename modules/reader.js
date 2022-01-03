const SerialPort = require('serialPort');
const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');
const Log4js = require('log4js');
const Config = require('./config');
const Mongo = require('./mongo');

// Set logger
const logger = Log4js.getLogger('reader');

// Expose reader
module.exports = function () {
  const parser = new XMLParser();
  const mongo = new Mongo();
  // Test read
  this.start = function (mock) {
    // Use mocked port if passed else create new port connection
    let port = mock;
    if (port) {
      logger.info('using mocked port');
    } else {
      port = new SerialPort(Config.serial.port, Config.serial.portOptions);
    }
    // Loge events
    port.on('error', function (err) {
      logger.error('Error: ', err.message);
    });
    port.on('open', function () {
      logger.info('open reader on ', Config.serial.port);
    });
    port.on('close', function () {
      logger.info('close reader');
    });
    port.on('data', function (data) {
      let xml = new TextDecoder().decode(data);
      try {
        let json = parser.parse(xml);
        if (json.msg) {
          logger.debug('Read: ', json);
          mongo.writeInstant(json);
        }
      } catch (err) {
        logger.warn('Read error: ', err.message);
      }
    });
  };
};
