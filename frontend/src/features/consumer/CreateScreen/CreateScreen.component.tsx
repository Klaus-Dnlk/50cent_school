import { CreateForm } from './CreateScreen.types';
import { Api } from '@/api';
import { Button, Form, Input, message, Upload } from 'antd';

import {
  PageContainer,
  PageSubtitle,
  PageTitle,
  RedButton,
} from './Create.styles';
import { CreateFormValidationSchema } from '@/features/consumer/CreateScreen/CreateScreen.validation';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigationGuard } from '@/routing';
import { useFormReducer } from '@/hooks';
import { useOptimisticUpdate } from '@/hooks';

export const CreateScreen = () => {
  // Add navigation guard to prevent leaving with unsaved changes
  const { safeNavigate } = useNavigationGuard({
    enabled: true,
    message: 'У вас є незбережені зміни. Ви впевнені, що хочете покинути сторінку?',
    onBeforeNavigate: () => {
      // Check if form has unsaved changes
      return !form.isDirty;
    }
  });

  // Use custom form reducer instead of formik
  const form = useFormReducer<CreateForm>({
    name: '',
    surname: '',
    middleName: '',
    photo: null,
    work_file: null,
    id_file: null,
    property_file: null,
  }, CreateFormValidationSchema);

  const { optimisticAdd } = useOptimisticUpdate();

  const handleSubmit = async () => {
    if (!form.validateForm()) {
      message.error('Будь ласка, виправте помилки в формі');
      return;
    }

    form.setSubmitting(true);

    try {
      await optimisticAdd(
        ['consumers'],
        {
          id: Date.now().toString(), // Temporary ID for optimistic update
          ...form.values,
          status: 'pending' as const,
          createdAt: new Date().toISOString(),
        },
        async () => {
          const result = await Api.create(form.values);
          return result;
        }
      );

      message.success('Споживача створено успішно!');
      form.resetForm();
      safeNavigate('/consumer');
    } catch (error) {
      message.error('Щось пішло не так при створенні споживача');
    } finally {
      form.setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageTitle>Створити споживача</PageTitle>
      <PageSubtitle>Заповніть форму для створення нового споживача</PageSubtitle>

      <Form layout="vertical">
        <Form.Item
          label="Ім'я"
          validateStatus={form.errors.name ? 'error' : 'success'}
          help={form.errors.name}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Введіть ім'я"
            value={form.values.name}
            onChange={(e) => form.setFieldValue('name', e.target.value)}
            onBlur={form.handleBlur('name')}
          />
        </Form.Item>

        <Form.Item
          label="Прізвище"
          validateStatus={form.errors.surname ? 'error' : 'success'}
          help={form.errors.surname}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Введіть прізвище"
            value={form.values.surname}
            onChange={(e) => form.setFieldValue('surname', e.target.value)}
            onBlur={form.handleBlur('surname')}
          />
        </Form.Item>

        <Form.Item
          label="По батькові"
          validateStatus={form.errors.middleName ? 'error' : 'success'}
          help={form.errors.middleName}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Введіть по батькові"
            value={form.values.middleName}
            onChange={(e) => form.setFieldValue('middleName', e.target.value)}
            onBlur={form.handleBlur('middleName')}
          />
        </Form.Item>

        <Form.Item label="Фото">
          <Upload
            beforeUpload={(file) => {
              form.setFieldValue('photo', file);
              return false; // Prevent upload
            }}
            onRemove={() => form.setFieldValue('photo', null)}
          >
            <Button icon={<UploadOutlined />}>Завантажити фото</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Робочий документ">
          <Upload
            beforeUpload={(file) => {
              form.setFieldValue('work_file', file);
              return false;
            }}
            onRemove={() => form.setFieldValue('work_file', null)}
          >
            <Button icon={<UploadOutlined />}>Завантажити робочий документ</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Документ, що посвідчує особу">
          <Upload
            beforeUpload={(file) => {
              form.setFieldValue('id_file', file);
              return false;
            }}
            onRemove={() => form.setFieldValue('id_file', null)}
          >
            <Button icon={<UploadOutlined />}>Завантажити документ</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Документ про власність">
          <Upload
            beforeUpload={(file) => {
              form.setFieldValue('property_file', file);
              return false;
            }}
            onRemove={() => form.setFieldValue('property_file', null)}
          >
            <Button icon={<UploadOutlined />}>Завантажити документ про власність</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <RedButton
            type="primary"
            onClick={handleSubmit}
            loading={form.isSubmitting}
            disabled={!form.isValid}
          >
            Створити споживача
          </RedButton>
        </Form.Item>
      </Form>
    </PageContainer>
  );
};
