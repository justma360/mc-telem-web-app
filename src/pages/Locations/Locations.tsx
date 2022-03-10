import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormLabel } from '@material-ui/core';
import { Typography } from '@mui/material';
import { MainLayout } from '../../layouts';
import useMqttClient from '../../hooks/useMqttClient';
import transformArduinoData from '../../utils/transformArduinoData';
import { RootState } from '../../store';
import MarkedMap from './components/LocationMap/LocationMap';

const Locations = (): JSX.Element => {
  const defaultMapSettings = { center: { lat: 22.36, lng: 114.1 }, zoom: 11 };
  const [trackMC, setTrackMC] = useState<boolean>(false);
  const MQTTGlobalOptions = useSelector((state: RootState) => state.MQTTOptions);
  const { connectStatus, payload } = useMqttClient({
    host: MQTTGlobalOptions.host, // Home IP
    protocol: MQTTGlobalOptions.protocol, // Protocall
    port: MQTTGlobalOptions.port, // Port forward port on RPi
    topic: 'tcp/arduino_data', // topic to sub to
    duplicates: false,
    interval: 500,
  });
  const latestData = transformArduinoData(payload || '');

  const handleTrackMC = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrackMC(event.target.checked);
  };

  const handleClick = () => {
    console.log('Click Out');
  };

  return (
    <>
      <MainLayout>
        <h1>
          Location of the motorcycle:
          {connectStatus}
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
        <MarkedMap
          style={{ height: '50%', width: '95%', position: 'relative', padding: '1px' }}
          defaultCenter={defaultMapSettings.center}
          defaultZoom={defaultMapSettings.zoom}
          trackingMC={trackMC}
          arduinoData={latestData}
          onClick={handleClick}
        />
      </MainLayout>
    </>
  );
};

export default Locations;
