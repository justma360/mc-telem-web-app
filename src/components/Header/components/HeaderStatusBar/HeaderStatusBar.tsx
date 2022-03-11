import React from 'react';
import { IconButton, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';
import { ConnectedButton, DisconnectedButton } from './ConnectionButton';
import useMqttPubClient from '../../../../hooks/useMqttPubClient';
import useMqttClient from '../../../../hooks/useMqttClient';
import { RootState } from '../../../../store';
import { updateGlobalConnection } from '../../../../store/globalConnectionStatus/action';
import { transformArduinoData } from '../../../../utils';

const HeaderStatusBar = (): JSX.Element => {
  const MQTTGlobalOptions = useSelector((state: RootState) => state.MQTTOptions);
  const globalConnection = useSelector((state: RootState) => state.globalConnectionStatus);
  const dispatch = useDispatch();
  // This receives from the Arduino
  const { connectStatus, payload } = useMqttClient({
    host: MQTTGlobalOptions.host, // Home IP
    protocol: MQTTGlobalOptions.protocol, // Protocall
    port: MQTTGlobalOptions.port, // Port forward port on RPi
    topic: 'tcp/control_return', // topic to sub to
    duplicates: true,
  });
  const { handlePublishMessage } = useMqttPubClient({
    host: MQTTGlobalOptions.host, // Home IP
    protocol: MQTTGlobalOptions.protocol, // Protocall
    port: MQTTGlobalOptions.port, // Port forward port on RPi
    topic: 'tcp/control', // topic to sub to
  });
  const latestData = transformArduinoData(payload || '');

  const connectionStatusButton = (status: string) => {
    if (status === 'Disconnected') {
      handlePublishMessage(`ack${new Date().getSeconds()}`);
      if (payload !== null) {
        dispatch(updateGlobalConnection('status', { status: 'Connected' }));
      }
    }
  };

  const timoutID = setTimeout(() => {
    // // console.log(`ack${new Date().getSeconds()}`);
    handlePublishMessage(`ack${new Date().getSeconds()}`);
    dispatch(updateGlobalConnection('prevMessageTime', { status: 'Connected' }));

    if (payload !== null) {
      dispatch(updateGlobalConnection('status', { status: 'Connected' }));
    } else {
      dispatch(updateGlobalConnection('status', { status: 'Disconnected' }));
    }
  }, 10000);

  return (
    <Stack direction="row" spacing={1}>
      <IconButton>
        {globalConnection.status === 'Connected' && (
          <ConnectedButton
            className={styles.connectionButton}
            onClick={() => connectionStatusButton('Disconnected')}
          >
            {globalConnection.status}
          </ConnectedButton>
        )}
        {globalConnection.status === 'Disconnected' && (
          <DisconnectedButton
            className={styles.connectionButton}
            onClick={() => connectionStatusButton('Disconnected')}
          >
            {globalConnection.status}
          </DisconnectedButton>
        )}
      </IconButton>
    </Stack>
  );
};

export default HeaderStatusBar;
