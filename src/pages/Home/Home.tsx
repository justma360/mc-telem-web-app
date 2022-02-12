import React, { useState, useEffect } from 'react';
import useMqttClient from '../../hooks/useMqttClient';
import transformArduinoData from '../../utils/transformArduinoData';
import { ArduinoData } from '../../types';

const Home = (): JSX.Element => {
	const [dataArr, setDataArr] = useState<ArduinoData[]>([]);

	const tempData = '3.000000,-1.625000,0.000000,0.000000,0.000000,0.000000,21.790003'; // Data from the Arduino (string)

	const dataArray = tempData.split(',');

	const dataJSON = {
		time: Date.now(), // Date and time in UNIX format
		angle_x: dataArray[0],
		angle_y: dataArray[1],
		angle_z: dataArray[2],
		gps_lat: dataArray[3],
		gps_lon: dataArray[4],
		gps_speed: dataArray[5],
		tyre_temp: dataArray[6],
	};

	const { connectStatus, payload } = useMqttClient({
		host: '210.6.106.70',
		protocol: 'tcp',
		port: 9001,
		topic: 'tcp/arduino_data',
	});

	useEffect(() => {
		if (payload) {
			const arduinoData = transformArduinoData(payload);
			setDataArr([...dataArr, arduinoData]);
		}
	}, [payload]);

	return (
		<>
			<h1>
				Status:
				{/* {returnValue} */}
				{connectStatus}
			</h1>
			<h1>
				Payload:
				{payload}
				{/* {getDayArray} */}
			</h1>
		</>
	);
};

export default Home;
