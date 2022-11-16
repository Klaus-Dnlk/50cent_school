import { Route, Routes } from 'react-router-dom';
import { AdminScreen } from '@/features/admin/AdminScreen/AdminScreen';
import { AdminPage } from '@/features/admin/adminPage';

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminPage />} />
      <Route index element={<AdminScreen />} />
    </Routes>
  );
}
