import React, { useState, useRef, useEffect } from 'react';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormLabel } from '@material-ui/core';
import { Button, TextField, Paper, List, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import { alpha, styled } from '@mui/material/styles';
import useMqttPubClient from '../../../../hooks/useMqttPubClient';
import { errorClass } from '../../../../utils/Error';
import useMqttClient from '../../../../hooks/useMqttClient';
import validArduinoCommands from '../../../../constants/validArduinoCommands';
import styles from './styles.module.scss';
import { controlItem } from '../../../../types/ControlItem';

const CommandLine = (): JSX.Element => {
  const [controlMessage, setControlMessage] = useState<controlItem[]>([]);
  const [consoleInput, setConsoleInput] = useState<string>(''); // The words in the input field

  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [currentError, setCurrentError] = useState<errorClass>({
    isError: false,
    errorType: 'Previous command: N/A',
  }); // Shows the error from terminal input
  const scrollRef = useRef<null | HTMLLIElement>(null); // Auto scroll reference

  const [publishingData, setPublishingData] = useState<boolean>(false);
  const [buttonLabel, setbuttonLabel] = useState<string>('Stopped');

  // This receives from the Arduino
  const { connectStatus, payload } = useMqttClient({
    host: '14.198.73.218', // Home IP
    protocol: 'tcp', // Protocall
    port: 9001,
    topic: 'tcp/control_return', // topic to sub to
    duplicates: true,
  });
  // This sends to Arduino
  const { handlePublishMessage } = useMqttPubClient({
    host: '14.198.73.218', // Home IP
    protocol: 'tcp', // Protocall
    port: 9001,
    topic: 'tcp/control', // topic to sub to
  });

  // Items in the command list
  const Item = ({ value, alignment, color }: controlItem): JSX.Element => {
    return (
      <Typography align={alignment} color={color}>
        {value}
      </Typography>
    );
  };

  // Sending commands input field
  const sendCommand = (keyPressed: string | null) => {
    if (keyPressed === 'Enter' || keyPressed === 'ButtonPressed') {
      if (validArduinoCommands.findIndex((elements) => elements.command === consoleInput) >= 0) {
        setControlMessage([
          ...controlMessage,
          { value: consoleInput, alignment: 'right', color: 'green' },
        ]);
      } else {
        setControlMessage([
          ...controlMessage,
          { value: consoleInput, alignment: 'right', color: 'red' },
        ]);
      }

      if (!consoleInput.replace(/\s/g, '').length) {
        // Empty string?
        setCurrentError({ isError: true, errorType: 'Input are only white spaces' });
      } else {
        setCurrentError({ isError: false, errorType: `Previous command: "${consoleInput}"` });
        if (connectStatus === 'Connected') {
          handlePublishMessage(consoleInput);
          setConsoleInput(''); // Reset the text field to blank
        }
      }
    }
  };

  const handleAutoScroll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoScroll(event.target.checked);
  };

  // Green switch for publishing data
  const GreenSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: green[600],
      '&:hover': {
        backgroundColor: alpha(green[600], theme.palette.action.hoverOpacity),
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: green[600],
    },
  }));

  // Publishing data button
  const handlePublishing = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPublishingData(event.target.checked);

    if (event.target.checked === true) {
      setbuttonLabel('Start');
      handlePublishMessage('send_data');
      setControlMessage([...controlMessage, { value: 'send_data', alignment: 'right' }]);
    } else {
      setbuttonLabel('Stop');
      handlePublishMessage('stop_data');
      setControlMessage([...controlMessage, { value: 'stop_data', alignment: 'right' }]);
    }
  };

  // Console terminal
  useEffect(() => {
    if (payload) {
      setControlMessage([...controlMessage, { value: payload, alignment: 'left' }]);
      if (controlMessage.length > 500) {
        setControlMessage([...controlMessage.slice(1), { value: payload, alignment: 'left' }]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload]); // Event is when payload changes

  // Auto scroll in terminal
  useEffect(() => {
    if (autoScroll === true) {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [controlMessage, autoScroll]);

  return (
    <>
      <Typography variant="h3" display="inline">
        Terminal connection status:
      </Typography>
      <Typography variant="h3" display="inline">
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

      <Paper variant="outlined" className={styles.consoleTerminal}>
        <List dense>
          <Typography component="span">
            {controlMessage.map((item: controlItem, index: number) => (
              <Item
                value={item.value}
                alignment={item.alignment}
                // eslint-disable-next-line react/no-array-index-key
                key={item.value + index}
                color={item.color}
              />
            ))}
            <Typography component="span" ref={scrollRef} />
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
