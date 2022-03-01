import { ArduinoCommands } from '../types/ArduinoCommands';

const validArduinoCommands: ArduinoCommands[] = [
  {
    task: 'Send data',
    command: 'start_data',
    notes: 'Start sending data to MQTT server',
  },
  {
    task: 'Stop data',
    command: 'stop_data',
    notes: 'Stop sending data to MQTT server',
  },
  {
    task: 'LED on',
    command: 'LED_on',
    notes: 'Turns onboard LED on',
  },
  {
    task: 'LED off',
    command: 'LED_off',
    notes: 'Turns onboard LED off',
  },
  {
    task: 'Change WIFI SSID',
    command: 'WIFI_SSID',
    notes: 'The next message will be the new onboard WIFI login',
  },
  {
    task: 'Change WIFI Password',
    command: 'WIFI_PASSWORD',
    notes: 'The next message will be the new onboard WIFI password',
  },
  {
    task: 'Storing the onboard WIFI credentials',
    command: 'store_WIFI_cred',
    notes: 'Stores the WIFI credentials to current EEPROM memory',
  },
  {
    task: 'Change backup WIFI credentials',
    command: 'current_to_backup_WIFI_cred',
    notes:
      'Changes the backup EEPROM WIFI credentials to the one that is in the current EEPROM memory slot',
  },
  {
    task: 'Restart',
    command: 'restart',
    notes: 'Prompts the user to restart the device followed by a ("yes"/"no") to restart',
  },
];

export default validArduinoCommands;
