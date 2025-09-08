import React from 'react';
import { Card, Statistic, Typography, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface StatisticCardProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  precision?: number;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    period: string;
  };
  extra?: React.ReactNode;
  loading?: boolean;
  color?: string;
  formatter?: (value: any) => React.ReactNode;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  precision,
  trend,
  extra,
  loading = false,
  color,
  formatter,
}) => {
  const getTrendColor = () => {
    if (!trend) return undefined;
    return trend.direction === 'up' ? '#52c41a' : '#cf1322';
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend.direction === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
  };

  return (
    <Card loading={loading} size="small">
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Statistic
            title={title}
            value={value}
            prefix={prefix}
            suffix={suffix}
            precision={precision}
            valueStyle={{ color }}
            formatter={formatter}
          />
          {extra}
        </div>
        
        {trend && (
          <div>
            <Text
              style={{ 
                color: getTrendColor(),
                fontSize: 12,
              }}
            >
              {getTrendIcon()} {Math.abs(trend.value)}% so với {trend.period}
            </Text>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default StatisticCard;
