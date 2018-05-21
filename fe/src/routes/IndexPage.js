import React from 'react';
import { connect } from 'dva';
import { Layout, Menu, Card, Tabs } from 'antd';
import CreateSingle from '../components/CreateSingle'
import CreateMulti from '../components/CreateMulti'
const { Header, Content, Footer } = Layout;
const TabPane = Tabs.TabPane

/*
 * 主页，创建菜单
 */
class IndexPage extends React.Component {
  constructor (props) {
    super(props)
    this.toOrder = this.toOrder.bind(this)
  }
  toOrder () {
    this.props.history.push('/order')
  }
  render () {
    return (
      <Layout>
        <Header style={{ position: 'fixed', width: '100%', zIndex: '1' }}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ width: '1000px', margin: 'auto', lineHeight: '64px' }}
          >
            <Menu.Item key="1">菜单录入</Menu.Item>
            <Menu.Item key="2" onClick={ this.toOrder }>点餐</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ width: '1000px', margin: 'auto', marginTop: 80 }}>
          <Card title="菜单录入">
          <Tabs defaultActiveKey="single">
            <TabPane tab="单品" key="single">
              <CreateSingle/>
            </TabPane>
            <TabPane tab="套餐" key="multi">
              <CreateMulti/>
            </TabPane>
          </Tabs>
          </Card>
        </Content>
      </Layout>
    )
  }
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
