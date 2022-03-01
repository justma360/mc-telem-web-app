import { useEffect, useState } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import MQTTOptionsType from '../types/MQTTOptionsType';

interface ReturnType {
  connectStatus: string;
  client: MqttClient | null;
  handlePublishMessage: (msg: string) => void;
}

const useMqttPubClient = ({ protocol, host, port, topic }: MQTTOptionsType): ReturnType => {
  // const [prevMessage, setPrevMessage] = useState<string[]>(['na', 'na']);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
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
        setReconnectAttempts(reconnectAttempts + 1);
        if (reconnectAttempts > 5) {
          client.end();
          setReconnectAttempts(0);
        }
      });

      if (publishMessage && topic) {
        client.publish(topic, publishMessage);
      }
    }
  }, [client, topic, publishMessage, reconnectAttempts]);

  return {
    connectStatus,
    client,
    handlePublishMessage,
  };
};

export default useMqttPubClient;
