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
      <PageTitle>Ми отримали ваші дані✅</PageTitle>
      <PageSubtitle>
        Як тільки ми все перевіримо - Вам прийде сповіщення на e-mail та у
        особистий кабінет. Після цього, Ви зомжете взяти позику.
      </PageSubtitle>
      <ButtonStyled type="primary" onClick={handleClick} danger>
        Продовжити
      </ButtonStyled>
    </PageContainer>
  );
};
