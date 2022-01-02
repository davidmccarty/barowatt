/**
 * Configuration values
 */

module.exports = {
  log: {
    level: 'DEBUG'
  },
  server: {
    port: 3080,
    mock: true
  },
  serial: {
    port: 'COM2',
    portOptions: {
      baudRate: 57600,
      autoOpen: true,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',
      encoding: 'ascii'
    }
  },
  mongo: {
    host: 'localhost',
    port: '27017',
    db: 'barowatt',
    collection: {
      instant: 'instant',
      hourly: 'hourly',
      daily: 'daily',
      monthly: 'monthly',
      weather: 'weather'
    }
  },
  time: {
    driftSecs: 300
  },
  openweathermap: {
    city: 'Vence,FR',
    apikey: '019a0a5e4df82183ca8fb6abc9fd3522',
    host: 'api.openweathermap.org',
    path: '/data/2.5/weather?q={city}&appid={apikey}'
  }
};
