import { applyMiddleware, combineReducers, createStore, Middleware, StoreEnhancer } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import Config from '../Config';
import userDetails, { UserDetailsState } from './userDetails/reducer';
import controlTerminal, { ControlTerminalState } from './controlTerminal/reducer';
import MQTTOptions, { MQTTOptionsState } from './mqttClient/reducer';
import globalConnectionStatus, { GlobalConnectionState } from './globalConnectionStatus/reducer';

export const rootReducer = combineReducers({
  userDetails,
  controlTerminal,
  MQTTOptions,
  globalConnectionStatus,
});

export interface RootState {
  userDetails: UserDetailsState;
  controlTerminal: ControlTerminalState;
  MQTTOptions: MQTTOptionsState;
  globalConnectionStatus: GlobalConnectionState;
}

const bindMiddleware = (middleware: Middleware[]): StoreEnhancer => {
  if (Config.nodeEnv === 'development') {
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

export const store = createStore(rootReducer, bindMiddleware([thunkMiddleware]));

export default rootReducer;
