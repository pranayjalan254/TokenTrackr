import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { Web3Auth } from "@web3auth/modal";
import { ethers } from "../../../ethers-5.6.esm.min.js";
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
        web3auth.configureAdapter(metamaskAdapter);
        await web3auth.initModal();
        setProvider(web3auth.provider);
        if (web3auth.connected) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };

    init();
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);

      const ethersProvider = new ethers.providers.Web3Provider(
        web3authProvider
      );
      const signer = ethersProvider.getSigner();

      const address = await signer.getAddress();
      console.log("Wallet Address:", address);

      const balance = await ethersProvider.getBalance(address);
      console.log("Wallet Balance:", ethers.utils.formatEther(balance));
      login();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  const handleMetaMaskLogin = async () => {
    if (window.ethereum !== undefined) {
      if (typeof window.ethereum !== "undefined") {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          console.log("Wallet Address:", address);
          const balance = await provider.getBalance(address);
          console.log("Wallet Balance:", ethers.utils.formatEther(balance));
          login();
        } catch (error) {
          console.error("MetaMask login failed:", error);
        }
      } else {
        console.error("MetaMask not detected. Please install MetaMask.");
      }
    }
  };

  const handleAddressInput = async () => {
    if (!walletAddress.trim()) {
      alert("Please enter a wallet address.");
      return;
    }
    try {
      if (!walletAddress) return;

      const ethersProvider = new ethers.providers.JsonRpcProvider(
        chainConfig.rpcTarget
      );

      const balance = await ethersProvider.getBalance(walletAddress);
      console.log("Wallet Address:", walletAddress);

      console.log("Balance:", ethers.utils.formatEther(balance));
      login();
    } catch (error) {
      console.error("Invalid address or connection failed:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="overlay">
        <div className="login-card">
          <h2 className="login-title">SignUp / Login</h2>
          <div className="login-buttons">
            <button onClick={handleLogin} className="login-button">
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
      </div>
    </div>
  );
}

export default Login;
