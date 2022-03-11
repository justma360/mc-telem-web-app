import React, { useEffect, useCallback } from 'react';
import { IconButton, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';
import { ConnectedButton, DisconnectedButton } from './ConnectionButton';
import useMqttPubClient from '../../../../hooks/useMqttPubClient';
import useMqttClient from '../../../../hooks/useMqttClient';
import { RootState } from '../../../../store';
import { updateGlobalConnection } from '../../../../store/globalConnectionStatus/action';
import { msToTime, transformArduinoData } from '../../../../utils';

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

  const arduinoAck = useCallback(() => {
    handlePublishMessage(`ack${new Date().getSeconds()}`); // publish ack
    if (
      payload &&
      globalConnection.prevMessageTime &&
      payload !== globalConnection.prevMessageTime?.message // Current payload != prev
    ) {
      const latestData = transformArduinoData(payload || ''); // Get the current time when the payload is diff (ack recv)
      dispatch(
        updateGlobalConnection('status', {
          prevMessageTime: { time: latestData.time, message: payload }, // store the time of the payload entered and its value
        }),
      );
    }
    if (
      globalConnection.prevMessageTime &&
      new Date().getTime() - globalConnection.prevMessageTime?.time < 35000 // If the time of the prev and current < 10 sec ack is recent
    ) {
      dispatch(
        updateGlobalConnection('status', {
          status: 'Connected',
        }),
      );
    } else {
      dispatch(updateGlobalConnection('status', { status: 'Disconnected' }));
    }
  }, [dispatch, globalConnection.prevMessageTime, handlePublishMessage, payload]);

  const connectionStatusButton = (status: string) => {
    if (status === 'Disconnected') {
      arduinoAck();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      arduinoAck();
    }, 5000); // Interval for checking ACk

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [arduinoAck, dispatch, globalConnection.prevMessageTime, handlePublishMessage, payload]);

  return (
    <Stack direction="row" spacing={1}>
      <div style={{ width: '135px' }}>
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
      </div>
    </Stack>
  );
};

export default HeaderStatusBar;
