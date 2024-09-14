import { useState, useEffect } from "react";
import { ethers } from "../../../ethers-5.6.esm.min.js";
import "./WatchList.css";

const provider = new ethers.providers.Web3Provider(window.ethereum);

const ERC20_ABI = ["function name() view returns (string)"];

const popularTokens = [
  {
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
    logo: "/chainlink.svg",
  },
  {
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
    logo: "/chainlink.svg",
  },
  {
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
    logo: "/chainlink.svg",
  },
  {
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
    logo: "/chainlink.svg",
  },
  {
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
    logo: "/chainlink.svg",
  },
];

const WatchList = () => {
  const [tokens, setTokens] = useState([]);
  const [newToken, setNewToken] = useState("");
  const [tokenData, setTokenData] = useState({});

  const validateToken = async (token) => {
    try {
      const contract = new ethers.Contract(token, ERC20_ABI, provider);
      const name = await contract.name();
      const balance = await provider.getBalance(token);
      return { name, balance: ethers.utils.formatEther(balance) };
    } catch (error) {
      console.error(`Error fetching data for ${token}:`, error);
      return null;
    }
  };

  const handleAddToken = async () => {
    if (newToken) {
      const result = await validateToken(newToken);
      if (result) {
        if (!tokens.includes(newToken)) {
          setTokens([...tokens, newToken]);
          setNewToken("");
        }
      } else {
        alert("Failed to add token. Please check the address and try again.");
      }
    }
  };

  const handleAddPopularToken = async (address) => {
    if (!tokens.includes(address)) {
      const result = await validateToken(address);
      if (result) {
        setTokens([...tokens, address]);
      } else {
        alert("Failed to add popular token. Please try again.");
      }
    }
  };

  useEffect(() => {
    const fetchTokenData = async () => {
      const newTokenData = {};
      for (const token of tokens) {
        const result = await validateToken(token);
        if (result) {
          newTokenData[token] = result;
        } else {
          newTokenData[token] = {
            name: "Error",
            balance: "Error",
          };
        }
      }
      setTokenData(newTokenData);
    };

    fetchTokenData();
  }, [tokens]);

  return (
    <div className="watchlist-container">
      <h2>Watch List</h2>
      <div className="add-token">
        <input
          type="text"
          value={newToken}
          onChange={(e) => setNewToken(e.target.value)}
          placeholder="Enter token address"
        />
        <button onClick={handleAddToken}>Add Token</button>
      </div>
      <div className="popular-tokens">
        <h3>Popular Tokens</h3>
        <div className="token-logos">
          {popularTokens.map((token) => (
            <img
              key={token.address}
              src={token.logo}
              alt="Token Logo"
              onClick={() => handleAddPopularToken(token.address)}
              className="token-logo"
            />
          ))}
        </div>
      </div>
      <div className="token-list">
        {tokens.length === 0 ? (
          <p>No tokens in the watch list.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Token Name</th>
                <th>Token Address</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => (
                <tr key={token}>
                  <td>{tokenData[token]?.name || "Loading..."}</td>
                  <td>{token}</td>
                  <td>{tokenData[token]?.balance || "Loading..."}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WatchList;
