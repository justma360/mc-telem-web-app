import { AnyAction } from 'redux';
import {
  UPDATE_CONNECTION_STATUS,
  UPDATE_PREV_MESSAGE,
  UPDATE_CONNECTION_ERROR,
  CLEAR_CONNECTION_STATUS,
} from './actionTypes';

export type GlobalConnectionState = {
  status: 'Connected' | 'Disconnected' | 'Sending';
  prevMessageTime?: { time: number; message: string };
  error?: string;
};

const initialState: GlobalConnectionState = {
  status: 'Disconnected',
  prevMessageTime: { time: 0, message: 'N/A' },
  error: 'N/A',
};

const reducer = (
  state: GlobalConnectionState = initialState,
  action: AnyAction,
): GlobalConnectionState => {
  switch (action.type) {
    case UPDATE_CONNECTION_STATUS: // If there is more then add the "case UPDATE_MQTT_ETC:"
    case UPDATE_PREV_MESSAGE:
    case UPDATE_CONNECTION_ERROR:
      return { ...state, ...action.payload };
    case CLEAR_CONNECTION_STATUS:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
