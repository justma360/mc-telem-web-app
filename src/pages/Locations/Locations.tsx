import React, { useState, useEffect } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { useSelector } from 'react-redux';
import { MainLayout } from '../../layouts';
import MarkedMap from './components/Maps/MarkedMap';
import Marker from './components/Marker/Marker';
import useMqttClient from '../../hooks/useMqttClient';
import transformArduinoData from '../../utils/transformArduinoData';
import { RootState } from '../../store';

interface mapLocation {
  lat: number;
  lng: number;
}

const Locations = (): JSX.Element => {
  const [mapCenter, setMapCenter] = useState<mapLocation>({
    lat: 22.319,
    lng: 114.169,
  });
  const [mapZoom, setMapZoom] = useState<number>(11);
  const [mcLocation, setMcLocation] = useState<mapLocation | undefined>();

  const MQTTGlobalOptions = useSelector((state: RootState) => state.MQTTOptions);
  const { connectStatus, payload } = useMqttClient({
    host: MQTTGlobalOptions.host, // Home IP
    protocol: MQTTGlobalOptions.protocol, // Protocall
    port: MQTTGlobalOptions.port, // Port forward port on RPi
    topic: 'tcp/arduino_data', // topic to sub to
    duplicates: false,
  });
  const latestData = transformArduinoData(payload || '');

  useEffect(() => {
    const intervalId = setInterval(() => {
      // console.log('change');
      setMcLocation({
        lat: latestData.gpsLat,
        lng: latestData.gpsLong - new Date().getSeconds() / 1000,
      });
      setMapZoom(13);
    }, 1000);
    return () => clearInterval(intervalId); // This is important
  }, [latestData.gpsLat, latestData.gpsLong]);

  const render = (status: Status) => {
    return <h1>{status}</h1>;
  };

  // const onClick = () => {
  //   console.log('Click');
  // };

  // const onIdle = () => {
  //   console.log('Idle');
  // };

  return (
    <>
      <MainLayout>
        <h1>
          Location of the motorcycle:
          {connectStatus}
        </h1>
        <Wrapper apiKey="AIzaSyDqVBwLWJmQraO_Zz6PYAHze_vpcRbiQR0" render={render}>
          <MarkedMap
            center={mapCenter}
            zoom={mapZoom}
            style={{ flexGrow: '1', height: '50%' }}
            // onClick={onClick}
            // onIdle={onIdle}
            key={mapCenter.toString() + mapZoom + new Date().getMinutes()}
            // key={new Date().getTime()}
          >
            <Marker key="Daytona675R_Loc" position={mcLocation} />
          </MarkedMap>
        </Wrapper>
      </MainLayout>
    </>
  );
};

export default Locations;
