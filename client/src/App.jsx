import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Advisor from './pages/Advisor';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminServices from './pages/AdminServices';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      {/* Every page inside here gets the navbar and footer */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:id" element={<ServiceDetails />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="advisor" element={<Advisor />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="admin/services" element={<AdminServices />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
