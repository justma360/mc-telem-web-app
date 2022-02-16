import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const About = (): JSX.Element => {
  return (
    <>
      <div>
        <Link to="/"> Home Page</Link>
      </div>

      <h1>About Page</h1>
    </>
  );
};

export default About;
