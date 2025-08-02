import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import { appStorage } from '@/services/appStorage';

import {
  RedButton,
  PageTitle,
  PageSubtitle,
  PageContainer,
  ExternalLoginTitle,
  ExternalLoginButtonsContainer,
} from '../Login.styles';
import { useFormik } from 'formik';
import { LoginForm } from './LoginScreen.types';
import { LoginFormValidationSchema } from './LoginScreen.validation';
import { Api } from '@/api';
import { routes } from '@/routing';
import { GoogleLoginButton } from '../googleLogin';
import { FacebookLoginButton } from '../FacebookLogin';
import { GithubLoginButton } from '../GithubLogin';
import { useAsyncRedirect } from '@/routing';

export const LoginScreen = () => {
  const { handleAsyncAction } = useAsyncRedirect({
    onSuccess: () => message.success('Welcome on board!'),
    onError: () => message.error("Houston, we've got a problem..."),
  });

  const form = useFormik<LoginForm>({
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },

    validationSchema: LoginFormValidationSchema,
    validateOnChange: false,

    async onSubmit(values) {
      await handleAsyncAction(
        async () => {
          const response = await Api.login({
            email: values.email,
            password: values.password,
          });

          appStorage.setApiKey(response.jwtToken);
          
          const params = response.typesMFA
            .map((val) => `typesMFA=${val}`)
            .join('&');
          
          return { response, params };
        },
        undefined, // No immediate redirect, handle it in success callback
        ({ params }) => {
          // Navigate to confirm type page after successful login
          window.location.href = `./confirmType?${params}`;
        }
      );
    },
  });

  return (
    <PageContainer>
      <PageTitle>Sign In</PageTitle>
      <PageSubtitle>
        Don't have an account?&nbsp;
        <Link to={routes.login.registration.absolute()}>Create one</Link>
      </PageSubtitle>

      <form onSubmit={form.handleSubmit}>
        <Form.Item
          validateStatus={form.errors.email ? 'error' : 'success'}
          help={form.errors.email}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="E-mail"
            name="email"
            value={form.values.email}
            onChange={form.handleChange}
          />
        </Form.Item>

        <Form.Item
          validateStatus={form.errors.password ? 'error' : 'success'}
          help={form.errors.password}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            name="password"
            placeholder="Password"
            value={form.values.password}
            onChange={form.handleChange}
          />
        </Form.Item>

        <Form.Item>
          <Form.Item noStyle>
            <label>
              <input
                type="checkbox"
                name="remember"
                onChange={(e) =>
                  form.setFieldValue('remember', e.target.checked)
                }
              />
              &nbsp;Stay signed in after session ends
            </label>
            <br />
            <br />
            Forgot password?
          </Form.Item>
        </Form.Item>

        <Form.Item>
          <RedButton type="submit">Continue</RedButton>
        </Form.Item>
      </form>
      <ExternalLoginTitle>Sign in with:</ExternalLoginTitle>
      <ExternalLoginButtonsContainer>
        <GoogleLoginButton />
        <FacebookLoginButton />
        <GithubLoginButton />
      </ExternalLoginButtonsContainer>
    </PageContainer>
  );
};
