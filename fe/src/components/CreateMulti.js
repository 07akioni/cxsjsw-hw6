import React from 'react'
import { Form, Input, Button, message, Select } from 'antd'
import axios from 'axios'
const FormItem = Form.Item;
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 }
};

/*
 * 创建套餐的组件
 */
class CreateMulti extends React.Component {
  constructor (props) {
    super(props)
    this.check = this.check.bind(this)
    this.submit = this.submit.bind(this)
    this.state = {
      singles: [],
      singleDict: {},
      selectedSingles: []
    }
    this.mapSingleToSelection = this.mapSingleToSelection.bind(this)
    this.mapSeletedSingleToSelection = this.mapSeletedSingleToSelection.bind(this)
    this.handleChange = this.handleChange.bind(this)
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
  }
  check (e) {
    e.preventDefault()
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (err) {
        // do nothing
      } else {
        /*
         * 我还是在后端校验价格了
         */
        const currentPrice = Number(values.Mprice)
        let originalPrice = 0
        for (let singleId of values.Mcontent) {
          originalPrice += Number(values[singleId]) * Number(this.state.singleDict[singleId].Sprice)
        }
        if (currentPrice >= originalPrice) {
          message.error(`套餐价格应该比单品组合价格要低`)
          message.error(`当前价格：${currentPrice}元 >= 单品组合价格：${originalPrice}元`)
          return
        }
        this.submit(values)
      }
    })
  }
  submit (values) {
    axios({
      method: 'post',
      url: '/multi',
      data: values
    }).then(res => {
      message.info('成功创建套餐')
    }).catch(err => {
      message.error(`创建套餐失败：原因我懒得写代码传了`)
    })
  }
  mapSingleToSelection () {
    return this.state.singles.map(v => {
      return <Option key={v.Sid}>{`${v.Sid} | ${v.Sname}（${v.Sprice}元）`}</Option>
    })
  }
  mapSeletedSingleToSelection () {
    const { getFieldDecorator } = this.props.form;
    const singleDict = this.state.singleDict
    return this.state.selectedSingles.map(v => {
      const single = singleDict[v]
      return (
        <FormItem label={`${single.Sid} | ${ single.Sname }（${single.Sprice}元）`} { ...formItemLayout } key={ single.Sid }>
          {
            getFieldDecorator(`${single.Sid}`, {
              rules: [{
                required: true,
                message: '必须要输入单品数量'
              }, {
                pattern: /^[0-9]*[1-9][0-9]*$/,
                message: '请输入有效的数量'
              }]
            })(<Input placeholder="请输入数量"/>)
          }
        </FormItem>
      )
    })
  }
  handleChange (array) {
    this.setState({
      selectedSingles: array
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={ this.check } hideRequiredMark>
        <FormItem label="套餐ID" { ...formItemLayout }>
          {
            getFieldDecorator('Mid', {
              rules: [{
                required: true,
                message: 'ID不能为空'
              }, {
                len: 8,
                message: '套餐ID长度必须为8'
              }, {
                pattern: /^M\d{7}$/,
                message: '套餐ID必须M和七个数字组成'
              }]
            })(<Input/>)
          }
        </FormItem>
        <FormItem label="名称" { ...formItemLayout }>
          {
            getFieldDecorator('Mname', {
              rules: [{
                required: true,
                message: '套餐名不能为空'
              },
              {
                max: 30,
                message: '名字这么长的吗，谁记得住？'
              }]
            })(<Input/>)
          }
        </FormItem>
        <FormItem label="价格" { ...formItemLayout }>
          {
            getFieldDecorator('Mprice', {
              rules: [{
                required: true,
                message: '套餐价格不能为空'
              },
              {
                pattern: /(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$/,
                message: '请输入合法数字？'
              }]
            })(<Input/>)
          }
        </FormItem>
        <FormItem label="套餐内容" { ...formItemLayout }>
          {
            getFieldDecorator('Mcontent', {
              rules: [{
                required: true,
                message: '多少选一个单品吧'
              }]
            })(<Select
              mode="multiple"
              placeholder="请选择菜品"
              onChange={ this.handleChange }
            >
              { this.mapSingleToSelection() }
            </Select>)
          }
        </FormItem>
        {
          this.mapSeletedSingleToSelection()
        }
        <FormItem wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    )
  }
}

CreateMulti = Form.create()(CreateMulti)

export default CreateMulti