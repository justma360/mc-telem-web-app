export interface ArduinoConnectionState {
  status: 'Connected' | 'Disconnected' | 'Sending';
  error?: string;
}
