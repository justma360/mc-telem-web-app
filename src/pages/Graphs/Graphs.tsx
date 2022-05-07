import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { MainLayout } from '../../layouts';
import { ArduinoData } from '../../types';
import transformArduinoData from '../../utils/transformArduinoData';
import useMqttClient from '../../hooks/useMqttClient';
import { RootState } from '../../store';
import TemperatureChart from './components/TemperatureChart';
import SpeedGauge from './components/SpeedGauge';

const Graphs = (): JSX.Element => {
  const MQTTGlobalOptions = useSelector((state: RootState) => state.MQTTOptions);
  const { connectStatus, payload } = useMqttClient({
    host: MQTTGlobalOptions.host, // Home IP
    protocol: MQTTGlobalOptions.protocol, // Protocall
    port: MQTTGlobalOptions.port, // Port forward port on RPi
    topic: 'tcp/arduino_data', // topic to sub to
    duplicates: false,
  });

  const sensorDataArr: ArduinoData[] = useMemo(() => [], []);
  // Event listener
  useEffect(() => {
    // If the payload has arrived (useMQTT checks to make sure its new)
    if (payload) {
      if (sensorDataArr.length > 600) {
        sensorDataArr.slice(1);
      }
      const arduinoData = transformArduinoData(payload); // Transform the arduino Payload
      sensorDataArr.push(arduinoData);
    }
  }, [payload, sensorDataArr]); // Event is when payload changes

  return (
    <>
      <MainLayout>
        <Typography variant="h3">
          Status:
          {connectStatus}
        </Typography>

        <Typography variant="h6">Graph will be placed here</Typography>
        <TemperatureChart dataInput={sensorDataArr} updateInterval={2} />
        <SpeedGauge dataInput={sensorDataArr} updateInterval={0.5} />
      </MainLayout>
    </>
  );
};

export default Graphs;
