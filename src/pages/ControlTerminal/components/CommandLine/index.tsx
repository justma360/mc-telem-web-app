import React, { useState, useRef, useEffect } from 'react';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormLabel } from '@material-ui/core';
import { Button, TextField, Paper, List, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import useMqttPubClient from '../../../../hooks/useMqttPubClient';
import { errorClass } from '../../../../utils/Error';
import useMqttClient from '../../../../hooks/useMqttClient';
import validArduinoCommands from '../../../../constants/validArduinoCommands';
import styles from './styles.module.scss';
import { ControlItem } from '../../../../types/ControlItem';
import { RootState } from '../../../../store';
import { updateControlItemList } from '../../../../store/controlTerminal/action';
import { GreenSwitch } from './components/switches';
import parsingMqttCommand from '../../../../hooks/parsingMqttCommand';

const CommandLine = (): JSX.Element => {
  const dispatch = useDispatch();
  const controlTerminal = useSelector((state: RootState) => state.controlTerminal);
  const MQTTGlobalOptions = useSelector((state: RootState) => state.MQTTOptions);
  const { handleMqttUpdate } = parsingMqttCommand();
  const [consoleInput, setConsoleInput] = useState<string>(''); // The words in the input field

  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [currentError, setCurrentError] = useState<errorClass>({
    isError: false,
    errorType: 'Previous command: N/A',
  }); // Shows the error from terminal input
  const scrollRef = useRef<null | HTMLDivElement>(null); // Auto scroll reference

  const [publishingData, setPublishingData] = useState<boolean>(false);
  const [buttonLabel, setbuttonLabel] = useState<string>('Stopped');

  // This receives from the Arduino
  const { connectStatus, payload } = useMqttClient({
    host: MQTTGlobalOptions.host, // Home IP
    protocol: MQTTGlobalOptions.protocol, // Protocall
    port: MQTTGlobalOptions.port, // Port forward port on RPi
    topic: 'tcp/control_return', // topic to sub to
    duplicates: true,
  });
  // This sends to Arduino
  const { handlePublishMessage } = useMqttPubClient({
    host: MQTTGlobalOptions.host, // Home IP
    protocol: MQTTGlobalOptions.protocol, // Protocall
    port: MQTTGlobalOptions.port, // Port forward port on RPi
    topic: 'tcp/control', // topic to sub to
  });
  const [prevSentCommand, setPrevSentCommand] = useState<number>(0);

  // Sending commands input field
  const sendCommand = (keyPressed: string | null) => {
    if (keyPressed === 'Enter' || keyPressed === 'ButtonPressed') {
      if (!consoleInput.replace(/\s/g, '').length) {
        // Empty string?
        setCurrentError({ isError: true, errorType: 'Input are only white spaces' });
      } else {
        if (validArduinoCommands.findIndex((elements) => elements.command === consoleInput) >= 0) {
          dispatch(
            updateControlItemList('terminalList', [
              ...controlTerminal.terminalList,
              { value: consoleInput, alignment: 'right', color: 'green' },
            ]),
          );
        } else {
          dispatch(
            updateControlItemList('terminalList', [
              ...controlTerminal.terminalList,
              { value: consoleInput, alignment: 'right', color: 'red' },
            ]),
          );
        }

        handleMqttUpdate(consoleInput);
        if (connectStatus === 'Connected') {
          handlePublishMessage(consoleInput);
        }
        setCurrentError({ isError: false, errorType: `Previous command: "${consoleInput}"` });
      }
      if (autoScroll === true) {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }
      setConsoleInput(''); // Reset the text field to blank
      setPrevSentCommand(0);
    }
  };

  const handleAutoScroll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoScroll(event.target.checked);
  };

  const prevCommand = (keyPressed: string | null) => {
    let newPrevSentCommand: number | undefined = prevSentCommand;

    if (keyPressed === 'ArrowUp' && controlTerminal.terminalList.length >= newPrevSentCommand) {
      newPrevSentCommand = prevSentCommand + 1;
    } else if (keyPressed === 'ArrowDown' && newPrevSentCommand > 0) {
      newPrevSentCommand = prevSentCommand - 1;
    }

    if (!newPrevSentCommand) return;
    setPrevSentCommand(newPrevSentCommand);

    if (newPrevSentCommand >= 0 && controlTerminal.terminalList.length >= newPrevSentCommand) {
      setConsoleInput(
        controlTerminal.terminalList[controlTerminal.terminalList.length - newPrevSentCommand]
          .value,
      );
    }
  };

  // Publishing data button
  const handlePublishing = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPublishingData(event.target.checked);
    if (event.target.checked === true) {
      setbuttonLabel('Start');
      handlePublishMessage('send_data');
      dispatch(
        updateControlItemList('terminalList', [
          ...controlTerminal.terminalList,
          { value: 'start_data', alignment: 'right' },
        ]),
      );
    } else {
      setConsoleInput('stop_data');
      handlePublishMessage('stop_data');
      dispatch(
        updateControlItemList('terminalList', [
          ...controlTerminal.terminalList,
          { value: 'stop_data', alignment: 'right' },
        ]),
      );
    }
  };

  // Console terminal
  useEffect(() => {
    if (payload) {
      dispatch(
        updateControlItemList('terminalList', [
          ...controlTerminal.terminalList,
          { value: payload, alignment: 'left' },
        ]),
      );
      if (controlTerminal.terminalList.length > 500) {
        dispatch(
          updateControlItemList('terminalList', [
            ...controlTerminal.terminalList.slice(1),
            { value: payload, alignment: 'left' },
          ]),
        );
      }
    }
    if (autoScroll === true) {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload]); // Event is when payload changes

  return (
    <>
      <Typography variant="h3">
        MQTT IP:
        {MQTTGlobalOptions.protocol}
        {MQTTGlobalOptions.host}
      </Typography>
      <Typography variant="h3" display="inline">
        Terminal connection status:
        {connectStatus}
      </Typography>

      <FormGroup>
        <FormLabel component="legend">
          <Typography variant="h6" style={{ display: 'inline-block' }}>
            Terminal Options:
          </Typography>
          <span> </span>
          <FormControlLabel
            control={<Switch checked={autoScroll} onChange={handleAutoScroll} />}
            label="Auto Scroll"
          />
          <FormControlLabel
            control={<GreenSwitch checked={publishingData} onChange={handlePublishing} />}
            label={buttonLabel}
          />
        </FormLabel>
      </FormGroup>

      <Paper ref={scrollRef} variant="outlined" className={styles.consoleTerminal}>
        <List dense>
          <Typography component="span">
            {controlTerminal.terminalList.map((item: ControlItem, index: number) => (
              // eslint-disable-next-line react/no-array-index-key
              <Typography align={item.alignment} color={item.color} key={item.value + index}>
                {item.value}
              </Typography>
            ))}
          </Typography>
        </List>
      </Paper>

      <Paper className={styles.consoleLine} variant="outlined">
        <div className={styles.inputCommandContainer}>
          <TextField
            fullWidth
            label="Commands to Publish"
            id="CommandLine"
            onChange={(event) => setConsoleInput(event.target.value)} // when the field changes set the value to be input
            value={consoleInput} // The field value is the input
            onKeyPress={(event) => sendCommand(event.key)}
            onKeyDown={(event) => prevCommand(event.key)}
            color="primary"
            autoComplete="off"
          />

          <Button
            onClick={() => {
              sendCommand('ButtonPressed'); // Copy the current list of animals and add the new consoleInput value from the text field
            }}
            type="button"
          >
            Send
          </Button>
        </div>

        {currentError.isError && (
          <div className="center" style={{ color: 'red' }}>
            {currentError.errorType}
          </div>
        )}
      </Paper>
    </>
  );
};

export default CommandLine;
