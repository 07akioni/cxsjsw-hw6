const express = require('express')
const db = require('./sequelize/models')
const morgan = require('morgan')
const bodyParser = require('body-parser');
const app = express()
const child_process = require('child_process')
const path = require('path')

app.use(morgan('short'))
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/single', async function (req, res) {
  try {
    const singles = await db.single.findAll({
      attributes: ['Sid', 'Sname', 'Sprice']
    })
    res.send({
      code: 200,
      data: {
        singles
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500)
    res.send({
      code: '500',
      data: {}
    })
  }
})

app.post('/single', async function (req, res) {
  try {
    await db.single.create(req.body)
    res.send({
      code: 200,
      data: {

      }
    })
  } catch (err) {
    console.log(err)
    res.status(500)
    res.send({
      code: '500',
      data: {}
    })
  }
})

app.get('/multi', async function (req, res) {
  try {
    const multis = await db.multi.findAll({
      attributes: ['Mid', 'Mname', 'Mprice']
    })
    res.send({
      code: 200,
      data: {
        multis
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500)
    res.send({
      code: '500',
      data: {}
    })
  }
})

app.post('/multi', async function (req, res) {
  try {
    await db.multi.create({
      Mid: req.body.Mid,
      Mname: req.body.Mname,
      Mprice: req.body.Mprice
    })
    for (let single of req.body.Mcontent) {
      await db.multiElement.create({
        Mid: req.body.Mid,
        Sid: single,
        Snum: req.body[single]
      })
    }
    res.send({
      code: 200,
      data: {

      }
    })
  } catch (err) {
    console.log(err)
    res.status(500)
    res.send({
      code: '500',
      data: {}
    })
  }
})

app.get('/multiElement', async function (req, res) {
  try {
    const multiElements = await db.multiElement.findAll({
      attributes: ['Mid', 'Sid', 'Snum']
    })
    res.send({
      code: 200,
      data: {
        multiElements
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500)
    res.send({
      code: '500',
      data: {}
    })
  }
})

app.post('/testOrder', async function (req, res) {
  try {
    const order = req.body
    const resString = await new Promise((res, rej) => {
      child_process.exec(`python3 lp_via_cmd.py '${JSON.stringify(order)}'`, { cwd: path.resolve(__dirname, 'pyutils') }, function (err, stdout, stderr) {
        if (err) rej(err)
        res(stdout.toString())
      })
    })
    res.send(resString)
  } catch (err) {
    console.log(err)
    res.status(500)
    res.send({
      code: '500',
      data: {}
    })
  }
})

app.post('/order', async function (req, res) {
  try {
    const order = req.body
    const resString = await new Promise((res, rej) => {
      child_process.exec(`python3 lp_min_price_via_cmd.py '${JSON.stringify(order)}'`, { cwd: path.resolve(__dirname, 'pyutils') }, function (err, stdout, stderr) {
        if (err) rej(err)
        res(stdout.toString())
      })
    })
    const originalPrice = Number(await new Promise((res, rej) => {
      child_process.exec(`python3 price_of_order_via_cmd.py '${JSON.stringify(order)}'`, { cwd: path.resolve(__dirname, 'pyutils') }, function (err, stdout, stderr) {
        if (err) rej(err)
        res(stdout.toString())
      })
    }))
    const newOrder = JSON.parse(resString)
    Oid = 'O' + String(Math.random()).slice(2, 9) // 既然作业这么要求，我也就这么写了，不过反过头来说...我并不想起这么奇怪的id名字
    await db.order.create({
      Oid,
      OrigCost: originalPrice,
      AcytCost: newOrder.minPrice.cost
    })
    /*console.log({
      Oid,
      OrigCost: originalPrice,
      AcytCost: newOrder.minPrice.cost
    })*/
    for (let item of Object.keys(newOrder.minPrice.input)) {
      /*console.log({
        Oid,
        DishId: item,
        DishNum: newOrder.minPrice.input[item]
      })*/
      await db.detail.create({
        Oid,
        DishId: item,
        DishNum: newOrder.minPrice.input[item]
      })
    }
    
    res.send({
      code: '200',
      data: {}
    })
  } catch (err) {
    console.log(err)
    res.status(500)
    res.send({
      code: '500',
      data: {}
    })
  }
})

const sever = app.listen(3000, () => {})

