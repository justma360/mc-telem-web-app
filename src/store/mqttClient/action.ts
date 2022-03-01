import { Dispatch } from 'redux';
import {
  UPDATE_MQTT_HOST,
  UPDATE_MQTT_PROTOCOL,
  UPDATE_MQTT_PORT,
  UPDATE_MQTT_TOPIC,
  UPDATE_MQTT_DUPLICATES,
  CLEAR_MQTT_OPTIONS,
} from './actionTypes';
import { MQTTOptionsState } from './reducer';

const getActionType = (key: keyof MQTTOptionsState): string => {
  switch (key) {
    case 'host':
      return UPDATE_MQTT_HOST;
    case 'protocol':
      return UPDATE_MQTT_PROTOCOL;
    case 'port':
      return UPDATE_MQTT_PORT;
    case 'topic':
      return UPDATE_MQTT_TOPIC;
    case 'duplicates':
      return UPDATE_MQTT_DUPLICATES;
    default:
      return '';
  }
};

export type UpdateMQTTOptionsDispatchType = Dispatch<{
  type: string;
  payload: MQTTOptionsState;
}>;

export const updateMQTTOptions =
  (key: keyof MQTTOptionsState, value: MQTTOptionsState) =>
  (dispatch: Dispatch): ReturnType<UpdateMQTTOptionsDispatchType> =>
    dispatch({
      type: getActionType(key),
      // payload: { [key]: value },
      payload: value,
    });

export const clearMQTTOptions =
  () =>
  (dispatch: Dispatch): Omit<UpdateMQTTOptionsDispatchType, 'payload'> =>
    dispatch({
      type: CLEAR_MQTT_OPTIONS,
    });
