export default interface MQTTOptionsType {
  protocol?: 'tcp' | 'ws' | 'wss' | 'mqtts';
  host?: string; // IP Address or URL
  port?: number;
  topic?: string;
  duplicates?: boolean;
}
