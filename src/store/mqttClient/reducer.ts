import { AnyAction } from 'redux';
import {
  UPDATE_MQTT_HOST,
  UPDATE_MQTT_PROTOCOL,
  UPDATE_MQTT_PORT,
  UPDATE_MQTT_TOPIC,
  UPDATE_MQTT_DUPLICATES,
  CLEAR_MQTT_OPTIONS,
} from './actionTypes';

export type MQTTOptionsState = {
  host?: string; // Home IP
  protocol?: 'tcp' | 'ws' | 'wss' | 'mqtts';
  port?: number;
  topic?: string; // topic to sub to
  duplicates?: boolean;
};

const initialState: MQTTOptionsState = {
  host: '14.198.75.165', // Home IP
  protocol: 'ws', // Protocall
  port: 9001,
  topic: 'tcp/arduino_data', // topic to sub to
  duplicates: false,
};

const reducer = (state: MQTTOptionsState = initialState, action: AnyAction): MQTTOptionsState => {
  switch (action.type) {
    case UPDATE_MQTT_HOST: // If there is more then add the "case UPDATE_MQTT_ETC:"
    case UPDATE_MQTT_PROTOCOL:
    case UPDATE_MQTT_PORT:
    case UPDATE_MQTT_TOPIC:
    case UPDATE_MQTT_DUPLICATES:
      return { ...state, ...action.payload };
    case CLEAR_MQTT_OPTIONS:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
