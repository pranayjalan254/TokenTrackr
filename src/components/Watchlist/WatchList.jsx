import { useState, useEffect } from "react";
import { ethers } from "../../../ethers-5.6.esm.min.js";
import "./WatchList.css";
import { MdRemoveCircle } from "react-icons/md";

const provider = new ethers.providers.Web3Provider(window.ethereum);

const ERC20_ABI = [
  "function name() view returns (string)",
  "function balanceOf(address) view returns (uint256)",
];

const popularTokens = [
  {
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
    logo: "/chainlink.svg",
  },
  {
    address: "0x5c69b8f723abf7c1d1d1e61d3b65a7e7b2f0d0c0",
    logo: "/chainlink.svg",
  },
  {
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    logo: "/chainlink.svg",
  },
  {
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    logo: "/chainlink.svg",
  },
  {
    address: "0x95aD61b0a150d79219dCF64E1E6C4C6B4d4F6A3e",
    logo: "/chainlink.svg",
  },
];

const WatchList = () => {
  const [tokens, setTokens] = useState(() => {
    const savedTokens = localStorage.getItem("tokens");
    return savedTokens ? JSON.parse(savedTokens) : [];
  });
  const [newToken, setNewToken] = useState("");
  const [tokenData, setTokenData] = useState({});

  const validateToken = async (token) => {
    try {
      const contract = new ethers.Contract(token, ERC20_ABI, provider);
      const name = await contract.name();
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      const balance = await contract.balanceOf(userAddress);

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
          const updatedTokens = [...tokens, newToken];
          setTokens(updatedTokens);
          localStorage.setItem("tokens", JSON.stringify(updatedTokens));
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
        const updatedTokens = [...tokens, address];
        setTokens(updatedTokens);
        localStorage.setItem("tokens", JSON.stringify(updatedTokens));
      } else {
        alert("Failed to add popular token. Please try again.");
      }
    }
  };

  const handleRemoveToken = (address) => {
    const updatedTokens = tokens.filter((token) => token !== address);
    setTokens(updatedTokens);
    localStorage.setItem("tokens", JSON.stringify(updatedTokens));
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => (
                <tr key={token}>
                  <td>{tokenData[token]?.name || "Loading..."}</td>
                  <td>{token}</td>
                  <td>{tokenData[token]?.balance || "Loading..."}</td>
                  <td>
                    <button onClick={() => handleRemoveToken(token)}>
                      <MdRemoveCircle className="remove-icon" />
                    </button>
                  </td>
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
