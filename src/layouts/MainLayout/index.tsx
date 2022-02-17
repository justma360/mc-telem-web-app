import React, { ReactNode } from 'react';
import { Header } from '../../components';

interface Props {
  children: ReactNode;
}
export const MainLayout = ({ children }: Props): JSX.Element => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default MainLayout;
