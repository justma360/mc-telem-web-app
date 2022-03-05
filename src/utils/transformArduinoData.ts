import { ArduinoData } from '../types';

export const transformArduinoData = (data: string): ArduinoData => {
  /** Transforms string data to float */
  const numberData = data.split(',').map((item) => parseFloat(item));

  /** Transform numberData to arduinoData interface */
  const arduinoData: ArduinoData = {
    angleX: Math.round(numberData[0]),
    angleY: Math.round(numberData[1]),
    angleZ: Math.round(numberData[2]),
    gpsLat: numberData[3],
    gpsLong: numberData[4],
    gpsSpeed: Math.round(numberData[5]),
    tyreTemp: Math.round(numberData[6]),
    ambientTemp: Math.round(numberData[7]),
    time: new Date().getTime(),
  };

  return arduinoData;
};

export default transformArduinoData;
