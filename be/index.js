const { convertOrderToSingleOrder, bestValueOrder } = require('./order')
const {
  readComboData,
  readSingleData,
  readTrialInputData
} = require('./utils')

const comboDict = readComboData()
const singleDict = readSingleData()
const inputData = readTrialInputData()

function main () {
  for (let input of inputData) {
    const singleOrder = convertOrderToSingleOrder(comboDict, singleDict, input)
    const result = bestValueOrder(comboDict, singleDict, singleOrder)
    console.log(result)
  }
}

main()
