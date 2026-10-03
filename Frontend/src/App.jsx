import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Desktop from "./Pages/Desktop";
import RetroLayout from "./Layout/RetroLayout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          hideProgressBar
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
          className="retro-toast-container"
          toastClassName="retro-toast"
          progressClassName="retro-toast-progress"
        />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<RetroLayout />}>
            <Route index element={<Desktop />} />
            <Route path="home" element={<Desktop />} />
            <Route path="about" element={<Desktop />} />
            <Route path="findings" element={<Desktop />} />
            <Route path="models" element={<Desktop />} />
            <Route path="profile" element={<Desktop />} />
            <Route path="history" element={<Desktop />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
