const path = require('path')

const config = {
  "development": {
    "username": "root",
    "storage": path.resolve(__dirname, '../../db/restaurant.db'),
    "dialect": "sqlite"
  }
}

module.exports = config
