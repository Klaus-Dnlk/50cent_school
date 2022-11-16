import { Api } from '@/api';

import { message } from 'antd';
import { appStorage } from '@/services/appStorage';
import { useNavigate } from 'react-router-dom';
import LoginGithub from 'react-login-github';
import { Config } from '@/config';

type Response = {
  code: string;
};

export const GithubLoginButton = () => {
  const navigate = useNavigate();
  const redirectPage = Config.REDIRECT_URI;

  const onSuccess = async (response: Response) => {
    try {
      const resp = await Api.githubSignup({
        code: response.code,
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

  const onFailure = (response: Response) => {
    console.log(response);

    message.error('Try again!');
  };

  return (
    <>
      <LoginGithub
        buttonText=""
        className="externalLoginButton githubButton"
        clientId={Config.GITHUB_CLIENT_ID}
        onSuccess={onSuccess}
        onFailure={onFailure}
      />
    </>
  );
};
