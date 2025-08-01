import { useCurrentUser } from '@/hooks';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spin, Result } from 'antd';
import { routes } from './routes';

const ProtectedRoute = () => {
  const user = useCurrentUser();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (user.isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" tip="Перевірка авторизації..." />
      </div>
    );
  }

  // If user is authenticated, render the protected content
  if (user.currentUser !== undefined) {
    return <Outlet />;
  }

  // If user is not authenticated, redirect to login with return URL
  return (
    <Navigate 
      to={routes.login.absolute()} 
      state={{ from: location }}
      replace 
    />
  );
};

export default ProtectedRoute;
