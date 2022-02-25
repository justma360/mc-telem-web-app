import { Dispatch } from 'redux';
import { UPDATE_TERMINAL_LIST, CLEAR_TERMINAL_LIST } from './actionTypes';
import { ControlItem } from '../../types/ControlItem';
import { ControlTerminalState } from './reducer';

const getActionType = (key: keyof ControlTerminalState): string => {
  switch (key) {
    case 'terminalList':
      return UPDATE_TERMINAL_LIST;
    default:
      return '';
  }
};

export type UpdateControlTerminalDispatchType = Dispatch<{
  type: string;
  payload: ControlTerminalState;
}>;

export const updateControlItemList =
  (key: keyof ControlTerminalState, value: ControlItem[]) =>
  (dispatch: Dispatch): ReturnType<UpdateControlTerminalDispatchType> =>
    dispatch({
      type: getActionType(key), // Updates action according to key
      payload: { [key]: value },
    });

export const clearControlItemList =
  () =>
  (dispatch: Dispatch): Omit<UpdateControlTerminalDispatchType, 'payload'> =>
    dispatch({
      type: CLEAR_TERMINAL_LIST,
    });
