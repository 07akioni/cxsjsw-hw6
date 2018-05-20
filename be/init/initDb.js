const { readComboData, readSingleData } = require('../utils')
const db = require('../sequelize/models')

async function updateDb () {
  const comboDict = readComboData()
  const singleDict = readSingleData()
  try {
    for (let singleId of Object.keys(singleDict)) {
      await db.single.findOrCreate({
        where: {
          Sid: singleId,
        },
        defaults: {
          Sid: singleId,
          Sname: singleDict[singleId].name,
          Sprice: Number(singleDict[singleId].price)
        }
      })
    }
    for (let comboId of Object.keys(comboDict)) {
      await db.multi.findOrCreate({
        where: {
          Mid: comboId
        },
        defaults: {
          Mid: comboId,
          Mname: comboDict[comboId].name,
          Mprice: Number(comboDict[comboId].price)
        }
      })
      for (let singleId of Object.keys(comboDict[comboId].items)) {
        await db.multiElement.findOrCreate({
          where: {
            Mid: comboId,
            Sid: singleId
          },
          defaults: {
            Mid: comboId,
            Sid: singleId,
            Snum: Number(comboDict[comboId].items[singleId])
          }
        })
      }
    }
  } catch (err) {
    console.log(err)
  }
}

updateDb()
