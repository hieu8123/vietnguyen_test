import React from 'react';
import { Card, Row, Col, Typography, DatePicker, Select, Space } from 'antd';
import { Column, Line, Pie } from '@ant-design/charts';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ProductionStatistics: React.FC = () => {
  // Data for daily output chart
  const dailyOutputData = [
    { date: '01/01', po: 'PO-001', value: 120 },
    { date: '01/01', po: 'PO-002', value: 80 },
    { date: '02/01', po: 'PO-001', value: 150 },
    { date: '02/01', po: 'PO-002', value: 90 },
    { date: '03/01', po: 'PO-001', value: 140 },
    { date: '03/01', po: 'PO-002', value: 100 },
    { date: '04/01', po: 'PO-001', value: 160 },
    { date: '04/01', po: 'PO-002', value: 110 },
    { date: '05/01', po: 'PO-001', value: 180 },
    { date: '05/01', po: 'PO-002', value: 95 },
  ];

  const columnConfig = {
    data: dailyOutputData,
    xField: 'date',
    yField: 'value',
    seriesField: 'po',
    isGroup: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
  };

  // Data for defect rate trend
  const defectRateData = [
    { date: '01/01', rate: 2.1 },
    { date: '02/01', rate: 1.8 },
    { date: '03/01', rate: 1.5 },
    { date: '04/01', rate: 1.9 },
    { date: '05/01', rate: 1.3 },
    { date: '06/01', rate: 1.7 },
    { date: '07/01', rate: 1.2 },
  ];

  const lineConfig = {
    data: defectRateData,
    xField: 'date',
    yField: 'rate',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  // Data for machine OEE
  const machineOEEData = [
    { machine: 'CNC Mill 01', value: 92, type: 'Availability' },
    { machine: 'CNC Mill 01', value: 88, type: 'Performance' },
    { machine: 'CNC Mill 01', value: 95, type: 'Quality' },
    { machine: 'CNC Mill 02', value: 85, type: 'Availability' },
    { machine: 'CNC Mill 02', value: 90, type: 'Performance' },
    { machine: 'CNC Mill 02', value: 93, type: 'Quality' },
    { machine: 'CNC Lathe 01', value: 78, type: 'Availability' },
    { machine: 'CNC Lathe 01', value: 82, type: 'Performance' },
    { machine: 'CNC Lathe 01', value: 90, type: 'Quality' },
  ];

  const oeeConfig = {
    data: machineOEEData,
    xField: 'machine',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
  };

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3}>Thống kê sản xuất</Title>
          </Col>
          <Col>
            <Space>
              <RangePicker format="DD/MM/YYYY" />
              <Select defaultValue="all" style={{ width: 200 }}>
                <Option value="all">Tất cả PO</Option>
                <Option value="po1">PO-2024-001</Option>
                <Option value="po2">PO-2024-002</Option>
              </Select>
            </Space>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="Sản lượng hàng ngày theo PO" bordered={false}>
              <Column {...columnConfig} height={300} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={12}>
            <Card title="Xu hướng tỷ lệ lỗi" bordered={false}>
              <Line {...lineConfig} height={300} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="OEE máy móc" bordered={false}>
              <Column {...oeeConfig} height={300} />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProductionStatistics;