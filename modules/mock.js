/**
 * Simulate Barowatt data messages onto port
 * Data packets:
 * Every 6 seconds
 * ===============
 * <msg>
 *  <src>CC128-v1.11</src>
 *  <dsb>00037</dsb>
 *  <time>12:03:51</time>
 *  <tmpr>18.4</tmpr>
 *  <sensor>0</sensor>
 *  <id>02723</id>
 *  <type>1</type>
 *  <ch1>
 *      <watts>00396</watts>
 *  </ch1>
 * </msg>
 *
 * Every 2 hours @ 1 minute after odd hour
 * HOURLY for last 24 hours
 * ========================
 * <msg>
 *  <src>CC128-v0.11</src>
 *  <dsb>00089</dsb>
 *  <time>13:10:50</time>
 *  <hist>                        start of history
 *      <dsw>00032</dsw>           days since wipe of history
 *      <type>1</type>             sensor Type, "1" = electricity
 *      <units>kwhr</units>        units of data eg KWHr
 *      <data>                     start of data burst
 *          <sensor>0</sensor>      historic Appliance Number
 *          <h024>001.1</h024>      h="hours", 24="22 to 24 hrs ago"
 *          <h022>000.9</h022>      h="hours", 22="20 to 22 hrs ago"
 *          <h020>000.3</h020>      h="hours", 18="20 to 20 hrs ago"
 *      </data>
 *  </hist>
 * </msg>
 *
 * DAILY for last 90 days
 * ======================
 * <msg>
 *  <src>CC128-v0.11</src>
 *  <dsb>00089</dsb>
 *  <time>13:10:50</time>
 *  <hist>
 *      <dsw>00032</dsw>
 *      <type>1</type>
 *      <units>kwhr</units>
 *      <data>
 *          <sensor>0</sensor>
 *          <units>kwhr</units>
 *          <d055>012.9</d055>      d="days", 055="55 days ago"
 *          <d054>011.0</d054>
 *          <d053>014.3</d053>
 *          <d052>019.5</d052>
 *      </data>
 *  </hist>
 * </msg>
 *
 * MONTHLY for 84 months
 * =====================
 * <msg>
 *  <src>CC128-v0.11</src>
 *  <dsb>00089</dsb>
 *  <time>13:10:50</time>
 *  <hist>
 *      <dsw>00032</dsw>
 *      <type>1</type>
 *      <units>kwhr</units>
 *      <data>
 *          <sensor>0</sensor>
 *          <units>kwhr</units>
 *          <m002>257.0</m002>      m="month", 002="2 months ago"
 *          <m001>340.0</m001>
 *       </data>
 *  </hist>
 * </msg>
 */

const SerialPort = require('@serialport/stream');
const MockBinding = require('@serialport/binding-mock');
const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');
const Log4js = require('log4js');
const Config = require('./config');

// Set logger
const logger = Log4js.getLogger('mock');

// Create mocked port
SerialPort.Binding = MockBinding;
MockBinding.createPort(Config.serial.port, { echo: true, record: true });
const port = new SerialPort(Config.serial.port, Config.serial.portOptions);

module.exports = function () {
  this.start = function () {
    logger.info('echo port created at ', Config.serial.port);
    // Log events
    port.on('error', function (err) {
      logger.error('Error: ', err.message);
    });
    port.on('open', function () {
      logger.info('open writer on ', Config.serial.port);
    });
    port.on('close', function (msg) {
      logger.info('Close: ', msg);
    });
    // Setup time and energy since birth
    let wattsSinceBirth = 0;
    let dsb = 0;
    let startTime = new Date();
    // Write instant data every 6 seconds to port
    setInterval(writeInstant, 6000);
    function writeInstant() {
      // TODO setup dsb
      const date = new Date();
      dsb = Math.round(
        (date.getTime() - startTime.getTime()) / (1000 * 3600 * 24)
      );
      const builder = new XMLBuilder();
      let data = {};
      let msg = {};
      data.msg = msg;
      msg.src = 'CC128-v1.11';
      msg.dsb = dsb.toString();
      msg.time = date.toLocaleTimeString();
      msg.tmpr = '22.0';
      msg.sensor = 'O';
      msg.id = '123';
      msg.type = '1';
      let ch1 = {};
      msg.ch1 = ch1;
      let watts = Math.round((Math.random() * 7 + 2) * 1000) / 1000;
      ch1.watts = watts.toString();
      const xml = builder.build(data);
      logger.debug('built xml: ', xml);
      port.write(xml, function (err) {
        if (err) {
          const msg = 'Error on write: ';
          logger.error(msg, err.message);
          throw err;
        }
      });
      wattsSinceBirth += watts;
    }
    return port;
  };
};
