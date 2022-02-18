import React, { useEffect, useMemo } from 'react';
import { ArduinoData } from '../../types';
import transformArduinoData from '../../utils/transformArduinoData';
import useMqttClient from '../../hooks/useMqttClient';
import { MainLayout } from '../../layouts';

const RawData = (): JSX.Element => {
  const { connectStatus, payload } = useMqttClient({
    host: '14.198.73.121', // Home IP
    protocol: 'tcp', // Protocall
    port: 9001,
    topic: 'tcp/arduino_data', // topic to sub to
  });
  const sensorDataArr: ArduinoData[] = useMemo(() => [], []);

  useEffect(() => {
    // Event listener
    if (payload) {
      // If the payload has arrived (useMQTT checks to make sure its new)
      const arduinoData = transformArduinoData(payload); // Transform the arduino Payload
      sensorDataArr.push(arduinoData);
      // console.log(sensorDataArr.length);
    }
  }, [payload, sensorDataArr]); // Event is when payload changes

  const latestData = transformArduinoData(payload || '');

  return (
    <MainLayout>
      <h1>
        Status:
        {connectStatus}
      </h1>
      <br />
      <h1>
        Latest Data:
        {Object.keys(latestData || {}).map((key) => (
          <p key={key}>{`${key as keyof ArduinoData}: ${latestData[key as keyof ArduinoData]}`}</p>
        ))}
        {/* <p>{`Angle X: ${latestData?.angleX}`}</p> */}
      </h1>
    </MainLayout>
  );
};

export default RawData;
