import { Outlet } from 'react-router-dom';
import { Container } from './Investor.styles';

export function InvestorPage() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}
