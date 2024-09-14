import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../../AuthContext";
import { web3auth } from "../SignUp/signup";
import { useState, useEffect } from "react";
import { ethers } from "../../../ethers-5.6.esm.min.js";
import "./Dashboard.css";

const provider = new ethers.providers.Web3Provider(window.ethereum);

const Dashboard = () => {
  const { logout } = useAuth();
  const [walletAddress, setWalletAddress] = useState("");
  const [ethBalance, setEthBalance] = useState("0");

  useEffect(() => {
    const fetchWalletInfo = async () => {
      try {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        setWalletAddress(address);
        setEthBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error("Error fetching wallet info:", error);
      }
    };

    fetchWalletInfo();
  }, []);

  const handleLogout = async () => {
    if (web3auth.connected) await web3auth.logout();
    logout();
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <nav>
          <ul>
            <li>
              <Link to="">Watch List</Link>
            </li>
            <li>
              <Link to="historical-data">Historical Data</Link>
            </li>
            <li>
              <Link to="allowance">Allowance</Link>
            </li>
            <li>
              <Link to="transfer">Transfer</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </nav>
      </header>
      <main className="dashboard-main">
        <section className="dashboard-summary">
          <h2>Welcome User!</h2>
          <p className="wallet-address">
            <strong>Wallet Address:</strong> {walletAddress}
          </p>
          <p className="wallet-address">
            <strong>ETH Balance:</strong> {ethBalance} ETH
          </p>
        </section>
        <section className="dashboard-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
