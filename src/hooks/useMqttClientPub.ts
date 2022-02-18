import { useEffect, useState } from 'react';
import mqtt, { MqttClient } from 'mqtt';

interface ReturnType {
  connectStatus: string;
  client: MqttClient | null;
  handlePublishMessage: (msg: string) => void;
}

interface OptionsType {
  protocol: 'tcp' | 'ws' | 'wss' | 'mqtts';
  host: string; // IP Address or URL
  port: number;
  topic: string;
}

const useMqttClientPub = ({ protocol, host, port, topic }: OptionsType): ReturnType => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [connectStatus, setConnectStatus] = useState('Offline');
  const [publishMessage, setPublishMessage] = useState<string | null>(null);

  const handlePublishMessage = (msg: string) => {
    setPublishMessage(msg);
  };

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
      if (publishMessage) {
        client.publish(topic, publishMessage);
      }
    }
  }, [client, topic, publishMessage]);

  return {
    connectStatus,
    client,
    handlePublishMessage,
  };
};

export default useMqttClientPub;
