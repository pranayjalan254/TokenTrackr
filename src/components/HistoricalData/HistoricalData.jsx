import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DatePickerComponent from "./DatePicker";
import mockHistoricalData from "./mockData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HistoricalDataChart = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDateRangeChange = async (startDate, endDate) => {
    setLoading(true);
    try {
      const data = mockHistoricalData(startDate, endDate);
      setHistoricalData(data);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    } finally {
      setLoading(false);
    }
  };

  const data = {
    labels: historicalData.map((dataPoint) => dataPoint.date),
    datasets: [
      {
        label: "Token Balance",
        data: historicalData.map((dataPoint) => dataPoint.balance),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "category",
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <DatePickerComponent onDateRangeChange={handleDateRangeChange} />
      {loading ? <p>Loading...</p> : <Line data={data} options={options} />}
    </div>
  );
};

export default HistoricalDataChart;
