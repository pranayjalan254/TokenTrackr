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
import { ethers } from "../../../ethers-5.6.esm.min.js";
import DatePickerComponent from "./DatePicker.jsx";
import { web3auth } from "../SignUp/signup";
import { ERC20_ABI } from "../../../ERC20_ABI.js";
import { popularTokens } from "../../PopularTokens.js";
import "./HistoricalData.css";
import { chainConfig } from "../SignUp/signup";

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
  apiKey: import.meta.env.VITE_API_KEY,
  network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(config);
const averageBlockTime = 13;

const HistoricalDataChart = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  let [provider, setProvider] = useState(null);
  let [walletAddress, setWalletAddress] = useState(null);
  const [selectedToken, setSelectedToken] = useState(popularTokens[0].address);
  const [customToken, setCustomToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const setupProvider = async () => {
      let address = localStorage.getItem("walletAddress");
      if (address) {
        provider = new ethers.providers.JsonRpcProvider(chainConfig.rpcTarget);
        setProvider(provider);
        setWalletAddress(address);
      }
      if (!address) {
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
      }
    };

    setupProvider();
  }, [web3auth]);

  const getStartingBlockForDay = async (date) => {
    const targetTimestamp = Math.floor(date.getTime() / 1000);
    const latestBlock = await alchemy.core.getBlockNumber();
    const latestBlockData = await alchemy.core.getBlock(latestBlock);
    const latestBlockTimestamp = latestBlockData.timestamp;

    const timeDifference = latestBlockTimestamp - targetTimestamp;
    const estimatedBlocksAgo = Math.floor(timeDifference / averageBlockTime);
    const estimatedBlock = latestBlock - estimatedBlocksAgo;
    return estimatedBlock;
  };

  const getBalanceForDate = async (date, tokenAddress) => {
    if (!walletAddress) return 0;
    console.log(tokenAddress);
    const startingBlockNumber = await getStartingBlockForDay(date);
    if (!tokenAddress) {
      const balance = await alchemy.core.getBalance(
        walletAddress,
        startingBlockNumber
      );
      return Utils.formatUnits(balance, decimals);
    } else {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      const balance = await contract.balanceOf(walletAddress, {
        blockTag: startingBlockNumber,
      });
      const decimals = await contract.decimals();
      console.log(Utils.formatUnits(balance, decimals));
      return Utils.formatUnits(balance, decimals);
    }
  };

  const fetchHistoricalData = useCallback(
    async (startDate, endDate) => {
      const data = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const balance = await getBalanceForDate(
          currentDate,
          customToken || selectedToken
        );
        data.push({
          date: new Date(currentDate).toISOString().split("T")[0],
          balance: parseFloat(balance),
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return data;
    },
    [walletAddress, selectedToken, customToken]
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

  const handleTokenClick = (address) => {
    setCustomToken("");
    setSelectedToken(address);
  };

  const handleCustomTokenChange = (e) => {
    setSelectedToken("");
    setCustomToken(e.target.value);
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
    <div className="chart-container">
      <h2>Token Balance History</h2>
      <div className="chart-header">
        <div className="date-picker-container">
          <DatePickerComponent onDateRangeChange={handleDateRangeChange} />
        </div>
        <div className="token-logo-container">
          <div className="token-selection">
            {popularTokens.map((token) => (
              <img
                key={token.address}
                src={token.logo}
                alt={token.symbol}
                className={`token-logo ${
                  selectedToken === token.address ? "selected" : ""
                }`}
                onClick={() => handleTokenClick(token.address)}
              />
            ))}
          </div>
          <input
            type="text"
            placeholder="Enter custom token address"
            value={customToken}
            onChange={handleCustomTokenChange}
            className="custom-token-input"
          />
        </div>
      </div>
      <div className="graph-section">
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <Line data={data} options={options} />
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default HistoricalDataChart;
