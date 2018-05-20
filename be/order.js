"use strict";

const testComboDict = {
  Mx: {
    items: {
      Sa: 1,
      Sb: 1,
    },
    price: 1
  },
  My: {
    items: {
      Sc: 2,
      Sa: 2,
    },
    price: 3
  },
  Mz: {
    items:{
      Sd: 1,
      Sb: 2,
    },
    price: 5
  }
}

const testSignleDict = {
  Sa: {
    price: 1
  },
  Sb: {
    price: 2
  },
  Sc: {
    price: 3
  },
  Sd: {
    price: 4
  },
  Se: {
    price: 3
  },
  Sf: {
    price: 2
  },
  Sg: {
    price: 1
  }
}

/*
 * 获取每种 combo 能点的最多个数
 * @return [{ comboKey, count }, ...]
 */
function getMaxSafeCombos (comboDict, order) {
  const maxSafeCombos = []
  comboLoop: for (let comboKey of Object.keys(comboDict)) {
    let combo = comboDict[comboKey].items
    let maxSafeItemCounts = []
    let maxComboCount = Number.MAX_SAFE_INTEGER
    for (let itemKey of Object.keys(combo)) {
      let itemCount = combo[itemKey]
      let orderItemCount = 0
      if (order[itemKey] === undefined) {
        continue comboLoop
      }
      orderItemCount = order[itemKey]
      maxComboCount = Math.min(maxComboCount, Math.floor(orderItemCount / itemCount))
    }
    if (maxComboCount === 0) continue
    maxSafeCombos.push({ comboKey, count: maxComboCount })
  }
  return maxSafeCombos
}

function convertOrderToSingleOrder (comboDict, singleDict, order) {
  const newOrder = {}
  for (let key of Object.keys(order)) {
    const item = key
    const itemCnt = order[key]
    if (key[0] === 'S') {
      if (newOrder[item] === undefined) {
        newOrder[item] = itemCnt
      } else {
        newOrder[item] += itemCnt
      }
    } else {
      let combo = comboDict[item]
      for (let single of Object.keys(combo.items)) {
        let singleCount = combo.items[single] * itemCnt
        if (newOrder[single] === undefined) {
          newOrder[single] = singleCount
        } else {
          newOrder[single] += singleCount
        }
      }
    }
  }
  console.log('newOrder:', newOrder)
  return newOrder
}

function getMinPrice (comboDict, singleDict, order, maxSafeCombos, maxSafeComboCounts, allPossibleOrder) {
  let minPrice = Number.MAX_SAFE_INTEGER
  if (maxSafeCombos.length === 0) {
    let price = 0
    for (let key of Object.keys(order)) {
      price += singleDict[key].price * order[key]
    }
    return {
      order: {
        single: order,
        combo: {}
      },
      price
    }
  }
  const bestOrder = {}
  orderLoop: for (let index in allPossibleOrder) {
    /*
     * maxSafeCombos 对应的 comboArray
     * comboArray 存的是每个订单用的各种套餐有几个
     */
    let comboArray = allPossibleOrder[index]
    let pOrder = {}
    for (let key of Object.keys(order)) {
      pOrder[key] = 0
    }

    for (let comboIndex in comboArray) {
      let comboKey = maxSafeCombos[comboIndex].comboKey
      let comboCnt = comboArray[comboIndex]
      let combo = comboDict[comboKey].items
      for (let itemKey of Object.keys(combo)) {
        pOrder[itemKey] += comboCnt * combo[itemKey]
      }
    }

    for (let key of Object.keys(pOrder)) {
      if (pOrder[key] > order[key]) {
        continue orderLoop
      }
    }

    for (let key of Object.keys(pOrder)) {
      pOrder[key] = order[key] - pOrder[key]
    }

    let price = 0

    for (let key of Object.keys(pOrder)) {
      price += singleDict[key].price * pOrder[key]
    }


    for (let comboIndex in comboArray) {
      let comboKey = maxSafeCombos[comboIndex].comboKey
      let comboCnt = comboArray[comboIndex]
      let comboPrice = comboDict[comboKey].price
      price += comboCnt * comboPrice
    }

    if (minPrice > price) {
      minPrice = price
      for (let key of Object.keys(pOrder)) {
        if (pOrder[key] !== 0) {
          bestOrder[key] = pOrder[key]
        }
      }
      comboArray.forEach((v, i) => {
        if (v != 0) {
          bestOrder[maxSafeCombos[i].comboKey] = v
        }
      })
    }
  }
  return {
    price: minPrice,
    order: bestOrder
  }
}

/*
 * order {
 *   itemKey: count
 * }
 */
function bestValueOrder (comboDict, singleDict, order) {

  const maxSafeCombos = getMaxSafeCombos(comboDict, order)
  
  const maxSafeComboCounts = maxSafeCombos.map(v => v.count)
  
  let allPossibleOrder = (new EnumArray(maxSafeComboCounts, comboDict, maxSafeCombos, order)).enum()
  
  return getMinPrice(comboDict, singleDict, order, maxSafeCombos, maxSafeComboCounts, allPossibleOrder)
}

function isComboValid(comboDict, maxSafeCombos, comboArray, order) {
  const pOrder = {}

  for (let key of Object.keys(order)) {
    pOrder[key] = 0
  }

  for (let comboIndex in comboArray) {
    let comboKey = maxSafeCombos[comboIndex].comboKey
    let comboCnt = comboArray[comboIndex]
    let combo = comboDict[comboKey].items
    for (let itemKey of Object.keys(combo)) {
      pOrder[itemKey] += comboCnt * combo[itemKey]
    }
  }

  for (let key of Object.keys(pOrder)) {
    if (pOrder[key] > order[key]) {
      return false
    }
  }

  return true
}

function EnumArray (array, comboDict, maxSafeCombos, order) {
  this.enumArr = []
  this.array = array
  console.log(this.array)
  console.log('arr len:', this.array.reduce((prevV, v) => {
    return prevV * (v + 1)
  }, 1))
  this.init = () => {
    this.enumArr = []
    this.array = array
  }
  this.enumWithPos = (prevArray, pos) => {
    if (pos === this.array.length) {
      this.enumArr.push(prevArray.map(v => v))
      return
    }
    else {
      for (let v = 0; v <= this.array[pos]; ++v) {
        prevArray.push(v)
        if (!isComboValid(comboDict, maxSafeCombos, prevArray, order)) {
          prevArray.pop()
          continue
        }
        this.enumWithPos(prevArray, pos + 1)
        prevArray.pop()
      }
    }
  }
  this.enum = () => {
    this.init()
    this.enumWithPos([], 0)
    console.log('enumLength:', this.enumArr.length)
    return this.enumArr
  }
  return {
    init: this.init,
    enum: this.enum,
    enumWithPos: this.enumWithPos
  }
}


module.exports = {
  convertOrderToSingleOrder,
  bestValueOrder
}