import { Outlet } from 'react-router-dom';

import { Container } from './Login.styles';

export function LoginPage() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}
