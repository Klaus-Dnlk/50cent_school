import styled from 'styled-components';

export const Container = styled.div`
  background: var(--main-color);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const RedButton = styled.button`
  background-color: var(--red-button);
  width: 100%;
  height: 32px;
  color: white;
  border: 1px solid #ff4d4f;
  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.043);
  border-radius: 10px;
  transition-duration: 0.2s;
  &:hover {
    box-shadow: 0px 0px 10px rgba(255, 77, 79, 1);
  }
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

export const PageContainer = styled.div``;

export const ExternalLoginButtonsContainer = styled.div`
  padding: 10px;
  display: flex;
  border-radius: 10px;
  justify-content: space-around;
`;

export const ExternalLoginTitle = styled.h2`
  text-align: center;
  color: #fff;
`;
