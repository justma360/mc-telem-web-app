import React, { useEffect, useCallback, useState } from 'react';
import { Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';
import { ConnectedButton, DisconnectedButton, SendingButton } from './ConnectionButton';
import useMqttPubClient from '../../../../hooks/useMqttPubClient';
import useMqttClient from '../../../../hooks/useMqttClient';
import { RootState } from '../../../../store';
import { updateGlobalConnection } from '../../../../store/globalConnectionStatus/action';

// type possibleButtonState = 'Connected' | 'Disconnected' | 'Sending' | undefined;
let prevAckTime = 0;
let connectedTopic = 'tcp.control_return';

const HeaderStatusBar = (): JSX.Element => {
  const MQTTGlobalOptions = useSelector((state: RootState) => state.MQTTOptions);
  const globalConnection = useSelector((state: RootState) => state.globalConnectionStatus);
  const dispatch = useDispatch();
  // This receives from the Arduino

  const { payload } = useMqttClient({
    host: MQTTGlobalOptions.host, // Home IP
    protocol: MQTTGlobalOptions.protocol, // Protocall
    port: MQTTGlobalOptions.port, // Port forward port on RPi
    topic: globalConnection.connectedTopic, // default tcp/control_return
    duplicates: true,
  });
  const { handlePublishMessage } = useMqttPubClient({
    host: MQTTGlobalOptions.host, // Home IP
    protocol: MQTTGlobalOptions.protocol, // Protocall
    port: MQTTGlobalOptions.port, // Port forward port on RPi
    topic: 'tcp/control', // topic to sub to
  });

  const arduinoAck = useCallback(
    (ackType?: string) => {
      if (ackType === 'Sending') {
        dispatch(
          updateGlobalConnection('status', {
            status: 'Sending',
            connectedTopic: 'tcp/arduino_data',
          }),
        );
        connectedTopic = 'tcp/arduino_data';
      } else {
        // if not sending then acking
        dispatch(
          updateGlobalConnection('status', {
            connectedTopic: 'tcp/control_return',
          }),
        );
        connectedTopic = 'tcp/control_return';
        handlePublishMessage(`ack${new Date().getSeconds()}`); // publish ack
        console.log(`SENT ack${new Date().getSeconds()}`);
      }

      if (
        payload !== globalConnection.prevMessageTime?.message // Current payload != prev
      ) {
        prevAckTime = new Date().getTime();
        dispatch(
          updateGlobalConnection('prevMessageTime', {
            prevMessageTime: { time: new Date().getTime(), message: payload }, // store the time of the payload entered and its value
          }),
        );
      }

      if (new Date().getTime() - prevAckTime < 35000) {
        // Check the topic and check the status accordingly if its data then its sending data
        if (connectedTopic === 'tcp/arduino_data') {
          dispatch(
            updateGlobalConnection('status', {
              status: 'Sending',
            }),
          );
        } else {
          dispatch(
            updateGlobalConnection('status', {
              status: 'Connected',
            }),
          );
        }
      } else {
        // payload didn't change in time (>35s) = disconnected no ACK
        dispatch(
          updateGlobalConnection('status', {
            status: 'Disconnected',
            connectedTopic: 'tcp/control_return',
          }),
        );
      }
    },
    [dispatch, globalConnection.prevMessageTime?.message, handlePublishMessage, payload],
  );

  const connectionStatusButton = useCallback(
    (status: string) => {
      if (status === 'Disconnected') {
        console.log('Disconnect button');
        arduinoAck('Connected'); // Sends ack signal to get connected
      } else if (status === 'Connected') {
        console.log('Starting Data');
        handlePublishMessage('start_data');
        arduinoAck('Sending'); // change the ack to check arduino data
      } else if (status === 'Sending') {
        console.log('Stopping data');
        arduinoAck('Connected'); // Go to connected (stop data)
        handlePublishMessage('stop_data');
      }
    },
    [arduinoAck, handlePublishMessage],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      arduinoAck();
    }, 5000); // Interval for checking ACk

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [arduinoAck]);

  return (
    <>
      <Stack direction="row" spacing={1}>
        <div style={{ width: '135px' }}>
          {globalConnection.status === 'Disconnected' && (
            <DisconnectedButton
              className={styles.connectionButton}
              onClick={() => connectionStatusButton('Disconnected')}
            >
              {globalConnection.status}
            </DisconnectedButton>
          )}
          {globalConnection.status === 'Connected' && (
            <ConnectedButton
              className={styles.connectionButton}
              onClick={() => connectionStatusButton('Connected')}
            >
              {globalConnection.status}
            </ConnectedButton>
          )}
          {globalConnection.status === 'Sending' && (
            <SendingButton
              className={styles.connectionButton}
              onClick={() => connectionStatusButton('Sending')}
            >
              {globalConnection.status}
            </SendingButton>
          )}
        </div>
      </Stack>
    </>
  );
};

export default HeaderStatusBar;
