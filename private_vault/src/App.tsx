
import './App.css'
import AuthPage from './AuthPage'
import Dashboard from './DashBoard';
import Home from './Home'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ProtectedRoute from './pages/ProtectedRoute';


function App() {

  return (
    <>
    <Router>
<Routes>
  <Route path="/" element={<Home/>} />
  <Route path="/login" element={<AuthPage />} />
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
</Routes>
</Router>
    </>
  )
}


export default App
  