import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
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

export const LoginScreen = () => {
  const navigate = useNavigate();

  const form = useFormik<LoginForm>({
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },

    validationSchema: LoginFormValidationSchema,
    validateOnChange: false,

    async onSubmit(values) {
      try {
        const response = await Api.login({
          email: values.email,
          password: values.password,
        });

        appStorage.setApiKey(response.jwtToken);

        message.success('Welcome on board!');
        const params = response.typesMFA
          .map((val) => `typesMFA=${val}`)
          .join('&');
        navigate(`./confirmType?${params}`);
      } catch (error) {
        return message.error("Houston, we've got a problem...");
      }
    },
  });

  return (
    <PageContainer>
      <PageTitle>Увійти</PageTitle>
      <PageSubtitle>
        Немає аккаунту?&nbsp;
        <Link to={routes.login.registration.absolute()}>Створити</Link>
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
            placeholder="Пароль"
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
              &nbsp;Не виходити з системи після закриття сесії
            </label>
            <br />
            <br />
            Забув(-ла) пароль?
          </Form.Item>
        </Form.Item>

        <Form.Item>
          <RedButton type="submit">Продовжити</RedButton>
        </Form.Item>
      </form>
      <ExternalLoginTitle>Зареєструватися через:</ExternalLoginTitle>
      <ExternalLoginButtonsContainer>
        <GoogleLoginButton />
        <FacebookLoginButton />
        <GithubLoginButton />
      </ExternalLoginButtonsContainer>
    </PageContainer>
  );
};
