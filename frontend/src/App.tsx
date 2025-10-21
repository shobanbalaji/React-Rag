import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Rag from "./pages/chat/index.tsx";
import Login from './pages/login/index.tsx';
import Signup from './pages/signup/Signup.tsx'; // 👈 add signup page
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import type { JSX } from 'react';

// 🔹 Helper function
const isAuthenticated = () => {
  const session = sessionStorage.getItem("userCred");
  const local = localStorage.getItem("userCred");
  return !!(session || local);
};

// 🔹 AuthGuard — Protect private routes like /chat
function AuthGuard({ children }: { children: JSX.Element }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// 🔹 PublicGuard — Prevent logged-in users from seeing login/signup
function PublicGuard({ children }: { children: JSX.Element }) {
  if (isAuthenticated()) {
    return <Navigate to="/chat" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicGuard><Login /></PublicGuard>} />
        <Route path="/signup" element={<PublicGuard><Signup /></PublicGuard>} />

        {/* Protected route */}
        <Route
          path="/chat"
          element={
            <AuthGuard>
              <Rag />
            </AuthGuard>
          }
        />

        {/* Catch-all: redirect any unknown route to / */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
