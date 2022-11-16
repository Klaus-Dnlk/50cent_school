import { Outlet } from 'react-router-dom';
import { Container } from '../consumer/CreateScreen/Create.styles';

export function ConsumerPage() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}
