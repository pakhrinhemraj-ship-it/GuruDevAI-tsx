import AppRoutes from "./routes/AppRoutes";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <>
  <BrowserRouter>
      <ToastContainer />
      <AppRoutes />
    </BrowserRouter>
    </>
  );
}