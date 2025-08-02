import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, message } from 'antd';
import { useFormik } from 'formik';
import { Link, useSearchParams } from 'react-router-dom';

import {
  RedButton,
  PageTitle,
  PageSubtitle,
  PageContainer,
  ExternalLoginTitle,
  ExternalLoginButtonsContainer,
} from '../Login.styles';
import { GoogleLoginButton } from '../googleLogin';
import { RegistrationFormValidationSchema } from './RegistrationScreen.validation';
import { RegistrationForm } from './RegistrationScreen.types';
import { Api } from '@/api';
import { routes } from '@/routing';
import { ConfirmScreen } from '../ConfirmScreen';
import { FacebookLoginButton } from '../FacebookLogin/FacebookLogin';
import { GithubLoginButton } from '../GithubLogin';

export const RegistrationScreen = () => {
  const [, setSearchParams] = useSearchParams();

  const form = useFormik<RegistrationForm>({
    initialValues: {
      email: '',
      password: '',
      phone: '',
      isRegistered: false,
    },
    validationSchema: RegistrationFormValidationSchema,
    validateOnChange: false,
    async onSubmit(values) {
      setSearchParams({ email: values.email });

      try {
        await Api.signup({
          email: values.email,
          password: values.password,
          phone: values.phone,
        });
      } catch (error) {
        if (error) {
          return message.error('Try another email');
        }
      }
      message.success('Congratulations! Your account is successfully created!');

      form.setFieldValue('isRegistered', true);
    },
  });

  return (
    <PageContainer>
      {form.values.isRegistered ? (
        <ConfirmScreen />
      ) : (
        <>
          <PageTitle>Create Account</PageTitle>
          <PageSubtitle>
            Already have an account?&nbsp;
            <Link to={routes.login.absolute()}>Sign In</Link>
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
                placeholder="Password"
                name="password"
                value={form.values.password}
                onChange={form.handleChange}
              />
            </Form.Item>

            <Form.Item
              validateStatus={form.errors.phone ? 'error' : 'success'}
              help={form.errors.phone}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="phone"
                placeholder="Phone"
                name="phone"
                value={form.values.phone}
                onChange={form.handleChange}
              />
            </Form.Item>

            <Form.Item required={true}>
              <label>
                <input type="checkbox" required />
                &nbsp; I agree to the Terms of Service and
                <br />
                Privacy Policy
              </label>
            </Form.Item>

            <Form.Item>
              <RedButton type="submit">Continue</RedButton>
            </Form.Item>
          </form>
          <ExternalLoginTitle>Sign up with:</ExternalLoginTitle>
          <ExternalLoginButtonsContainer>
            <GoogleLoginButton />
            <FacebookLoginButton />
            <GithubLoginButton />
          </ExternalLoginButtonsContainer>
        </>
      )}
    </PageContainer>
  );
};
