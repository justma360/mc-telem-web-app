import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormLabel } from '@material-ui/core';
import { Typography, Box, Button, ButtonGroup } from '@mui/material';
import { MainLayout } from '../../layouts';
import useMqttClient from '../../hooks/useMqttClient';
import transformArduinoData from '../../utils/transformArduinoData';
import { RootState } from '../../store';
import MarkedMap from './components/LocationMap';
import styles from './styles.module.scss';

const Locations = (): JSX.Element => {
  const defaultMapSettings = { center: { lat: 22.36, lng: 114.1 }, zoom: 11 };
  const [trackMC, setTrackMC] = useState<boolean>(false);
  const MQTTGlobalOptions = useSelector((state: RootState) => state.MQTTOptions);
  const [refreshInterval, setRefreshInterval] = useState<number>(1000);
  const { connectStatus, payload } = useMqttClient({
    host: MQTTGlobalOptions.host, // Home IP
    protocol: MQTTGlobalOptions.protocol, // Protocall
    port: MQTTGlobalOptions.port, // Port forward port on RPi
    topic: 'tcp/arduino_data', // topic to sub to
    duplicates: true,
  });

  const latestData = transformArduinoData(payload || '');

  const handleTrackMC = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrackMC(event.target.checked);
  };

  const handleClick = () => {
    // console.log('Click Out');
  };

  const handleIntervalButton = (change: string) => {
    if (change === 'minus') {
      if (refreshInterval <= 100) {
        setRefreshInterval(refreshInterval - 10);
      } else {
        setRefreshInterval(refreshInterval - 100);
      }
    } else if (change === 'plus') {
      if (refreshInterval < 100) {
        setRefreshInterval(refreshInterval + 10);
      } else {
        setRefreshInterval(refreshInterval + 100);
      }
    }
  };

  return (
    <>
      <MainLayout>
        <h1>
          Location of the motorcycle:
          {connectStatus}
        </h1>

        <div className={styles.topMapOptions}>
          <FormLabel component="legend">
            <Typography variant="h6" style={{ display: 'inline-block' }}>
              Map Options:
            </Typography>
            <span> </span>
            <FormControlLabel
              control={<Switch checked={trackMC} onChange={handleTrackMC} />}
              label="Track Motorcycle"
            />
            {/* <span> Refresh Interval:</span> */}
            <ButtonGroup size="small" variant="outlined" aria-label="outlined button group">
              {refreshInterval > 10 && (
                <Button onClick={() => handleIntervalButton('minus')}>-</Button>
              )}
              {refreshInterval <= 10 && (
                <Button disabled onClick={() => handleIntervalButton('minus')}>
                  -
                </Button>
              )}
              <Button variant="contained" disableElevation>
                {refreshInterval}
                ms
              </Button>
              <Button onClick={() => handleIntervalButton('plus')}>+</Button>
            </ButtonGroup>
          </FormLabel>
        </div>
        <MarkedMap
          style={{
            height: '75%',
            width: '100%',

            padding: '5px',
          }}
          defaultCenter={defaultMapSettings.center}
          defaultZoom={defaultMapSettings.zoom}
          trackingMC={trackMC}
          arduinoData={latestData}
          onClick={handleClick}
          refreshInterval={refreshInterval}
        />
      </MainLayout>
    </>
  );
};

export default Locations;
