import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ReduxAPISample from '../pages/ReduxAPISample/ReduxAPISample';
import ReduxSample from '../pages/ReduxSample/ReduxSample';
import RawData from '../pages/RawData/RawData';
import About from '../pages/About/About';
import Home from '../pages/Home/Home';
import Blog from '../pages/Blog/Blog';

const MainRouter = (): JSX.Element => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/about" component={About} />
      <Route exact path="/raw-data" component={RawData} />
      <Route exact path="/blog" component={Blog} />
      <Route exact path="/redux-sample" component={ReduxSample} />
      <Route exact path="/redux-sample-api" component={ReduxAPISample} />
    </Switch>
  </Router>
);
export default MainRouter;
