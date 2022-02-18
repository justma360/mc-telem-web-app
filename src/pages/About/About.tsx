import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../layouts';

const About = (): JSX.Element => {
  return (
    <>
      <MainLayout>
        <div>
          <Link to="/"> Home Page</Link>
        </div>
        <h1>About Page</h1>
      </MainLayout>
    </>
  );
};

export default About;
