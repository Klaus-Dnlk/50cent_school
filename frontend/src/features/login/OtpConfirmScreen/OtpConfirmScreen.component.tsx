import { Form, Input, message } from 'antd';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { RedButton, PageTitle, PageContainer } from '../Login.styles';
import { ConfirmForm } from './OtpConfirmScreen.types';
import { OtpConfirmValidationSchema } from './OtpConfirmScreen.validation';
import { Api } from '@/api';
import { routes } from '@/routing';

export const OtpConfirmScreen = () => {
  const navigate = useNavigate();

  const form = useFormik<ConfirmForm>({
    initialValues: {
      code: 0,
    },
    validationSchema: OtpConfirmValidationSchema,
    validateOnChange: false,
    async onSubmit(values) {
      Api.confirmOtp({
        code: values.code.toString(),
      })
        .then((resp) => {
          message.success(`Otp confirmation status: ${resp.status}`);
          navigate(routes.home.absolute());
        })
        .catch((error) => {
          message.error(error.code);
        });
    },
  });

  return (
    <PageContainer>
      <PageTitle>Введіть код з застосунку Google Authenticator</PageTitle>
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
          <RedButton type="submit">Підтвердити</RedButton>
        </Form.Item>
      </form>
    </PageContainer>
  );
};
