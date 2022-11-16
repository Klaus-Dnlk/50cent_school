import styled from 'styled-components';
import { green, red } from '@ant-design/colors';

export const Container = styled.div``;

export const ApproveAction = styled.a`
  color: ${green[6]};
  &:hover {
    color: ${green[4]};
  }
`;

export const RejectAction = styled.a`
    color: ${red[6]};
    &:hover {
    color: ${red[4]};
`;
