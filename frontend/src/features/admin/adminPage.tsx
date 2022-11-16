import { Outlet } from 'react-router-dom';
import { Container } from '@/features/admin/AdminScreen/AdminScreen.styles';

export function AdminPage() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}
