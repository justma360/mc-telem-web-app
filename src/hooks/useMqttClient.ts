import { useEffect, useState } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import { ArduinoData } from '../types';
import { transformArduinoData } from '../utils';

interface ReturnType {
  connectStatus: string;
  payload: string | null;
  client: MqttClient | null;
}

interface OptionsType {
  protocol: 'tcp' | 'ws' | 'wss' | 'mqtts';
  host: string; // IP Address or URL
  port: number;
  topic: string;
}

const useMqttClient = ({ protocol, host, port, topic }: OptionsType): ReturnType => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [connectStatus, setConnectStatus] = useState('Offline');
  const [payload, setPayload] = useState<string | null>(null);

  useEffect(() => {
    const mqttClient = mqtt.connect(`${protocol}://${host}:${port}`);
    setClient(mqttClient);
  }, []);

  useEffect(() => {
    if (client) {
      let connectionStatus = 0;
      client.on('connect', () => {
        setConnectStatus('Connected');
        connectionStatus = 1;
      });
      client.on('error', () => {
        client.end();
        connectionStatus = -1;
      });
      client.on('reconnect', () => {
        setConnectStatus('Reconnecting');
        connectionStatus = 0;
      });
      client.subscribe(topic);
      client.on('message', (_, message) => {
        if (payload === message.toString()) return;
        setPayload(message.toString());
      });
    }
  }, [client]);

  return {
    connectStatus,
    payload,
    client,
  };
};

export default useMqttClient;
