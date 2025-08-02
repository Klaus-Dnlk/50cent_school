import { useNavigate } from 'react-router-dom';
import {
  PageContainer,
  PageSubtitle,
  PageTitle,
  ButtonStyled,
} from '../Obtain.styles';

export const ObtainScreen = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/payment');
  };

  return (
    <PageContainer>
      <PageTitle>We have received your data✅</PageTitle>
      <PageSubtitle>
        Once we verify everything - you will receive a notification via email and in
        your personal account. After that, you will be able to take out a loan.
      </PageSubtitle>
      <ButtonStyled type="primary" onClick={handleClick} danger>
        Continue
      </ButtonStyled>
    </PageContainer>
  );
};
