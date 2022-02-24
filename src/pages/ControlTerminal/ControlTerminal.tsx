import React from 'react';
import CommandLine from './components/CommandLine';
import { MainLayout } from '../../layouts';
import CommandsTable from './components/CommandsTable';

const ControlTerminal = (): JSX.Element => {
  return (
    <MainLayout>
      <h1>Sending commands to the Telemetry</h1>
      <CommandLine />

      <h2>Commands</h2>
      <CommandsTable />
    </MainLayout>
  );
};

export default ControlTerminal;
