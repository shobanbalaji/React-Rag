import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Rag from "./pages/chat/index.tsx"
import Login from './pages/login/index.tsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <>
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path ="/" element={<Login/>}/>
        <Route path ="chat" element={<Rag/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
