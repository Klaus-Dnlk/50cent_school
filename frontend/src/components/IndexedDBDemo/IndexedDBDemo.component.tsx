import React, { useState, useEffect } from 'react';
import { Button, Card, Space, Typography, Alert, Spin, List, Tag } from 'antd';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { indexedDBService } from '@/services/indexedDB';

const { Title, Text } = Typography;

interface IndexedDBDemoProps {
  className?: string;
}

export const IndexedDBDemo: React.FC<IndexedDBDemoProps> = ({ className }) => {
  const {
    isInitialized,
    isLoading,
    error,
    storeCredits,
    getCredits,
    storeInvestment,
    getUserInvestments,
    storeOfflineForm,
    getOfflineForms,
    clearExpiredCache,
    clearAll
  } = useIndexedDB();

  const [credits, setCredits] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [offlineForms, setOfflineForms] = useState<any[]>([]);
  const [demoLoading, setDemoLoading] = useState(false);

  // Load data on mount
  useEffect(() => {
    if (isInitialized) {
      loadData();
    }
  }, [isInitialized]);

  const loadData = async () => {
    setDemoLoading(true);
    try {
      const [creditsData, investmentsData, formsData] = await Promise.all([
        getCredits(),
        getUserInvestments(),
        getOfflineForms()
      ]);
      setCredits(creditsData);
      setInvestments(investmentsData);
      setOfflineForms(formsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setDemoLoading(false);
    }
  };

  const handleStoreCredits = async () => {
    setDemoLoading(true);
    try {
      const mockCredits = [
        {
          id: 1,
          creditSum: 10000,
          creditTitle: 'Personal Loan',
          creditDescription: 'Quick personal loan',
          creditTerm: 12,
          creditRate: 15.5
        },
        {
          id: 2,
          creditSum: 25000,
          creditTitle: 'Business Loan',
          creditDescription: 'Business expansion loan',
          creditTerm: 24,
          creditRate: 12.0
        }
      ];

      await storeCredits(mockCredits);
      await loadData();
    } catch (error) {
      console.error('Failed to store credits:', error);
    } finally {
      setDemoLoading(false);
    }
  };

  const handleStoreInvestment = async () => {
    setDemoLoading(true);
    try {
      const mockInvestment = {
        id: Date.now(),
        creditSum: 5000,
        creditTitle: 'Investment Portfolio',
        creditDesc: 'Diversified investment',
        creditTerm: 18,
        creditRate: 8.5,
        creditEstimate: 5500,
        creditAction: 'invest'
      };

      await storeInvestment(mockInvestment, 'demo-user');
      await loadData();
    } catch (error) {
      console.error('Failed to store investment:', error);
    } finally {
      setDemoLoading(false);
    }
  };

  const handleStoreOfflineForm = async () => {
    setDemoLoading(true);
    try {
      const mockForm = {
        type: 'credit_application',
        data: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          amount: 15000,
          term: 24
        },
        timestamp: new Date().toISOString()
      };

      await storeOfflineForm('credit_application', mockForm);
      await loadData();
    } catch (error) {
      console.error('Failed to store offline form:', error);
    } finally {
      setDemoLoading(false);
    }
  };

  const handleClearCache = async () => {
    setDemoLoading(true);
    try {
      await clearExpiredCache();
      await loadData();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    } finally {
      setDemoLoading(false);
    }
  };

  const handleClearAll = async () => {
    setDemoLoading(true);
    try {
      await clearAll();
      setCredits([]);
      setInvestments([]);
      setOfflineForms([]);
    } catch (error) {
      console.error('Failed to clear all data:', error);
    } finally {
      setDemoLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <Card className={className}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Spin size="large" />
          <Text>Initializing IndexedDB...</Text>
        </Space>
      </Card>
    );
  }

  return (
    <Card className={className} title="IndexedDB Demo">
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={4}>Actions</Title>
        
        <Space wrap>
          <Button 
            type="primary" 
            onClick={handleStoreCredits}
            loading={demoLoading}
          >
            Store Mock Credits
          </Button>
          
          <Button 
            onClick={handleStoreInvestment}
            loading={demoLoading}
          >
            Store Mock Investment
          </Button>
          
          <Button 
            onClick={handleStoreOfflineForm}
            loading={demoLoading}
          >
            Store Offline Form
          </Button>
          
          <Button 
            onClick={handleClearCache}
            loading={demoLoading}
          >
            Clear Expired Cache
          </Button>
          
          <Button 
            danger
            onClick={handleClearAll}
            loading={demoLoading}
          >
            Clear All Data
          </Button>
        </Space>

        <Title level={4}>Stored Data</Title>

        <Card size="small" title={`Credits (${credits.length})`}>
          <List
            dataSource={credits}
            renderItem={(credit) => (
              <List.Item>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>{credit.creditTitle}</Text>
                  <Text type="secondary">{credit.creditDescription}</Text>
                  <Space>
                    <Tag color="blue">${credit.creditSum}</Tag>
                    <Tag color="green">{credit.creditRate}%</Tag>
                    <Tag color="orange">{credit.creditTerm} months</Tag>
                  </Space>
                </Space>
              </List.Item>
            )}
          />
        </Card>

        <Card size="small" title={`Investments (${investments.length})`}>
          <List
            dataSource={investments}
            renderItem={(investment) => (
              <List.Item>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>{investment.creditTitle}</Text>
                  <Text type="secondary">{investment.creditDesc}</Text>
                  <Space>
                    <Tag color="blue">${investment.creditSum}</Tag>
                    <Tag color="green">{investment.creditRate}%</Tag>
                    <Tag color="orange">{investment.creditTerm} months</Tag>
                    <Tag color="purple">Est: ${investment.creditEstimate}</Tag>
                  </Space>
                </Space>
              </List.Item>
            )}
          />
        </Card>

        <Card size="small" title={`Offline Forms (${offlineForms.length})`}>
          <List
            dataSource={offlineForms}
            renderItem={(form) => (
              <List.Item>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>{form.type}</Text>
                  <Text type="secondary">
                    {new Date(form.timestamp).toLocaleString()}
                  </Text>
                  <Text code>{JSON.stringify(form.data, null, 2)}</Text>
                </Space>
              </List.Item>
            )}
          />
        </Card>
      </Space>
    </Card>
  );
}; 