import { useCurrentUser } from '@/hooks';
import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';

const ProtectedRoute = () => {
  const user = useCurrentUser();
  if (user.isLoading) {
    return <Spin>loading</Spin>;
  }
  return user.currentUser !== undefined ? (
    <Outlet />
  ) : (
    <Navigate to={'/login'} />
  );
};

export default ProtectedRoute;
