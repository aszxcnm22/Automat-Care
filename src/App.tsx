import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import Profile from './pages/Profile';
import AccessManagement from './pages/AccessManagement';
<<<<<<< HEAD
import { AuthProvider, useAuth } from './context/AuthContext';
=======
import { AuthProvider } from './context/AuthContext';
>>>>>>> f68965de79608bcf583ed04950cb6c1203a75745
import { IssueProvider } from './context/IssueContext';

export default function App() {
  return (
    <AuthProvider>
      <IssueProvider>
        <BrowserRouter>
<<<<<<< HEAD
          <AppRoutes />
=======
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/access-management" element={<AccessManagement />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
>>>>>>> f68965de79608bcf583ed04950cb6c1203a75745
        </BrowserRouter>
      </IssueProvider>
    </AuthProvider>
  );
}
<<<<<<< HEAD

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/access-management" element={<AccessManagement />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
=======
>>>>>>> f68965de79608bcf583ed04950cb6c1203a75745
