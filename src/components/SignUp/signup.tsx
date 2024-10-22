import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { Web3Auth } from "@web3auth/modal";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../AuthContext.jsx";
import "./signup.css";

declare global {
  interface Window {
    ethereum?: any;
    onTelegramAuth?: any;
  }
}

// Chain configuration for Ethereum Sepolia Testnet
export const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: `https://eth-sepolia.g.alchemy.com/v2/${
    import.meta.env.VITE_API_KEY
  }`,
  displayName: "Ethereum Sepolia Testnet",
  blockExplorer: "https://sepolia.etherscan.io/",
  ticker: "ETH",
  tickerName: "Sepolia Ether",
};

// Initialize providers
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});
const metamaskAdapter = new MetamaskAdapter({
  clientId: import.meta.env.VITE_CLIENT_ID ?? "",
  sessionTime: 86400,
  web3AuthNetwork: "sapphire_devnet",
  chainConfig,
});

export const web3auth = new Web3Auth({
  clientId: import.meta.env.VITE_CLIENT_ID ?? "",
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

function Login() {
  const { login } = useAuth();
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        web3auth.configureAdapter(metamaskAdapter);
        setProvider(web3auth.provider);
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };

    init();

    // Adding Telegram script for login button
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", "tokenmangrbot"); // Replace with your bot username
    script.setAttribute("data-size", "medium");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    document.getElementById("telegram-login")?.appendChild(script);

    // Define the callback function for Telegram login
    window.onTelegramAuth = (user: {
      first_name: string;
      last_name: string;
      id: string;
      username: string;
    }) => {
      alert(
        "Logged in as " +
          user.first_name +
          " " +
          user.last_name +
          " (" +
          user.id +
          (user.username ? ", @" + user.username : "") +
          ")"
      );
    };
  }, [navigate]);

  // Handle Web3Auth login
  const handleWeb3AuthLogin = async () => {
    setLoading(true);
    try {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      login();
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle MetaMask login
  const handleMetaMaskLogin = async () => {
    setLoading(true);
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        login();
        navigate("/dashboard");
      } catch (error) {
        console.error("MetaMask login failed:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("MetaMask not detected. Please install MetaMask.");
    }
  };

  // Handle login using a manually entered wallet address
  const handleAddressInput = async () => {
    if (!walletAddress.trim()) {
      alert("Please enter a wallet address.");
      return;
    }
    try {
      localStorage.setItem("walletAddress", walletAddress);
      login();
      navigate("/dashboard");
    } catch (error) {
      console.error("Invalid address or connection failed:", error);
    }
  };

  return (
    <div className="login-container">
      <header onClick={() => navigate("/")} className="login-header">
        <img src="/logo.png" alt="TokenTrackr Logo" className="logo" />
        <h2>TokenTrackr</h2>
      </header>
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <div className="login-buttons">
          <button onClick={handleWeb3AuthLogin} className="login-button">
            {loading ? "Connecting..." : "Login with Web3Auth"}
          </button>
          <button onClick={handleMetaMaskLogin} className="login-button">
            {loading ? "Connecting..." : "Connect with MetaMask"}
          </button>
          <div className="wallet-address-input">
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter wallet address"
            />
            <button onClick={handleAddressInput} className="input-button">
              Connect with Address
            </button>
          </div>
          {/* Telegram Login Button */}
          <div id="telegram-login" className="telegram-login"></div>
        </div>
      </div>
      <div className="login-note">
        <h3>Note: For full functionality, login with Web3Auth or MetaMask</h3>
      </div>
      <div className="note">
        <p>
          The dApp is currently running on the Sepolia Testnet, and popular
          tokens are configured for the testnet. To switch to the Ethereum
          mainnet, both the chain configuration and the token addresses for the
          popular tokens need to be updated.
        </p>
      </div>
    </div>
  );
}

export default Login;
