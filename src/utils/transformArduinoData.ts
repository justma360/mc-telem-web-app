import { ArduinoData } from '../types';

export const transformArduinoData = (data: string): ArduinoData => {
  /** Transforms string data to float */
  const dataSplit = data.split(',');

  const arduinoTimeString = dataSplit[0];
  const numberData = dataSplit.slice(1).map((item) => parseFloat(item));

  const currentDate = `${
    new Date().getMonth() + 1
  }/${new Date().getDate()}/${new Date().getFullYear()}`;

  const currentArduinoTime = `${currentDate} ${arduinoTimeString}`;
  const date = new Date(currentArduinoTime); // some mock date
  const arduinoTimeMillis = date.getTime();
  /** Transform numberData to arduinoData interface */
  const arduinoData: ArduinoData = {
    time: new Date().getTime(),
    arduinoTime: arduinoTimeMillis,
    angleX: Math.round(numberData[0]),
    angleY: Math.round(numberData[1]),
    angleZ: Math.round(numberData[2]),
    gpsLat: numberData[3],
    gpsLong: numberData[4],
    gpsAngle: numberData[5],
    tyreTemp: Math.round(numberData[6]),
    ambientTemp: Math.round(numberData[7]),
    gpsSpeed: Math.round(numberData[8]),
  };

  return arduinoData;
};

export default transformArduinoData;
