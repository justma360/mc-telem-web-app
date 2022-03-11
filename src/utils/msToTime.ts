export const msToTime = (timeInMillis: number): string => {
  const time = new Date(timeInMillis);
  // const milliseconds = Math.floor(timeInMillis % 1000);
  // const seconds = Math.floor((timeInMillis / 1000) % 60);
  // const minutes = Math.floor((timeInMillis / (1000 * 60)) % 60);
  // const hours = Math.floor((timeInMillis / (1000 * 60 * 60)) % 24);

  // const hoursString = hours < 10 ? `0${hours}` : hours;
  // const minutesString = minutes < 10 ? `0${minutes}` : minutes;
  // const secondsString = seconds < 10 ? `0${seconds}` : seconds;

  return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}.${time.getMilliseconds()}`;
};

export default msToTime;
