import Chart from "../charts/Chart";
import { parseDate } from "../utils/dateParser";

const StackedBarChart = ({ singleScheda }) => {
  if (singleScheda?.notaSpese.length === 0) {
    return <></>;
  }

  // Extract the color generation function from RandomColorCircle
  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string?.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Use hash to generate HSL values for matte color
    const hue = Math.abs(hash) % 360;
    const saturation = 45; // matte: low saturation
    const lightness = 45;  // matte: mid-low lightness
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Get all unique users with their emails
  const usersMap = new Map();
  singleScheda?.notaSpese
    .filter((e) => {
      const d = e?.inserimentoData ? new Date(e?.inserimentoData) : null;
      return d;
    })
    .forEach((e) => {
      if (!usersMap.has(e.inserimentoUser.name)) {
        usersMap.set(e.inserimentoUser.name, e.inserimentoUser.email);
      }
    });

  const users = Array.from(usersMap.keys());

  // Prepare data for each user
  const uniqueDates = [...new Set(
    singleScheda?.notaSpese.map(e => parseDate(e?.inserimentoData))
  )].sort((a, b) => new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-')));

  const weekData = users.map((user) => {
    const data = uniqueDates.map(() => 0);
    
    singleScheda?.notaSpese.forEach((e) => {
      if (e.inserimentoUser.name === user) {
        const dateStr = parseDate(e?.inserimentoData);
        const dateIdx = uniqueDates.indexOf(dateStr);
        if (dateIdx !== -1) {
          data[dateIdx] += e.importo;
        }
      }
    });
    
    const userEmail = usersMap.get(user);
    
    return {
      label: user,
      data,
      backgroundColor: stringToColor(userEmail), // Use email for consistent color
      barThickness: "flex",
    };
  });

  const weekLabels = uniqueDates;

  const barChartData = {
    labels: weekLabels,
    datasets: weekData,
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: "#737373",
        },
      },
      y: {
        stacked: true,
        grid: {
          color: "#e5e5e5",
        },
        ticks: {
          beginAtZero: true,
          color: "#737373",
        },
      },
    },
  };



  return (
    <div className="row mb-5">
      <div className="col-12">
        <div className="card h-100 pb-2 mb-2">
          <div className="card-header py-2 px-3">
            <small>
              {parseDate(singleScheda.notaSpese[0]?.inserimentoData)} - {parseDate(singleScheda.notaSpese[singleScheda.notaSpese.length - 1]?.inserimentoData)}
            </small>
            <h6 className="mb-0">Chart <i><b>{singleScheda.titolo}</b></i></h6>
          </div>
          <div className="chart ps-0 p-3">
            <Chart type="bar" data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StackedBarChart;