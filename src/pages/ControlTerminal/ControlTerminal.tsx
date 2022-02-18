import React, { useState, useEffect } from 'react';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import useMqttClientPub from '../../hooks/useMqttClientPub';
import { MainLayout } from '../../layouts';
import DisplayError, { errorClass } from './Error';

const ControlTerminal = (): JSX.Element => {
  const [listInput, setListInput] = useState<string>(''); // The words in the input field
  const [currentError, setCurrentError] = useState<errorClass>({ isError: false });
  const [publishingData, setPublishingData] = useState<boolean>(false);
  const [buttonLabel, setbuttonLabel] = useState<string>('Nogga');
  const { connectStatus, handlePublishMessage } = useMqttClientPub({
    host: '14.198.73.121', // Home IP
    protocol: 'tcp', // Protocall
    port: 9001,
    topic: 'tcp/control', // topic to sub to
  });

  const handleEnterKey = (keyPressed: string) => {
    if (keyPressed === 'Enter') {
      if (!listInput.replace(/\s/g, '').length) {
        setCurrentError({ isError: true, errorType: 'Input are only white spaces' });
      } else {
        setCurrentError({ isError: false });
      }
      if (connectStatus === 'Connected') {
        handlePublishMessage(listInput);
      }
      setListInput(''); // Reset the text field to blank
    }
  };

  useEffect(() => {
    if (publishingData === true) {
      setbuttonLabel('Niggyea');
    } else {
      setbuttonLabel('Nogga');
    }
  }, [publishingData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPublishingData(event.target.checked);
  };

  return (
    <MainLayout>
      <h1>Sending commands to the Telemtary</h1>
      <h2>Commands</h2>
      <h3>Sending Data = send_data</h3>
      <h3>Stop Data= stop_data</h3>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch defaultChecked={false} checked={publishingData} onChange={handleChange} />
          }
          label={buttonLabel}
        />
      </FormGroup>
      <br />

      <input // input field
        value={listInput} // The field value is the input
        onChange={(event) => setListInput(event.target.value)} // when the field changes set the value to be input
        type="text" // Text field
        onKeyPress={(event) => handleEnterKey(event.key)}
      />

      <button
        style={{ margin: '0px' }}
        onClick={() => {
          // On a button click
          // addTask(); // Copy the current list of animals and add the new listInput value from the text field
          // errorMessage();
        }}
        type="button"
      >
        Send
      </button>
      <div className="errroAppeared">
        <DisplayError isError={currentError.isError} errorType={currentError.errorType} />
      </div>
    </MainLayout>
  );
};

export default ControlTerminal;
