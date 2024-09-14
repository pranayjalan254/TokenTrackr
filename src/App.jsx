import "./App.css";
import LandingPage from "./components/LandingPage/LandingPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/SignUp/signup";
import Dashboard from "./components/Dashboard/Dashboard";
import ProtectedRoute from "../ProtectedRoute";
import { AuthProvider } from "../AuthContext";
import WatchList from "./components/Watchlist/WatchList";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route path="watchlist" element={<WatchList />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
