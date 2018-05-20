import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import OrderPage from './routes/OrderPage';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/menuinput" exact component={IndexPage} />
        <Route path="/order" exact component={OrderPage}/>
      </Switch>
    </Router>
  );
}

export default RouterConfig;
