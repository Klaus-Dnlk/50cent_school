import { Form, Layout, Input, Steps, Divider, message } from 'antd';
import { useFormik } from 'formik';
import { CreditForm } from './CreditScreen.types';
import { Api } from '@/api';
import { CreditFormValidationSchema } from './CreditScreen.validation';
import {
  CreditFormContainer,
  CreditFormStyled,
  RedButton,
  StepsContainer,
  InstructionContainer,
  Instruction,
  InstructionText,
} from './CreditScreen.styles';

const { TextArea } = Input;
const { Step } = Steps;

export const CreditScreen = () => {
  const creditForm = useFormik<CreditForm>({
    initialValues: {
      creditSum: 0,
      creditTitle: '',
      creditDesc: '',
      creditTerm: 0,
      creditRate: 0,
    },
    validationSchema: CreditFormValidationSchema,
    validateOnChange: false,
    async onSubmit(values) {
      try {
        const response = await Api.createCredit({
          creditSum: Number(values.creditSum),
          creditTitle: values.creditTitle,
          creditDesc: values.creditDesc,
          creditTerm: Number(values.creditTerm),
          creditRate: Number(values.creditRate),
        });
        if (response.Loan === 'created') {
          message.success('Credit has been created.');
        }
      } catch (error) {
        console.log('error', error);
        message.error('Error creating credit');
      }
    },
  });

  return (
    <Layout>
      <CreditFormContainer>
        <StepsContainer>
          <Steps size="small" current={1}>
            <Step title="Відіслати документи" />
            <Step title="Заповнити форму" />
            <Step title="Вашу заявку буде розміщено на 50 cent" />
          </Steps>
        </StepsContainer>
        <CreditFormStyled onSubmit={creditForm.handleSubmit}>
          <Form.Item
            validateStatus={creditForm.errors.creditSum ? 'error' : 'success'}
            help={creditForm.errors.creditSum}
            label="Необхідна сума грошей, ₴: "
            labelCol={{ span: 6 }}
          >
            <Input
              size="large"
              placeholder="12000"
              name="creditSum"
              value={creditForm.values.creditSum}
              onChange={creditForm.handleChange}
            />
          </Form.Item>
          <Form.Item
            validateStatus={creditForm.errors.creditTitle ? 'error' : 'success'}
            help={creditForm.errors.creditTitle}
            label="Заголовок позики: "
            labelCol={{ span: 6 }}
          >
            <Input
              size="large"
              placeholder="Купити морозильник в кав'ярню"
              name="creditTitle"
              value={creditForm.values.creditTitle}
              onChange={creditForm.handleChange}
            />
          </Form.Item>
          <Form.Item
            validateStatus={creditForm.errors.creditDesc ? 'error' : 'success'}
            help={creditForm.errors.creditDesc}
            label="Детальний опис позики: "
            labelCol={{ span: 6 }}
          >
            <TextArea
              size="large"
              placeholder="У моїй кав'ярні спека, потрібно охолодити..."
              name="creditDesc"
              value={creditForm.values.creditDesc}
              onChange={creditForm.handleChange}
            />
          </Form.Item>
          <Form.Item
            validateStatus={creditForm.errors.creditTerm ? 'error' : 'success'}
            help={creditForm.errors.creditTerm}
            label="Термін кредиту(місяців): "
            labelCol={{ span: 6 }}
          >
            <Input
              size="large"
              placeholder="12"
              name="creditTerm"
              value={creditForm.values.creditTerm}
              onChange={creditForm.handleChange}
            />
          </Form.Item>
          <Form.Item
            validateStatus={creditForm.errors.creditRate ? 'error' : 'success'}
            help={creditForm.errors.creditRate}
            label="Бажаний річний %: "
            labelCol={{ span: 6 }}
          >
            <Input
              size="large"
              placeholder="3%"
              name="creditRate"
              value={creditForm.values.creditRate}
              onChange={creditForm.handleChange}
            />
          </Form.Item>
          <Form.Item>
            <RedButton type="submit">Подати заяву</RedButton>
          </Form.Item>
        </CreditFormStyled>
        <Divider />
      </CreditFormContainer>
      <InstructionContainer>
        <Instruction>Інструкція</Instruction>
        <InstructionText>Заповнення форми кредиту</InstructionText>
        <InstructionText>
          Після заповнення цієї форми, Вашу заяву на кредит буде розміщено на
          вкладці "шукають інвестицій". Інакше кажучи, кожен охочий інвестор
          буде бачити Вашу заяву та зможе проінвестувати в неї, якщо йому
          підійдуть умови. До зазначеного вами відсотку буде додано 0.5% -
          комісія 50 cent.
        </InstructionText>
      </InstructionContainer>
    </Layout>
  );
};
