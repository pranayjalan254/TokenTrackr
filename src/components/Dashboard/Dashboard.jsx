import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../../AuthContext";
import { web3auth } from "../SignUp/signup";
import "./Dashboard.css";

const Dashboard = () => {
  const { logout } = useAuth();

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
              <Link to="watchlist">Watch List</Link>
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
          <h2>Welcome, User!</h2>
          <p>Here's a summary of your token holdings and activities.</p>
        </section>
        <section className="dashboard-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
