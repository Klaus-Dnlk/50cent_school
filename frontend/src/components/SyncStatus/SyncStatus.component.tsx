import React, { useState, useEffect } from 'react';
import { Badge, Button, Space, Typography, Alert } from 'antd';
import { SyncOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { offlineSyncService } from '@/services/offlineSync';

const { Text } = Typography;

interface SyncStatusProps {
  className?: string;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({ className }) => {
  const [status, setStatus] = useState<{
    pending: number;
    lastSync: Date | null;
    isOnline: boolean;
  }>({
    pending: 0,
    lastSync: null,
    isOnline: navigator.onLine
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updateStatus = async () => {
      try {
        const syncStatus = await offlineSyncService.getSyncStatus();
        setStatus(syncStatus);
      } catch (error) {
        console.error('Failed to get sync status:', error);
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const result = await offlineSyncService.syncPendingForms();
      if (result.success) {
        // Update status after sync
        const newStatus = await offlineSyncService.getSyncStatus();
        setStatus(newStatus);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status.pending === 0 && status.isOnline) {
    return null; // Don't show anything when everything is synced and online
  }

  return (
    <Alert
      className={className}
      message={
        <Space>
          <Badge count={status.pending} showZero={false}>
            <SyncOutlined spin={isLoading} />
          </Badge>
          <Text>
            {status.pending > 0 
              ? `${status.pending} form(s) pending sync`
              : 'All forms synced'
            }
          </Text>
          {status.isOnline ? (
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
          ) : (
            <ExclamationCircleOutlined style={{ color: '#faad14' }} />
          )}
        </Space>
      }
      description={
        <Space direction="vertical" size="small">
          <Text type="secondary">
            {status.isOnline 
              ? 'You are online. Forms will be synced automatically.'
              : 'You are offline. Forms will be synced when you go online.'
            }
          </Text>
          {status.pending > 0 && status.isOnline && (
            <Button 
              type="primary" 
              size="small" 
              onClick={handleSync}
              loading={isLoading}
              icon={<SyncOutlined />}
            >
              Sync Now
            </Button>
          )}
        </Space>
      }
      type={status.isOnline ? 'info' : 'warning'}
      showIcon={false}
      style={{ marginBottom: 16 }}
    />
  );
}; 