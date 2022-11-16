import styled from 'styled-components';
import { Button } from 'antd';

export const Container = styled.div`
  background: var(--main-color);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const PageTitle = styled.h1`
  font-size: var(--page-title-size);
  line-height: var(--page-title-line-height);
  font-weight: 500;
`;

export const PageSubtitle = styled.h2`
  font-size: var(--page-subtitle-size);
  line-height: var(--page-subtitle-line-height);
  font-weight: 400;
`;

export const ButtonStyled = styled(Button)`
  width: 100%;
`;

export const PageContainer = styled.div`
  width: 758px;
`;
