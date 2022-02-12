import { ArduinoData } from '../types';

export const transformArduinoData = (data: string): ArduinoData => {
	/** Transforms string data to float */
	const numberData = data.split(',').map((item) => parseFloat(item));

	/** Transform numberData to arduinoData interface */
	const arduinoData: ArduinoData = {
		angleX: numberData[0],
		angleY: numberData[1],
		angleZ: numberData[2],
		gpsLat: numberData[3],
		gpsLong: numberData[4],
		gpsSpeed: numberData[5],
		tyreTemp: numberData[6],
		time: new Date().getTime(),
	};

	return arduinoData;
};

export default transformArduinoData;
