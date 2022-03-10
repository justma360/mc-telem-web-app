import { useEffect, useState } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import MQTTOptionsType from '../types/MQTTOptionsType';

interface ReturnType {
  connectStatus: string;
  payload: string | null;
  client: MqttClient | null;
}

const useMqttClient = ({
  host,
  protocol,
  port,
  topic,
  duplicates,
  interval,
}: MQTTOptionsType): ReturnType => {
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
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
        setReconnectAttempts(reconnectAttempts + 1);
        if (reconnectAttempts > 5) {
          client.end();
          setReconnectAttempts(0);
        }
      });
      if (topic) {
        client.subscribe(topic);
        client.on('message', (_, message) => {
          if (interval) {
            setInterval(function updatePayload() {
              if (duplicates === false) {
                if (payload === message.toString()) return;
              }
              setPayload(message.toString());
            }, interval);
            // if (duplicates === false) {
            //   if (payload === message.toString()) return;
            // }
            // setPayload(message.toString());
          }
        });
      }
    }
  }, [client, payload, topic, duplicates, reconnectAttempts, interval]);

  return {
    connectStatus,
    payload,
    client,
  };
};

export default useMqttClient;
