import React from 'react';
import { Card, Row, Col, Typography, DatePicker, Space, Statistic } from 'antd';
import { Pie, Column, Area } from '@ant-design/charts';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const WarehouseAnalytics: React.FC = () => {
  // Stock by material type
  const stockData = [
    { material: 'Aluminum', value: 45 },
    { material: 'Steel', value: 30 },
    { material: 'Brass', value: 15 },
    { material: 'Plastic', value: 10 },
  ];

  const pieConfig = {
    data: stockData,
    angleField: 'value',
    colorField: 'material',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}%',
    },
    interactions: [{ type: 'element-active' }],
  };

  // In/Out balance data
  const inOutData = [
    { date: '01/01', type: 'Nhập', value: 120 },
    { date: '01/01', type: 'Xuất', value: 100 },
    { date: '02/01', type: 'Nhập', value: 150 },
    { date: '02/01', type: 'Xuất', value: 130 },
    { date: '03/01', type: 'Nhập', value: 180 },
    { date: '03/01', type: 'Xuất', value: 160 },
    { date: '04/01', type: 'Nhập', value: 140 },
    { date: '04/01', type: 'Xuất', value: 150 },
    { date: '05/01', type: 'Nhập', value: 200 },
    { date: '05/01', type: 'Xuất', value: 180 },
  ];

  const columnConfig = {
    data: inOutData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    color: ['#52c41a', '#ff4d4f'],
  };

  // Finished goods turnover
  const turnoverData = [
    { month: 'T1', value: 85 },
    { month: 'T2', value: 92 },
    { month: 'T3', value: 88 },
    { month: 'T4', value: 95 },
    { month: 'T5', value: 90 },
    { month: 'T6', value: 93 },
  ];

  const areaConfig = {
    data: turnoverData,
    xField: 'month',
    yField: 'value',
    smooth: true,
    areaStyle: {
      fillOpacity: 0.6,
    },
  };

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3}>Phân tích kho</Title>
          </Col>
          <Col>
            <Space>
              <RangePicker format="DD/MM/YYYY" />
            </Space>
          </Col>
        </Row>

        {/* Summary Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng giá trị tồn kho"
                value={1128000000}
                suffix="VNĐ"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Vòng quay kho"
                value={8.2}
                suffix="lần/tháng"
                valueStyle={{ color: '#52c41a' }}
                prefix={<ArrowUpOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tỷ lệ hao hụt"
                value={0.3}
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
                prefix={<ArrowDownOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Mức tồn kho an toàn"
                value={92}
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Tồn kho theo loại vật liệu" bordered={false}>
              <Pie {...pieConfig} height={300} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Cân bằng nhập/xuất" bordered={false}>
              <Column {...columnConfig} height={300} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card title="Vòng quay thành phẩm" bordered={false}>
              <Area {...areaConfig} height={300} />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default WarehouseAnalytics;