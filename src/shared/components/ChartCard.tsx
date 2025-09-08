import React from 'react';
import { Card, Empty } from 'antd';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
  loading?: boolean;
  height?: number;
  bodyStyle?: React.CSSProperties;
  noData?: boolean;
  emptyText?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  extra,
  loading = false,
  height = 300,
  bodyStyle,
  noData = false,
  emptyText = 'Không có dữ liệu',
}) => {
  return (
    <Card
      title={title}
      extra={extra}
      loading={loading}
      bodyStyle={{
        height: height,
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...bodyStyle,
      }}
    >
      {noData ? (
        <Empty 
          description={emptyText}
          style={{ margin: 0 }}
        />
      ) : (
        <div style={{ width: '100%', height: '100%' }}>
          {children}
        </div>
      )}
    </Card>
  );
};

export default ChartCard;
