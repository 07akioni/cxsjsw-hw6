import React from 'react'
import { Form, Input, Button, message } from 'antd'
import axios from 'axios'
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 }
};

/*
 * 创建单品的组件
 * 还是单品好写啊，其他的部分那作业描述的算什么鬼，作为一个软件说明文档我给打-10分
 */
class CreateSingle extends React.Component {
  constructor (props) {
    super(props)
    this.check = this.check.bind(this)
    this.submit = this.submit.bind(this)
  }
  check (e) {
    e.preventDefault()
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (err) {
        // do nothing
      } else {
        this.submit(values)
      }
    })
  }
  submit (values) {
    axios({
      method: 'post',
      url: '/single',
      data: values
    }).then(res => {
      message.info('成功创建单品')
    }).catch(err => {
      message.error(`创建单品失败：原因我懒得写代码传了`)
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={ this.check } hideRequiredMark>
        <FormItem label="单品ID" { ...formItemLayout }>
          {
            getFieldDecorator('Sid', {
              rules: [{
                required: true,
                message: 'ID不能为空'
              }, {
                len: 8,
                message: '单品ID长度必须为8'
              }, {
                pattern: /^S\d{7}$/,
                message: '课程ID必须S和七个数字组成'
              }]
            })(<Input/>)
          }
        </FormItem>
        <FormItem label="名称" { ...formItemLayout }>
          {
            getFieldDecorator('Sname', {
              rules: [{
                required: true,
                message: '单品名不能为空'
              },
              {
                max: 20,
                message: '名字这么长的吗，谁记得住？'
              }]
            })(<Input/>)
          }
        </FormItem>
        <FormItem label="价格" { ...formItemLayout }>
          {
            getFieldDecorator('Sprice', {
              rules: [{
                required: true,
                message: '单品价格不能为空'
              },
              {
                pattern: /(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$/,
                message: '请输入一个合法数字'
              }]
            })(<Input/>)
          }
        </FormItem>
        <FormItem wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    )
  }
}

CreateSingle = Form.create()(CreateSingle)

export default CreateSingle