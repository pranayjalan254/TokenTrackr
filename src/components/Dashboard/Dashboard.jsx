import { useAuth } from "../../../AuthContext";
import { web3auth } from "../SignUp/signup";

const Dashboard = () => {
  const { logout } = useAuth();
  const handleLogout = async () => {
    if (web3auth.connected) await web3auth.logout();
    logout();
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard</h1>
      <button onClick={handleLogout} className="logout-button">
        Log Out
      </button>
    </div>
  );
};

export default Dashboard;
