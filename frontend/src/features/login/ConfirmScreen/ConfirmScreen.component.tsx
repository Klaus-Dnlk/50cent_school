import { Form, Input } from 'antd';
import { useFormik } from 'formik';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  RedButton,
  PageTitle,
  PageSubtitle,
  PageContainer,
} from '../Login.styles';
import { ConfirmForm } from './ConfirmScreen.types';
import { ConfirmValidationSchema } from './ConfirmScreen.validation';
import { Api } from '@/api';
import { routes } from '@/routing';

export const ConfirmScreen = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const form = useFormik<ConfirmForm>({
    initialValues: {
      code: 0,
    },
    validationSchema: ConfirmValidationSchema,
    validateOnChange: false,
    async onSubmit(values) {
      try {
        await Api.confirmRegistration({
          email: searchParams.get('email') || '',
          code: +values.code,
        });
        console.log('success');
        navigate('/login');
      } catch (error) {
        console.log('error', error);
      }
    },
  });

  return (
    <PageContainer>
      <PageTitle>Введіть код з пошти</PageTitle>
      <PageSubtitle>
        Не прийшов код?&nbsp;
        <Link to={routes.login.registration.absolute()}>Відправити ще раз</Link>
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
