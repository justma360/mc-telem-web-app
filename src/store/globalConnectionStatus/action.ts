import { Dispatch } from 'redux';
import {
  UPDATE_CONNECTION_STATUS,
  UPDATE_CONNECTED_TOPIC,
  UPDATE_PREV_MESSAGE,
  UPDATE_CONNECTION_ERROR,
  CLEAR_CONNECTION_STATUS,
} from './actionTypes';
import { GlobalConnectionState } from './reducer';

const getActionType = (key: keyof GlobalConnectionState): string => {
  switch (key) {
    case 'status':
      return UPDATE_CONNECTION_STATUS;
    case 'connectedTopic':
      return UPDATE_CONNECTED_TOPIC;
    case 'prevMessageTime':
      return UPDATE_PREV_MESSAGE;
    case 'error':
      return UPDATE_CONNECTION_ERROR;
    default:
      return '';
  }
};

export type UpdateGlobalConnectionDispatchType = Dispatch<{
  type: string;
  payload: GlobalConnectionState;
}>;

export const updateGlobalConnection =
  (key: keyof GlobalConnectionState, value: GlobalConnectionState) =>
  (dispatch: Dispatch): ReturnType<UpdateGlobalConnectionDispatchType> =>
    dispatch({
      type: getActionType(key),
      // payload: { [key]: value },
      payload: value,
    });

export const clearMQTTOptions =
  () =>
  (dispatch: Dispatch): Omit<UpdateGlobalConnectionDispatchType, 'payload'> =>
    dispatch({
      type: CLEAR_CONNECTION_STATUS,
    });
