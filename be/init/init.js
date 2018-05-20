const fs = require('fs')
const path = require('path')

if (!fs.existsSync(path.resolve(__dirname, '../db'))) {
  fs.mkdirSync(path.resolve(__dirname, '../db'))
}