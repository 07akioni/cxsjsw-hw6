const fs = require('fs')
const path = require('path')

function readComboData () {
  const comboStr = fs.readFileSync(path.resolve(__dirname, './data/combo')).toString()
  let combos = comboStr.split('\n')
  combos.shift()
  combos = combos.map(v => v.split('\t'))
  comboDict = {}
  for (let combo of combos) {
    comboDict[combo[0]] = {
      name: combo[1],
      price: combo[2],
      items: {}
    }
    for (let item of combo[3].split('+')) {
      comboDict[combo[0]].items[item.split(',')[0]] = item.split(',')[1]
    }
  }
  return comboDict
}

function readSingleData () {
  const singleStr = fs.readFileSync(path.resolve(__dirname, './data/single')).toString()
  let singles = singleStr.split('\n')
  singles = singles.map(v => v.split('\t')).slice(1, singles.length)
  singleDict = {}
  singles.forEach(v => {
    singleDict[v[0]] = {
      name: v[1],
      price: v[2]
    }
  })
  return singleDict
}

function readTrialInputData () {
  let trials = require(path.resolve(__dirname, './data/trial_data.json'))
  trials = trials.trial.map(v => v.input)
  return trials
}

module.exports = {
  readComboData,
  readSingleData,
  readTrialInputData
}