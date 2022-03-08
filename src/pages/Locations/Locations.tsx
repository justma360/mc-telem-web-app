import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormLabel } from '@material-ui/core';
import { Typography } from '@mui/material';
import { connect } from 'http2';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { MainLayout } from '../../layouts';
import useMqttClient from '../../hooks/useMqttClient';
import transformArduinoData from '../../utils/transformArduinoData';
import { RootState } from '../../store';
import GMap from './components/GMap/GMap';
import MarkedMap from './components/Maps/MarkedMap';

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
  const [trackMC, setTrackMC] = useState<boolean>(false);
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
    // const intervalId = setInterval(() => {
    //   // console.log('change');
    //   setMcLocation({
    //     lat: latestData.gpsLat,
    //     lng: latestData.gpsLong + new Date().getSeconds() / 10000,
    //   });
    //   setMapZoom(15);
    // }, 10000);
    // return () => clearInterval(intervalId); // This is important
  }, []);

  const onClick = () => {
    console.log('Click Out');
  };

  const onIdle = () => {
    console.log('Idle');
  };

  const handleTrackMC = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrackMC(event.target.checked);
  };

  return (
    <>
      <MainLayout>
        <h1>
          Location of the motorcycle:
          {/* {connectStatus} */}
        </h1>
        <FormGroup>
          <FormLabel component="legend">
            <Typography variant="h6" style={{ display: 'inline-block' }}>
              Map Options:
            </Typography>
            <span> </span>
            <FormControlLabel
              control={<Switch checked={trackMC} onChange={handleTrackMC} />}
              label="Track Motorcycle"
            />
          </FormLabel>
        </FormGroup>

        {/* <GMap center={mapCenter} zoom={mapZoom} onClick={onClick} key="hello2" /> */}

        <Wrapper apiKey="AIzaSyDqVBwLWJmQraO_Zz6PYAHze_vpcRbiQR0">
          <MarkedMap
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '50%', width: '95%', position: 'relative', padding: '1px' }}
          />
        </Wrapper>
      </MainLayout>
    </>
  );
};

export default Locations;
