import { useDispatch } from 'react-redux';
import { updateMQTTOptions } from '../store/mqttClient/action';

const fieldNames = ['host', 'protocol', 'port', 'topic', 'duplicates'] as const;
type FieldNames = typeof fieldNames[number];

interface ReturnType {
  handleMqttUpdate: (msg: string) => {
    commandRun: boolean;
    commandName?: string;
  };
}

const parsingMqttCommand = (): ReturnType => {
  const dispatch = useDispatch();
  const updateMQTT = (splitInputs: string[]) => {
    const mqttOption = splitInputs[0] as FieldNames;
    const newValue = splitInputs[1];
    dispatch(updateMQTTOptions(mqttOption, { [mqttOption]: newValue }));
  };

  const handleMqttUpdate = (commandMessage: string) => {
    if (commandMessage.includes('update_')) {
      const splitMessages = commandMessage.replace('update_', '').split(':');
      const mqttFieldExists = fieldNames.find((validName) => validName === splitMessages[0]);
      if (mqttFieldExists && splitMessages.length === 2) {
        updateMQTT(splitMessages);
        return { commandRun: true, commandName: `Updates MQTT ${splitMessages[0]}` };
      }
    }
    return { commandRun: false };
  };

  return {
    handleMqttUpdate,
  };
};

export default parsingMqttCommand;
