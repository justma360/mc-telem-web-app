import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import RawData from '../pages/RawData/RawData';
import ReduxSample from '../pages/ReduxSample/ReduxSample';
import ReduxAPISample from '../pages/ReduxAPISample/ReduxAPISample';

const MainRouter = (): JSX.Element => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/about" component={About} />
      <Route exact path="/raw-data" component={RawData} />
      <Route exact path="/redux-sample" component={ReduxSample} />
      <Route exact path="/redux-sample-api" component={ReduxAPISample} />
    </Switch>
  </Router>
);
export default MainRouter;
