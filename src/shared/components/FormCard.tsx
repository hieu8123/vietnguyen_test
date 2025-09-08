import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

interface FormCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
  loading?: boolean;
}

const FormCard: React.FC<FormCardProps> = ({ 
  title, 
  subtitle, 
  children, 
  extra, 
  loading = false 
}) => {
  return (
    <Card 
      loading={loading}
      extra={extra}
      style={{ marginBottom: 24 }}
    >
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 8 }}>
          {title}
        </Title>
        {subtitle && (
          <Typography.Text type="secondary">
            {subtitle}
          </Typography.Text>
        )}
      </div>
      {children}
    </Card>
  );
};

export default FormCard;