import { useEffect, useState } from 'react';
import mqtt, { MqttClient } from 'mqtt';

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
  duplicates: boolean;
}

const useMqttClient = ({ protocol, host, port, topic, duplicates }: OptionsType): ReturnType => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [connectStatus, setConnectStatus] = useState('Offline');
  const [payload, setPayload] = useState<string | null>(null);

  useEffect(() => {
    const mqttClient = mqtt.connect(`${protocol}://${host}:${port}`);
    setClient(mqttClient);
  }, [host, port, protocol]);

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        setConnectStatus('Connected');
      });
      client.on('error', () => {
        client.end();
      });
      client.on('reconnect', () => {
        setConnectStatus('Reconnecting');
      });
      client.subscribe(topic);
      client.on('message', (_, message) => {
        if (duplicates === false) {
          if (payload === message.toString()) return;
        }
        setPayload(message.toString());
      });
    }
  }, [client, payload, topic, duplicates]);

  return {
    connectStatus,
    payload,
    client,
  };
};

export default useMqttClient;
