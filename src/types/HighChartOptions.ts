export interface SpeedometerGraphOptions {
  chart?: {
    type?: string;
    height?: string;
  };

  title?: {
    text?: string;
    style?: {
      fontSize?: string;
    };
  };

  tooltip?: {
    borderWidth?: number;
    backgroundColor?: string;
    shadow?: boolean;
    style?: {
      fontSize?: string;
    };
    valueSuffix?: string;
    visible?: boolean;
    followTouchMove?: boolean;
  };

  pane?: {
    startAngle?: number;
    endAngle?: number;
    background?: [];
  };

  yAxis?: {
    min?: number;
    max?: number;
    lineWidth?: number;
    tickPositions?: [];
  };

  plotOptions?: {
    solidgauge?: {
      dataLabels?: {
        enabled?: boolean;
        style?: {
          fontSize?: string;
        };
        borderWidth?: number;
        verticalAlign?: string;
        y?: number;
      };
      linecap?: string;
      stickyTracking?: boolean;
      rounded?: boolean;
    };
  };

  series?: [
    {
      name?: string;
      type?: string;
      data?: [
        {
          color?: string;
          radius?: string;
          innerRadius?: string;
          y?: number;
        },
      ];
    },
  ];
}

export interface TemperatureChartOption {
  title?: { text?: string };
  yAxis?: {
    title?: { text?: string };
  };
  xAxis?: {
    title?: { text?: string };
    categories?: string[];
  };
  series?: [{ data?: number[]; name?: string }, { data?: number[]; name?: string }];
  plotOptions?: {
    series?: {
      marker?: { enabled: boolean };
      point?: {
        events?: { mouseOver({ target }: { target: Highcharts.Point }): void };
      };
    };
  };
}
