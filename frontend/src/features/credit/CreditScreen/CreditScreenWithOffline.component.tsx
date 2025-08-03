import React, { useState, useEffect } from 'react';
import { Form, Layout, Input, Steps, Divider, message, Alert, Button, Space } from 'antd';
import { useFormik } from 'formik';
import { CreditForm } from './CreditScreen.types';
import { Api } from '@/api';
import { CreditFormValidationSchema } from './CreditScreen.validation';
import { offlineSyncService } from '@/services/offlineSync';
import { useIndexedDB } from '@/hooks/useIndexedDB';
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

export const CreditScreenWithOffline = () => {
  const { isInitialized, storeOfflineForm, getOfflineForms } = useIndexedDB();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingForms, setPendingForms] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState<string>('');

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load pending forms
  useEffect(() => {
    if (isInitialized) {
      loadPendingForms();
    }
  }, [isInitialized]);

  const loadPendingForms = async () => {
    try {
      const forms = await getOfflineForms('credit_application');
      setPendingForms(forms);
    } catch (error) {
      console.error('Failed to load pending forms:', error);
    }
  };

  const handleSync = async () => {
    try {
      setSyncStatus('Syncing...');
      const result = await offlineSyncService.syncPendingForms();
      
      if (result.success) {
        message.success(`Synced ${result.synced} forms successfully`);
        if (result.failed > 0) {
          message.warning(`${result.failed} forms failed to sync`);
        }
      } else {
        message.error('Sync failed');
      }
      
      await loadPendingForms();
    } catch (error) {
      message.error('Sync failed');
    } finally {
      setSyncStatus('');
    }
  };

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
        const formData = {
          creditSum: Number(values.creditSum),
          creditTitle: values.creditTitle,
          creditDesc: values.creditDesc,
          creditTerm: Number(values.creditTerm),
          creditRate: Number(values.creditRate),
        };

        if (isOnline) {
          // Try online submission
          const response = await Api.createCredit(formData);
          if (response.Loan === 'created') {
            message.success('Credit has been created successfully.');
            creditForm.resetForm();
          }
        } else {
          // Store for offline submission
          await storeOfflineForm('credit_application', formData);
          message.info('Form saved for offline submission. It will be sent when you go online.');
          creditForm.resetForm();
          await loadPendingForms();
        }
      } catch (error) {
        console.log('error', error);
        
        if (isOnline) {
          // If online submission failed, try offline storage
          try {
            await storeOfflineForm('credit_application', {
              creditSum: Number(values.creditSum),
              creditTitle: values.creditTitle,
              creditDesc: values.creditDesc,
              creditTerm: Number(values.creditTerm),
              creditRate: Number(values.creditRate),
            });
            message.info('Online submission failed. Form saved for offline submission.');
            creditForm.resetForm();
            await loadPendingForms();
          } catch (offlineError) {
            message.error('Failed to save form offline');
          }
        } else {
          message.error('Error creating credit');
        }
      }
    },
  });

  return (
    <Layout>
      <CreditFormContainer>
        {/* Online/Offline Status */}
        <Alert
          message={isOnline ? 'Online Mode' : 'Offline Mode'}
          description={
            isOnline 
              ? 'Your form will be submitted immediately.' 
              : 'Your form will be saved and submitted when you go online.'
          }
          type={isOnline ? 'success' : 'warning'}
          showIcon
          style={{ marginBottom: 16 }}
        />

        {/* Pending Forms */}
        {pendingForms.length > 0 && (
          <Alert
            message={`${pendingForms.length} pending form(s)`}
            description={
              <Space direction="vertical">
                <span>You have {pendingForms.length} form(s) waiting to be submitted.</span>
                <Button 
                  type="primary" 
                  size="small" 
                  onClick={handleSync}
                  loading={syncStatus === 'Syncing...'}
                >
                  Sync Now
                </Button>
              </Space>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

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
            label="Термін позики (місяців): "
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
            label="Відсоткова ставка (%): "
            labelCol={{ span: 6 }}
          >
            <Input
              size="large"
              placeholder="15.5"
              name="creditRate"
              value={creditForm.values.creditRate}
              onChange={creditForm.handleChange}
            />
          </Form.Item>

          <Form.Item>
            <RedButton
              type="primary"
              htmlType="submit"
              size="large"
              loading={creditForm.isSubmitting}
            >
              {isOnline ? 'Створити кредит' : 'Зберегти для офлайн відправки'}
            </RedButton>
          </Form.Item>
        </CreditFormStyled>

        <Divider />

        <InstructionContainer>
          <Instruction>Інструкція:</Instruction>
          <InstructionText>
            Заповніть форму вище, щоб створити кредит. Якщо ви офлайн, форма буде збережена
            та відправлена автоматично, коли ви з'єднаєтесь з інтернетом.
          </InstructionText>
        </InstructionContainer>
      </CreditFormContainer>
    </Layout>
  );
}; 