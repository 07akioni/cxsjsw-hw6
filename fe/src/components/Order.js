import React from 'react'
import { Form, Input, Button, message, Select, InputNumber, Divider, Modal } from 'antd'
import axios from 'axios'
const FormItem = Form.Item;
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 }
};

/*
 * 单品输入表项的标签
 */
class SingleLabel extends React.Component {
  render () {
    return (
      <div style={{ display: 'inline-block' }}>{ this.props.name }（{ this.props.price }元）</div>
    )
  }
}

/*
 * 套餐输入表项的标签
 */
class MultiLabel extends React.Component {
  constructor (props) {
    super(props)
    this.buildMultiElementList = this.buildMultiElementList.bind(this)
  }
  buildMultiElementList () {
    return this.props.multiElements.filter(v => v.Mid === this.props.Mid).map(v => <span key={ this.props.Mid + v.Sid }>{this.props.singleDict[v.Sid].Sname} * {v.Snum}<br/></span>)
  }
  render () {
    return (
      <div style={{ display: 'inline-block' }}>{ this.props.name }（{ this.props.price }元）<br/>{this.buildMultiElementList()}</div>
    )
  }
}

/*
 * 下订单的组件
 */
class Order extends React.Component {
  constructor (props) {
    super(props)
    this.check = this.check.bind(this)
    this.submit = this.submit.bind(this)
    this.state = {
      singles: [],
      singleDict: {},
      multis: [],
      multiDict: {},
      multiElements: [],
      order: {},
      newOrder: {},
      newCost: 'loading',
      visible: false,
      testOrdering: false,
      lessPrice: {
        singleToAdd: null,
        newMinPrice: -1
      }
    }
    this.mapSingleToSelection = this.mapSingleToSelection.bind(this)
  }
  componentDidMount () {
    axios
      .get('/single')
      .then(res => {
        const singleDict = {}
        res.data.data.singles.forEach(v => {
          singleDict[v.Sid] = v
        })
        this.setState({
          singles: res.data.data.singles,
          singleDict
        })
      })
      .then(() => {
        return axios
        .get('/multiElement')
      })
      .then(res => {
        this.setState({
          multiElements: res.data.data.multiElements
        })
      })
      .then(() => {
        return axios.get('/multi')
      })
      .then(res => {
        const multiDict = {}
        res.data.data.multis.forEach(v => {
          multiDict[v.Mid] = v
        })
        this.setState({
          multis: res.data.data.multis,
          multiDict
        })
      })
  }
  check (e) {
    e.preventDefault()
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (err) {
        // do nothing
      } else {
        const order = {}
        Object.keys(values).forEach(k => {
          if (values[k] !== 0) order[k] = values[k]
        })
        if (Object.keys(order).length === 0) {
          message.error('哥们，你什么都没点啊！！！')
          return
        }
        // console.log(order)
        this.setState({
          testOrdering: true
        })
        this.submit(order)
      }
    })
  }
  submit (values) {
    axios({
      method: 'post',
      url: '/testOrder',
      data: values
    }).then(res => {
      this.setState({
        visible: true,
        order: values,
        newOrder: res.data.minPrice.output,
        newCost: res.data.minPrice.cost,
        lessPrice: res.data.lessPrice
      })
      this.setState({
        testOrdering: false
      })
      // message.info(res.data)
    }).catch(err => {
      message.error(`出错了，不要问我为什么...`)
      this.setState({
        testOrdering: false
      })
    })
  }
  mapSingleToSelection () {
    const { getFieldDecorator } = this.props.form;
    return this.state.singles.map(v => {
      const single = v
      return (
        <FormItem style={{ width: '33%', display: 'inline-block' }} label={ <SingleLabel name={single.Sname} price={single.Sprice}/> } { ...formItemLayout } key={ single.Sid }>
          {
            getFieldDecorator(`${single.Sid}`, {
              initialValue: 0,
              rules: [{
                required: true,
                message: '必须要输入单品数量'
              }, {
                pattern: /^\d+$/,
                message: '请输入有效的数量'
              }]
            })(<InputNumber min={0}/>)
          }
        </FormItem>
      )
    })
  }
  mapMultiToSelection () {
    const { getFieldDecorator } = this.props.form;
    return this.state.multis.map(v => {
      const single = v
      return (
        <FormItem style={{ width: '100%', display: 'inline-block' }} label={ <MultiLabel name={single.Mname} price={single.Mprice} Mid={single.Mid} multiElements={this.state.multiElements} singleDict={this.state.singleDict}/> } { ...formItemLayout } key={ single.Mid }>
          {
            getFieldDecorator(`${single.Mid}`, {
              initialValue: 0,
              rules: [{
                required: true,
                message: '必须要输入套餐数量'
              }, {
                pattern: /^\d+$/,
                message: '请输入有效的数量'
              }]
            })(<InputNumber min={0}/>)
          }
        </FormItem>
      )
    })
  }
  handleOk = (e) => {
    return axios({
      method: 'post',
      url: '/order',
      data: this.state.order
    })
    .then(res => {
      message.info('提交订单成功')
      this.setState({
        visible: false
      });
    })
    .catch(err => {
      message.error(`出错了，不要问我为什么...`)
      this.setState({
        visible: false
      })
    })
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form hideRequiredMark onSubmit={ this.check }>
        <h2>单品</h2>
        {
          this.mapSingleToSelection()
        }
        <Divider/>
        <h2>套餐</h2>
        {
          this.mapMultiToSelection()
        }
        <FormItem style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit" loading={ this.state.testOrdering }>确认订单</Button>
        </FormItem>
        <Modal
          title="确认订单"
          visible={this.state.visible}
          okText="提交订单"
          onOk={this.handleOk}
          cancelText="再去看看"
          onCancel={this.handleCancel}
        >
          { Object.keys(this.state.order).filter(k => k[0] === 'S').map(k => <p key={k}>{this.state.singleDict[k].Sname} * {this.state.order[k]} | 单价 {this.state.singleDict[k].Sprice}元 | 价格 {this.state.singleDict[k].Sprice * Number(this.state.order[k])}元</p>)}
          { Object.keys(this.state.order).filter(k => k[0] === 'M').map(k => <p key={k}>{this.state.multiDict[k].Mname} * {this.state.order[k]} | 单价 {this.state.multiDict[k].Mprice}元 | 价格 {this.state.multiDict[k].Mprice * Number(this.state.order[k])}元</p>)}
          <p>原价：{ Object.keys(this.state.order).reduce((prevV, k) => {
            if (k[0] === 'M') {
              return prevV + this.state.multiDict[k].Mprice * Number(this.state.order[k])
            } else {
              return prevV + this.state.singleDict[k].Sprice * Number(this.state.order[k])
            }
          }, 0)}元</p>
          <Divider />
          <p>按照最低价组合的订单</p>
          { Object.keys(this.state.newOrder).filter(k => k[0] === 'S').map(k => <p key={k}>{this.state.singleDict[k].Sname} * {this.state.order[k]} | 单价 {this.state.singleDict[k].Sprice}元 | 价格 {this.state.singleDict[k].Sprice * Number(this.state.order[k])}元</p>)}
          { Object.keys(this.state.newOrder).filter(k => k[0] === 'M').map(k => <p key={k}>{this.state.multiDict[k].Mname} * {this.state.order[k]} | 单价 {this.state.multiDict[k].Mprice}元 | 价格 {this.state.multiDict[k].Mprice * Number(this.state.order[k])}元</p>)}
          <p>最低价：{this.state.newCost}元</p>
          {
            this.state.lessPrice.singleToAdd !== null ?
            <div>
              <Divider />
              <p>再加一个{this.state.singleDict[this.state.lessPrice.singleToAdd].Sname}</p>
              {
                this.state.newCost - this.state.lessPrice.newMinPrice < 0 ?
                <p>可以节省{ this.state.newCost - this.state.lessPrice.newMinPrice }元</p>
                :
                <p>价格不变，相当于白送！</p>
              }
            </div>
            :
            null
          }
        </Modal>
      </Form>
    )
  }
}

Order = Form.create()(Order)

export default Order