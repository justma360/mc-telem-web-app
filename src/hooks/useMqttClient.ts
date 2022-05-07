import { useEffect, useState, useRef } from 'react';
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
}: MQTTOptionsType): ReturnType => {
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [client, setClient] = useState<MqttClient | null>(null);
  const [connectStatus, setConnectStatus] = useState('Offline');
  const [payload, setPayload] = useState<string | null>(null);
  const numRef = useRef<string>('');

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
          if (duplicates === false) {
            if (payload === message.toString()) return;
          }
          numRef.current = message.toString();
          setPayload(message.toString());
        });
      }
    }
  }, [client, payload, topic, duplicates, reconnectAttempts]);
  // console.log('Payload is at', payload);
  return {
    connectStatus,
    payload,
    client,
  };
};

export default useMqttClient;

// if (interval !== undefined) {
//   setInterval(function updatePayload() {
//     client.on('message', (_, message) => {
//       if (duplicates === false) {
//         if (payload === message.toString()) return;
//       }
//       setPayload(message.toString());
//     });
//   }, interval);
// }
