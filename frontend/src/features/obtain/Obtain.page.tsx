import { Outlet } from 'react-router-dom';
import { Container } from './Obtain.styles';

export function ObtainPage() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}
