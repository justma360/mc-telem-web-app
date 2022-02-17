import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { MainLayout } from '../../layouts';

const RawData = (): JSX.Element => {
  return (
    <MainLayout>
      <div className="RawData">
        <Link to="/"> Home Page</Link>
      </div>

      <h1>Raw Data Page</h1>
    </MainLayout>
  );
};

export default RawData;
