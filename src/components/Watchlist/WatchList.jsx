import { useState, useEffect } from "react";
import { ethers } from "../../../ethers-5.6.esm.min.js";
import "./WatchList.css";
import { MdRemoveCircle } from "react-icons/md";
import { web3auth } from "../SignUp/signup";
import { ERC20_ABI } from "../../../ERC20_ABI.js";

const popularTokens = [
  {
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    logo: "/usdc.png",
  },
  {
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    logo: "/tether.png",
  },
  {
    address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    logo: "/aave.webp",
  },
  {
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    logo: "/btc.png",
  },
  {
    address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    logo: "/chainlink.png",
  },
];

const WatchList = () => {
  const [tokens, setTokens] = useState(() => {
    const savedTokens = localStorage.getItem("tokens");
    return savedTokens ? JSON.parse(savedTokens) : [];
  });
  const [newToken, setNewToken] = useState("");
  const [tokenData, setTokenData] = useState({});
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const setupProvider = async () => {
      try {
        if (web3auth.connected) {
          const web3authProvider = await web3auth.connect();
          setProvider(new ethers.providers.Web3Provider(web3authProvider));
        } else if (window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          setProvider(new ethers.providers.Web3Provider(window.ethereum));
        } else {
          setError("No wallet provider found. Please connect a wallet.");
        }
      } catch (err) {
        setError("Error connecting to wallet. Please try again.");
        console.error("Provider setup error:", err);
      }
    };

    setupProvider();
  }, []);

  const validateToken = async (token) => {
    try {
      if (!provider) {
        throw new Error("Provider not initialized");
      }

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
      if (!provider) return; // Ensure provider is available

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
  }, [tokens, provider]); // Include provider in dependency array

  return (
    <div className="watchlist-container">
      <h2>Watch List</h2>
      {error && <p className="error">{error}</p>}
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
                <th>Remove</th>
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
