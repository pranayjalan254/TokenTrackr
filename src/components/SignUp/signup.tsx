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
  }
}
const clientId = import.meta.env.VITE_CLIENT_ID ?? "";

// chain config for mainnet ethereum
export const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1",
  rpcTarget:
    "https://eth-mainnet.g.alchemy.com/v2/fNr3TwzXGZWEmV13p3mCxDAhHYj1fgKP",
  displayName: "Ethereum Mainnet",
  blockExplorer: "https://etherscan.io/",
  ticker: "ETH",
  tickerName: "Ether",
};

// export const chainConfig = {
//   chainNamespace: CHAIN_NAMESPACES.EIP155,
//   chainId: "0xaa36a7",
//   rpcTarget:
//     "https://eth-sepolia.g.alchemy.com/v2/fNr3TwzXGZWEmV13p3mCxDAhHYj1fgKP",
//   displayName: "Ethereum Sepolia Testnet",
//   blockExplorer: "https://sepolia.etherscan.io/",
//   ticker: "ETH",
//   tickerName: "Sepolia Ether",
// };

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const metamaskAdapter = new MetamaskAdapter({
  clientId,
  sessionTime: 86400,
  web3AuthNetwork: "sapphire_devnet",
  chainConfig: chainConfig,
});

export const web3auth = new Web3Auth({
  clientId,
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
  }, [navigate]);

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

  const handleMetaMaskLogin = async () => {
    setLoading(true);
    if (window.ethereum !== undefined) {
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

  const handleAddressInput = async () => {
    if (!walletAddress.trim()) {
      alert("Please enter a wallet address.");
      return;
    }
    try {
      if (!walletAddress) return;
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
            {loading ? "Connecting..." : "Connect with Metamask"}
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
        </div>
      </div>
      <div className="login-note">
        <h3>Note: For full functionality login with web3auth or metamask</h3>
      </div>
    </div>
  );
}

export default Login;
