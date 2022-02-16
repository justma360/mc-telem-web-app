import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const RawData = (): JSX.Element => {
  return (
    <>
      <div className="RawData">
        <Link to="/"> Home Page</Link>
      </div>

      <h1>Raw Data Page</h1>
    </>
  );
};

export default RawData;
