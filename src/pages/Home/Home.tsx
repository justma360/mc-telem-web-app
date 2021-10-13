import React from 'react';
import useMqttClient from '../../hooks/useMqttClient';

const Home = (): JSX.Element => {
	const { connectStatus, payload } = useMqttClient({
		host: '14.198.73.92',
		protocol: 'ws',
		port: 9001,
		topic: 'ws/angle_monitor',
	});

	return (
		<>
			<h1>
				Status:
				{connectStatus}
			</h1>
			<h1>
				Payload:
				{payload}
			</h1>
		</>
	);
};

export default Home;
