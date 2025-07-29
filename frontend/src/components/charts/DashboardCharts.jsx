
import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const BarChart = () => {
  const data = {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: [{
      label: "Views",
      tension: 0.4,
      borderWidth: 0,
      borderRadius: 4,
      borderSkipped: false,
      backgroundColor: "#43A047",
      data: [50, 45, 22, 28, 50, 60, 76],
      barThickness: 'flex'
    }, ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      y: {
        grid: {
          drawBorder: false,
          display: true,
          drawOnChartArea: true,
          drawTicks: false,
          borderDash: [5, 5],
          color: '#e5e5e5'
        },
        ticks: {
          suggestedMin: 0,
          suggestedMax: 500,
          beginAtZero: true,
          padding: 10,
          font: {
            size: 14,
            lineHeight: 2
          },
          color: "#737373"
        },
      },
      x: {
        grid: {
          drawBorder: false,
          display: false,
          drawOnChartArea: false,
          drawTicks: false,
          borderDash: [5, 5]
        },
        ticks: {
          display: true,
          color: '#737373',
          padding: 10,
          font: {
            size: 14,
            lineHeight: 2
          },
        }
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export const LineChart1 = () => {
  const data = {
    labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    datasets: [{
      label: "Sales",
      tension: 0,
      borderWidth: 2,
      pointRadius: 3,
      pointBackgroundColor: "#43A047",
      pointBorderColor: "transparent",
      borderColor: "#43A047",
      backgroundColor: "transparent",
      fill: true,
      data: [120, 230, 130, 440, 250, 360, 270, 180, 90, 300, 310, 220],
      maxBarThickness: 6
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            const fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return fullMonths[context[0].dataIndex];
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      y: {
        grid: {
          drawBorder: false,
          display: true,
          drawOnChartArea: true,
          drawTicks: false,
          borderDash: [4, 4],
          color: '#e5e5e5'
        },
        ticks: {
          display: true,
          color: '#737373',
          padding: 10,
          font: {
            size: 12,
            lineHeight: 2
          },
        }
      },
      x: {
        grid: {
          drawBorder: false,
          display: false,
          drawOnChartArea: false,
          drawTicks: false,
          borderDash: [5, 5]
        },
        ticks: {
          display: true,
          color: '#737373',
          padding: 10,
          font: {
            size: 12,
            lineHeight: 2
          },
        }
      },
    },
  };

  return <Line data={data} options={options} />;
};

export const LineChart2 = () => {
  const data = {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
      label: "Tasks",
      tension: 0,
      borderWidth: 2,
      pointRadius: 3,
      pointBackgroundColor: "#43A047",
      pointBorderColor: "transparent",
      borderColor: "#43A047",
      backgroundColor: "transparent",
      fill: true,
      data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
      maxBarThickness: 6
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      y: {
        grid: {
          drawBorder: false,
          display: true,
          drawOnChartArea: true,
          drawTicks: false,
          borderDash: [4, 4],
          color: '#e5e5e5'
        },
        ticks: {
          display: true,
          padding: 10,
          color: '#737373',
          font: {
            size: 14,
            lineHeight: 2
          },
        }
      },
      x: {
        grid: {
          drawBorder: false,
          display: false,
          drawOnChartArea: false,
          drawTicks: false,
          borderDash: [4, 4]
        },
        ticks: {
          display: true,
          color: '#737373',
          padding: 10,
          font: {
            size: 14,
            lineHeight: 2
          },
        }
      },
    },
  };

  return <Line data={data} options={options} />;
};
