import React from 'react';
import { useSelector } from 'react-redux';
import { ArduinoData } from '../../types';
import transformArduinoData from '../../utils/transformArduinoData';
import useMqttClient from '../../hooks/useMqttClient';
import { MainLayout } from '../../layouts';
import { RootState } from '../../store';

const RawData = (): JSX.Element => {
  const MQTTGlobalOptions = useSelector((state: RootState) => state.MQTTOptions);
  const { connectStatus, payload } = useMqttClient({
    host: MQTTGlobalOptions.host, // Home IP
    protocol: MQTTGlobalOptions.protocol, // Protocall
    port: MQTTGlobalOptions.port, // Port forward port on RPi
    topic: 'tcp/arduino_data', // topic to sub to
    duplicates: false,
  });

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
      </h1>
    </MainLayout>
  );
};

export default RawData;
