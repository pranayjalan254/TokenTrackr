import { useState, useCallback, useEffect } from "react";
import { Alchemy, Network, Utils } from "alchemy-sdk";
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
import DatePickerComponent from "./DatePickerComponent/DatePicker";
import { ethers } from "../../../ethers-5.6.esm.min.js";
import { web3auth } from "../SignUp/signup";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const config = {
  apiKey: "Eni5THenJtUWs4oixXBwi2KRBDk8iMAH",
  network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(config);

const HistoricalDataChart = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const setupProvider = async () => {
      try {
        if (web3auth && web3auth.connected) {
          const web3authProvider = await web3auth.connect();
          const ethersProvider = new ethers.providers.Web3Provider(
            web3authProvider
          );
          setProvider(ethersProvider);
          const signer = ethersProvider.getSigner();
          const address = await signer.getAddress();
          setWalletAddress(address);
        } else if (window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const ethersProvider = new ethers.providers.Web3Provider(
            window.ethereum
          );
          setProvider(ethersProvider);
          const signer = ethersProvider.getSigner();
          const address = await signer.getAddress();
          setWalletAddress(address);
        } else {
          setError("No wallet provider found. Please connect a wallet.");
        }
      } catch (err) {
        setError("Error connecting to wallet. Please try again.");
        console.error("Provider setup error:", err);
      }
    };

    setupProvider();
  }, [web3auth]);

  const getBlockNumberForDate = async (date) => {
    const targetTimestamp = Math.floor(date.getTime() / 1000);
    let left = 0;
    let right = await alchemy.core.getBlockNumber();

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const block = await alchemy.core.getBlock(mid);

      if (block.timestamp === targetTimestamp) {
        return mid;
      } else if (block.timestamp < targetTimestamp) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return right;
  };

  const getBalanceForDate = async (date) => {
    if (!walletAddress) return 0;
    const startBlockNumber = await getBlockNumberForDate(
      new Date(date.setHours(0, 0, 0, 0))
    );
    const endBlockNumber = await getBlockNumberForDate(
      new Date(date.setHours(23, 59, 59, 999))
    );

    const randomBlockNumber =
      Math.floor(Math.random() * (endBlockNumber - startBlockNumber + 1)) +
      startBlockNumber;
    const balance = await alchemy.core.getBalance(
      walletAddress,
      randomBlockNumber
    );

    return Utils.formatEther(balance);
  };

  const fetchHistoricalData = useCallback(
    async (startDate, endDate) => {
      const data = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const balance = await getBalanceForDate(currentDate);
        data.push({
          date: new Date(currentDate).toISOString().split("T")[0],
          balance: parseFloat(balance),
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return data;
    },
    [walletAddress]
  );

  const handleDateRangeChange = async (startDate, endDate) => {
    if (!startDate || !endDate) {
      console.error("Invalid date range.");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchHistoricalData(startDate, endDate);
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
        label: "Sepolia ETH Balance",
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
      <h2>Sepolia ETH Balance History</h2>
      <DatePickerComponent onDateRangeChange={handleDateRangeChange} />
      {loading ? <p>Loading...</p> : <Line data={data} options={options} />}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default HistoricalDataChart;
