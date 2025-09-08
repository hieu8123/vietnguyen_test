import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const DeliveryNote: React.FC = () => {
  return (
    <Card>
      <Title level={3}>Phiếu giao nhận hàng (F-WH-04-01)</Title>
      <p>Form này đang được phát triển...</p>
    </Card>
  );
};

export default DeliveryNote;