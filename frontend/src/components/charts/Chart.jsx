import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartComponent = ({ type, data, options }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = new Chart(chartRef.current, {
      type,
      data,
      options,
    });

    return () => {
      chart.destroy();
    };
  }, [type, data, options]);

  return <canvas ref={chartRef} />;
};

export default ChartComponent;
