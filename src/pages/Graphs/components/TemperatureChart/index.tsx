import React, { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { ArduinoData } from '../../../../types/ArduinoData';
import { TemperatureChartOption } from '../../../../types/HighChartOptions';

interface Props {
  updateInterval: number; // Update interval in seconds
  dataInput: ArduinoData[];
}

const TemperatureChart = ({ dataInput, updateInterval }: Props): JSX.Element => {
  const [graphTime, setGraphTime] = useState<string[]>([]);
  const [rearTyreTemp, setRearTyreTemp] = useState<number[]>([]);
  const [ambientTemp, setAmbientTemp] = useState<number[]>([]);
  const [hoverData, setHoverData] = useState<string | null>(null);
  const [chartOptions, setChartOptions] = useState<TemperatureChartOption>({
    title: { text: 'Temperature' },
    yAxis: {
      title: { text: 'Temperature (°C)' },
    },
    xAxis: {
      title: { text: 'Time' },
      categories: ['1', '2', '3'],
    },
    series: [
      { data: [1, 2, 3], name: 'Tyre Temperature' },
      { data: [3, 2, 1], name: 'Ambient Temperature' },
    ],
    plotOptions: {
      series: {
        marker: { enabled: false },
        point: {
          events: {
            mouseOver({ target }: { target: Highcharts.Point }) {
              setHoverData(target.category);
            },
          },
        },
      },
    },
  });

  const msToTime = (time: number): string => {
    // const milliseconds = Math.floor((time % 1000) / 100);
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24) + 8;

    const hours2 = hours < 10 ? `0${hours}` : hours;
    const minutes2 = minutes < 10 ? `0${minutes}` : minutes;
    const seconds2 = seconds < 10 ? `0${seconds}` : seconds;

    // return `${hours2}:${minutes2}:${seconds2}.${milliseconds}`;
    return `${hours2}:${minutes2}:${seconds2}`;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const modifiedData = dataInput.filter(
        (value, index, array) =>
          array.findIndex((element) => msToTime(element.time) === msToTime(value.time)) === index,
      );

      setGraphTime(modifiedData.map((x) => msToTime(x.time)));
      setRearTyreTemp(modifiedData.map((x) => x.tyreTemp));
      setAmbientTemp(modifiedData.map((x) => x.ambientTemp));

      setChartOptions({
        xAxis: {
          title: { text: 'Time' },
          categories: graphTime,
        },
        series: [
          { data: rearTyreTemp, name: 'Tyre Temperature' },
          { data: ambientTemp, name: 'Ambient Temperature' },
        ],
        plotOptions: {
          series: {
            marker: { enabled: false },
            point: {
              events: {
                mouseOver({ target }: { target: Highcharts.Point }) {
                  setHoverData(target.category);
                },
              },
            },
          },
        },
      });
    }, updateInterval * 1000);

    return () => clearInterval(intervalId); // This is important
  }, [ambientTemp, dataInput, graphTime, rearTyreTemp, updateInterval]);

  const updateSeries = () => {
    const modifiedData = dataInput.filter(
      (value, index, array) =>
        array.findIndex((element) => msToTime(element.time) === msToTime(value.time)) === index,
    );

    setGraphTime(modifiedData.map((x) => msToTime(x.time)));
    setRearTyreTemp(modifiedData.map((x) => x.tyreTemp));
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} updateArgs={[true]} />

      <h3>
        Hovering over:
        {hoverData}
      </h3>
      <button type="button" onClick={updateSeries}>
        Update Series
      </button>
    </div>
  );
};

export default TemperatureChart;
