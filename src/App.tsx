import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import Profile from './pages/Profile';
import AccessManagement from './pages/AccessManagement';
import { AuthProvider } from './context/AuthContext';
import { IssueProvider } from './context/IssueContext';

export default function App() {
  return (
    <AuthProvider>
      <IssueProvider>
        <BrowserRouter>
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
        </BrowserRouter>
      </IssueProvider>
    </AuthProvider>
  );
}
