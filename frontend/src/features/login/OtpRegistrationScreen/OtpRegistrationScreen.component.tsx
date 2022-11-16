import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { RedButton, PageTitle, PageContainer } from '../Login.styles';
import { Container, ButtonContainer } from './OtpRegistrationScreen.styles';
import { Api } from '@/api';
import { routes } from '@/routing';

export const OtpRegistrationScreen = () => {
  const [image, setImage] = useState('');

  useEffect(() => {
    Api.registerOtp()
      .then((response) => setImage(`data:image/png;base64, ${response.code}`))
      .catch((error) => console.log('error fetching code', error));
  }, []);

  return (
    <PageContainer>
      <Container>
        <PageTitle>
          Відскануйте QR-код за допомогою Google Authenticator
        </PageTitle>
        {image && <img src={image} alt={'QR-code'} />}
        <ButtonContainer>
          <Link to={routes.login.confirmOtp.absolute()}>
            <RedButton>Код відскановано</RedButton>
          </Link>
        </ButtonContainer>
      </Container>
    </PageContainer>
  );
};
