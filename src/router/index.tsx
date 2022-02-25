import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import RawData from '../pages/RawData/RawData';
import Graphs from '../pages/Graphs/Graphs';
import About from '../pages/About/About';
import Home from '../pages/Home/Home';
import Blog from '../pages/Blog/Blog';
import ControlTerminal from '../pages/ControlTerminal/ControlTerminal';

const MainRouter = (): JSX.Element => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/raw-data" component={RawData} />
      <Route exact path="/graphs" component={Graphs} />
      <Route exact path="/ControlTerminal" component={ControlTerminal} />
      <Route exact path="/about" component={About} />
      <Route exact path="/blog" component={Blog} />
    </Switch>
  </Router>
);
export default MainRouter;
