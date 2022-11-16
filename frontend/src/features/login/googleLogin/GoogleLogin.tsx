import { Api } from '@/api';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { appStorage } from '@/services/appStorage';
import { Config } from '@/config';

export const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const redirectPage = Config.REDIRECT_URI;

  const onSuccess = async (response: CredentialResponse) => {
    try {
      const resp = await Api.googleSignup({
        token: response.credential || '',
        clientId: Config.GOOGLE_CLIENT_ID,
      });

      appStorage.setApiKey(resp.token);
      navigate(redirectPage, { replace: true });
    } catch (error) {
      if (error) {
        return message.error('Something went wrong');
      }
    }

    message.success("You're successfully logged in!");
  };

  const onFailure = () => {
    message.error('Try again!');
  };

  return (
    <GoogleLogin
      type="icon"
      shape="circle"
      onSuccess={onSuccess}
      onError={() => onFailure}
    />
  );
};
