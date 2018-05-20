import React from 'react';
import { connect } from 'dva';
import { Layout, Menu, Card, Tabs } from 'antd';
import Order from '../components/Order'
const { Header, Content, Footer } = Layout;
const TabPane = Tabs.TabPane


class IndexPage extends React.Component {
  constructor (props) {
    super(props)
    this.toInput = this.toInput.bind(this)
  }
  toInput () {
    this.props.history.push('/')
  }
  render () {
    return (
      <Layout>
        <Header style={{ position: 'fixed', width: '100%', zIndex: '1' }}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ width: '1000px', margin: 'auto', lineHeight: '64px' }}
            defaultOpenKeys={["2"]}
          >
            <Menu.Item key="1" onClick={ this.toInput }>菜单录入</Menu.Item>
            <Menu.Item key="2">点餐</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ width: '1000px', margin: 'auto', marginTop: 80 }}>
          <Card title="菜单录入">
            <Order/>
          </Card>
        </Content>
      </Layout>
    )
  }
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
