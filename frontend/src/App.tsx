import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Rag from "./pages/chat/index.tsx";
import Login from './pages/login/index.tsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import type { JSX } from 'react';

// ✅ ProtectedRoute Component (inside same file or separate file)
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const session = sessionStorage.getItem("userCred");
  const local = localStorage.getItem("userCred");

  if (!session || !local) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Rag />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
