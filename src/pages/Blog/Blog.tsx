import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../layouts';

const Blog = (): JSX.Element => {
  return (
    <>
      <MainLayout>
        <div>
          <Link to="/"> Home Page</Link>
        </div>

        <h1>This is where I will talk about my life and shiz</h1>
      </MainLayout>
    </>
  );
};

export default Blog;
