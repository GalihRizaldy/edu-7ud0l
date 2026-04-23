import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from './context/AppContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Simulation from './pages/Simulation';
import Education from './pages/Education';
import TopUp from './pages/TopUp';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';

function App() {
  const { isAuthenticated, role } = useContext(AppContext);

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated 
          ? (role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/simulasi" />) 
          : <Login />
      } />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        isAuthenticated && role === 'admin' 
          ? <AdminLayout /> 
          : <Navigate to="/login" />
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      {/* User Routes */}
      <Route path="/" element={
        isAuthenticated && role === 'user'
          ? <Layout /> 
          : <Navigate to="/login" />
      }>
        <Route index element={<Navigate to="/simulasi" />} />
        <Route path="simulasi" element={<Simulation />} />
        <Route path="topup" element={<TopUp />} />
        <Route path="edukasi" element={<Education />} />
      </Route>
    </Routes>
  );
}

export default App;
