import Chart from "../charts/Chart";
import { parseDate } from "../utils/dateParser";

const StackedBarChart = ({ singleScheda }) => {
  const getCurrentWeek = () => {
    let curr = new Date();
    let week = [];
    let labels = ["Mon", "Tue", "Wen", "Thu", "Fri", "Sat", "Sun"];

    for (let i = 1; i <= 7; i++) {
      let first = curr.getDate() - curr.getDay() + i;
      let day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
      week.push(parseDate(day));
    }
    return week;
  };

  const getWeekRange = () => {
    const curr = new Date();
    const first = curr.getDate() - curr.getDay() + 1; // Monday
    const last = first + 6; // Sunday
    const monday = new Date(curr.setDate(first));
    const sunday = new Date(curr.setDate(last));
    // Remove time part
    monday.setHours(0, 0, 0, 0);
    sunday.setHours(23, 59, 59, 999);
    return [monday, sunday];
  };

  // Helper to get day index (0=Mon, 6=Sun)
  const getDayIndex = (dateStr) => {
    const date = new Date(dateStr);
    // getDay: 0=Sun, 1=Mon, ..., 6=Sat
    // We want 0=Mon, ..., 6=Sun
    let idx = date.getDay();
    return idx === 0 ? 6 : idx - 1;
  };
  const [weekStart, weekEnd] = getWeekRange();

  // Get all unique users
  const users = [
    ...new Set(
      singleScheda?.notaSpese
        .filter((e) => {
          const d = new Date(e.inserimentoData);
          return d >= weekStart && d <= weekEnd;
        })
        .map((e) => e.inserimentoUser.name)
    ),
  ];

  // Prepare data for each user, only for current week
  const weekData = users.map((user) => {
    const data = Array(7).fill(0);
    singleScheda?.notaSpese.forEach((e) => {
      const d = new Date(e.inserimentoData);
      if (e.inserimentoUser.name === user && d >= weekStart && d <= weekEnd) {
        const dayIdx = getDayIndex(e.inserimentoData);
        data[dayIdx] += e.importo;
      }
    });
    return {
      label: user,
      data,
      backgroundColor: user === "puccio" ? "#43A047" : "#1E88E5",
      barThickness: "flex",
    };
  });

  // Labels for the week
  const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
              {getCurrentWeek()[0]} - {getCurrentWeek()[6]}
            </small>
            <h5 className="mb-0">This week</h5>
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
