import { Form, Input, message } from 'antd';
import { useFormik } from 'formik';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  RedButton,
  PageTitle,
  PageSubtitle,
  PageContainer,
} from '../Login.styles';
import { LoginConfirmForm } from './LoginConfirmScreen.types';
import { ConfirmValidationSchema } from './LoginConfirmScreen.validation';
import { Api } from '@/api';
import { routes } from '@/routing';
import { appStorage } from '@/services/appStorage';

export const LoginConfirmScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  const form = useFormik<LoginConfirmForm>({
    initialValues: {
      code: 0,
    },
    validationSchema: ConfirmValidationSchema,
    validateOnChange: false,
    async onSubmit(values) {
      const method =
        type === 'email'
          ? 'loginConfirmEmail'
          : type === 'phone'
          ? 'loginConfirmPhone'
          : 'loginConfirmOtp';
      Api[method]({ code: values.code })
        .then((response) => {
          appStorage.setApiKey(response.token);
          message
            .success('Code sent')
            .then((r) => navigate(routes.home.absolute()));
        })
        .catch(() => {
          message.error('Code is incorrect');
        });
    },
  });

  return (
    <PageContainer>
      <PageTitle>Введіть отриманий код підтвердження входу</PageTitle>
      <PageSubtitle>
        Не прийшов код?&nbsp;
        <Link to={routes.login.absolute()}>Повторити спробу</Link>
      </PageSubtitle>

      <form onSubmit={form.handleSubmit}>
        <Form.Item validateStatus={form.errors.code ? 'error' : 'success'}>
          <Input
            placeholder="Код"
            value={form.values.code > 0 ? form.values.code : ''}
            name="code"
            onChange={form.handleChange}
          />
        </Form.Item>
        <Form.Item>
          <RedButton type="submit">Продовжити</RedButton>
        </Form.Item>
      </form>
    </PageContainer>
  );
};
