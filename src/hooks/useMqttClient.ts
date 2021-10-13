import { useEffect, useState } from 'react';
import mqtt, { MqttClient } from 'mqtt';

interface ReturnType {
	connectStatus: string;
	payload: string;
	client: MqttClient | null;
}

interface OptionsType {
	protocol: 'tcp' | 'ws' | 'wss' | 'mqtts';
	host: string; // IP Address or URL
	port: number;
	topic: string;
}

const useMqttClient = ({
	protocol, host, port, topic,
}: OptionsType): ReturnType => {
	const [client, setClient] = useState<MqttClient | null>(null);
	const [connectStatus, setConnectStatus] = useState('Offline');
	const [payload, setPayload] = useState<string>('');

	useEffect(() => {
		const mqttClient = mqtt.connect(`${protocol}://${host}:${port}`);
		setClient(mqttClient);
	}, []);

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
				const newPayload = message.toString();
				if (newPayload === payload) return;
				setPayload(newPayload);
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
