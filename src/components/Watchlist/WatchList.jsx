import { useState, useEffect } from "react";
import { ethers } from "../../../ethers-5.6.esm.min.js";
import "./WatchList.css";
import { MdRemoveCircle } from "react-icons/md";
import { web3auth } from "../SignUp/signup";
import { ERC20_ABI } from "../../../ERC20_ABI.js";
import { popularTokens } from "../../PopularTokens.js";
import { chainConfig } from "../SignUp/signup";

const WatchList = () => {
  const [tokens, setTokens] = useState(() => {
    // Initialize state with tokens from local storage, if available
    const savedTokens = localStorage.getItem("tokens");
    return savedTokens ? JSON.parse(savedTokens) : [];
  });
  const [newToken, setNewToken] = useState("");
  const [tokenData, setTokenData] = useState({});
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Function to set up the provider
    const setupProvider = async () => {
      let address = localStorage.getItem("walletAddress");
      if (address) {
        const providerInstance = new ethers.providers.JsonRpcProvider(
          chainConfig.rpcTarget
        );
        setProvider(providerInstance);
      } else {
        // Set up provider based on Web3Auth or MetaMask
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
      }
    };
    setupProvider();
  }, []);

  // Function to validate a token address
  const validateToken = async (token) => {
    try {
      if (!provider) {
        throw new Error("Provider not initialized");
      }
      const contract = new ethers.Contract(token, ERC20_ABI, provider);
      const name = await contract.name();
      const decimals = await contract.decimals();
      let address = localStorage.getItem("walletAddress");
      let userAddress;
      if (address) {
        userAddress = address;
      } else {
        const signer = provider.getSigner();
        userAddress = await signer.getAddress();
      }
      const balance = await contract.balanceOf(userAddress);
      return { name, balance: ethers.utils.formatUnits(balance, decimals) };
    } catch (error) {
      console.error(`Error fetching data for ${token}:`, error);
      return null;
    }
  };

  // Function to handle adding a new token by address
  const handleAddToken = async () => {
    if (newToken) {
      setLoading(true);
      const result = await validateToken(newToken);
      if (result) {
        if (!tokens.includes(newToken)) {
          const updatedTokens = [...tokens, newToken];
          setTokens(updatedTokens);
          localStorage.setItem("tokens", JSON.stringify(updatedTokens));
          setNewToken("");
        }
      } else {
        alert(
          "Failed to add token. Please check the address or network and try again."
        );
      }
      setLoading(false);
    }
  };

  // Function to handle adding a popular token
  const handleAddPopularToken = async (address) => {
    if (!tokens.includes(address)) {
      setLoading(true);
      const result = await validateToken(address);
      if (result) {
        const updatedTokens = [...tokens, address];
        setTokens(updatedTokens);
        localStorage.setItem("tokens", JSON.stringify(updatedTokens));
      } else {
        alert("Failed to add popular token. Please try again changing network");
      }
      setLoading(false);
    }
  };

  // Function to handle removing a token
  const handleRemoveToken = (address) => {
    const updatedTokens = tokens.filter((token) => token !== address);
    setTokens(updatedTokens);
    localStorage.setItem("tokens", JSON.stringify(updatedTokens));
  };

  useEffect(() => {
    // Function to fetch data for all tokens in the watch list
    const fetchTokenData = async () => {
      if (!provider) return;
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
  }, [tokens, provider]);

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
        <button onClick={handleAddToken} disabled={loading}>
          {loading ? "Adding..." : "Add Token"}
        </button>
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
