export interface controlItem {
  value: string;
  alignment: 'left' | 'right' | 'center'; // If its sent then its right side
  color?: 'red' | 'green' | 'black' | undefined;
}
