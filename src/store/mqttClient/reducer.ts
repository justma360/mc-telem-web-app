import { AnyAction } from 'redux';
import { UPDATE_TERMINAL_LIST, CLEAR_TERMINAL_LIST } from './actionTypes';
import { ControlItem } from '../../types/ControlItem';

export type ControlTerminalState = {
  terminalList: ControlItem[];
};

const initialState: ControlTerminalState = {
  terminalList: [],
};

const reducer = (
  state: ControlTerminalState = initialState,
  action: AnyAction,
): ControlTerminalState => {
  switch (action.type) {
    case UPDATE_TERMINAL_LIST:
      return { ...state, ...action.payload };
    case CLEAR_TERMINAL_LIST:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
