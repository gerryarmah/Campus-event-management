// frontend/src/components/AdminRoute.js
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const token = localStorage.getItem('token');
  
  return token && isAdmin ? children : <Navigate to="/" />;
}

export default AdminRoute;