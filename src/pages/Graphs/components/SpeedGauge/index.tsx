import React, { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more.js';
import solidGauge from 'highcharts/modules/solid-gauge.js';
import { ArduinoData } from '../../../../types/ArduinoData';
import { SpeedometerGraphOptions } from '../../../../types/HighChartOptions';

highchartsMore(Highcharts);
solidGauge(Highcharts);

interface Props {
  updateInterval: number; // Update interval in seconds
  dataInput: ArduinoData[];
}

const SpeedGauge = ({ dataInput, updateInterval }: Props): JSX.Element => {
  const [hoverData] = useState<string | null>(null);
  const [chartOptions, setChartOptions] = useState<SpeedometerGraphOptions>({
    chart: {
      type: 'solidgauge',
      height: '50%',
    },

    title: {
      text: 'Speed (Kmph)',
      style: {
        fontSize: '24px',
      },
    },

    tooltip: {
      borderWidth: 0,
      backgroundColor: 'none',
      shadow: false,
      style: {
        fontSize: '24px',
      },
      valueSuffix: ' km/h',
      visible: true,
    },

    pane: {
      startAngle: -90,
      endAngle: 90,
      background: [],
    },

    yAxis: {
      min: 0,
      max: 250,
      lineWidth: 0,
      tickPositions: [],
    },

    plotOptions: {
      solidgauge: {
        dataLabels: {
          enabled: true,
          verticalAlign: 'middle',
          y: -50,
          style: { fontSize: '24px' },
        },
        linecap: 'round',
        stickyTracking: true,
        rounded: false,
      },
    },

    series: [
      {
        name: 'Speed',
        type: 'solidgauge',
        data: [
          {
            color: '#FF0000',
            radius: '112%',
            innerRadius: '88%',
            y: 360,
          },
        ],
      },
    ],
  });

  const updateSeries = () => {
    const speedKmph = dataInput[dataInput.length - 1].gpsSpeed;
    setChartOptions({
      series: [{ data: [{ y: speedKmph }] }],
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (dataInput.length > 1) {
        const speedKmph = dataInput[dataInput.length - 1].gpsSpeed;
        setChartOptions({
          series: [{ data: [{ y: speedKmph }] }],
        });
      }
    }, updateInterval * 1000);
    return () => clearInterval(intervalId); // This is important
  }, [dataInput, updateInterval]);

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

export default SpeedGauge;
