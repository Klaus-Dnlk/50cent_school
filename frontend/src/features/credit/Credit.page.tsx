import { Outlet } from 'react-router-dom';

import { Container } from './Credit.styles';

export function CreditPage() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}
