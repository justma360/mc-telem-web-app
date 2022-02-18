import React, { useState } from 'react';
import { render } from 'react-dom';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const Charts = (): JSX.Element => {
  const [hoverData, setHoverData] = useState<string | null>(null);
  const [chartOptions, setChartOptions] = useState({
    xAxis: {
      categories: ['A', 'B', 'C'],
    },
    series: [{ data: [1, 2, 3] }],
    plotOptions: {
      series: {
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

  const updateSeries = () => {
    setChartOptions({
      xAxis: {
        categories: ['A', 'B', 'C'],
      },
      series: [{ data: [Math.random() * 5, 2, 1] }],
      plotOptions: {
        series: {
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
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      <h3>
        Hovering over
        {hoverData}
      </h3>
      <button type="button" onClick={updateSeries}>
        Update Series
      </button>
    </div>
  );
};

render(<Charts />, document.getElementById('root'));

export default Charts;
