import React, { useState, useEffect } from 'react';
import useMqttClient from '../../hooks/useMqttClient';
import transformArduinoData from '../../utils/transformArduinoData';
import { ArduinoData } from '../../types';

const Home = (): JSX.Element => {
  const [sensorDataArr, setSensorDataArr] = useState<ArduinoData[]>([]);

  const { connectStatus, payload } = useMqttClient({
    host: '14.198.73.121', // Home IP
    protocol: 'tcp', // Protocall
    port: 9001,
    topic: 'tcp/arduino_data', // topic to sub to
  });

  useEffect(() => {
    // Event listener
    if (payload) {
      // If the payload has arrived (useMQTT checks to make sure its new)
      const arduinoData = transformArduinoData(payload); // Transform the arduino Payload
      if (sensorDataArr.length >= 501) {
        setSensorDataArr([...sensorDataArr.slice(1), arduinoData]); // Appends data to array
      } else {
        setSensorDataArr([...sensorDataArr, arduinoData]); // Appends data to array
      }
    }
    console.log(sensorDataArr.length);
  }, [payload]); // Event is when payload changes

  const latestData = transformArduinoData(payload || '');

  return (
    <>
      <h1>
        Status:
        {connectStatus}
      </h1>
      <br />
      <h1>
        Latest Data:
        {Object.keys(latestData || {}).map((key) => (
          <p key={key}>{`${key as keyof ArduinoData}: ${latestData[key as keyof ArduinoData]}`}</p>
        ))}
        {/* <p>{`Angle X: ${latestData?.angleX}`}</p> */}
      </h1>
    </>
  );
};

export default Home;

// return (
//   <>
//     <h1>
//       Status:
//       {/* {returnValue} */}
//       {connectStatus}
//     </h1>
//     <h1>
//       Payload:
//       {payload}
//     </h1>
//     <h1>
//       Latest Data:
//       <p>
//         Angle X =
//         {latestData.angleX}
//       </p>
//     </h1>
//     {/* <div>
//       {sensorDataArr[-1].map(({ time, angleX, angleY }) => (
//         <div key={time}>
//           <p>
//             AngleX:
//             {angleX}
//           </p>
//           <p>
//             AngleY:
//             {angleY}
//           </p>
//         </div>
//       ))}
//     </div> */}
//   </>
// );
