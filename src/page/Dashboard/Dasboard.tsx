
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/AuthStore";

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {user}!</h1>
      <button onClick={handleLogout} className="mt-4 bg-red-500 text-white p-2 rounded">
        Logout
      </button>
    </div>
  );
}