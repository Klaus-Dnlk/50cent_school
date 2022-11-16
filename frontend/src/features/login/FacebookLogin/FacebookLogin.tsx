import { Api } from '@/api';
import FacebookLogin, { ReactFacebookLoginInfo } from 'react-facebook-login';

import { message } from 'antd';
import { appStorage } from '@/services/appStorage';
import { useNavigate } from 'react-router-dom';
import { Config } from '@/config';

export const FacebookLoginButton = () => {
  const navigate = useNavigate();
  const redirectPage = Config.REDIRECT_URI;

  const callback = async (response: ReactFacebookLoginInfo) => {
    try {
      const resp = await Api.facebookSignup({
        token: response.accessToken,
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

  return (
    <FacebookLogin
      textButton=""
      appId={Config.FACEBOOK_CLIENT_ID}
      callback={callback}
      cssClass="externalLoginButton facebookButton"
    />
  );
};
