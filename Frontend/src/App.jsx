import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

import Desktop from "./Pages/Desktop";
import Home from "./Pages/Home";
import AboutUs from "./Pages/AboutUs";
import Findings from "./Pages/Findings";
import Models from "./Pages/Models";
import History from "./Pages/History";
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
            <Route path="home" element={<Home />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="findings" element={<Findings />} />
            <Route path="models" element={<Models />} />
            <Route
  path="profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>         
 <Route
  path="history"
  element={
    <ProtectedRoute>
      <History />
    </ProtectedRoute>
  }
/>
 </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;