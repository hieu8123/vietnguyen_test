import React from 'react';
import { Card, Row, Col, Typography, DatePicker, Space } from 'antd';
import { Pie, Column, Line } from '@ant-design/charts';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const QCAnalytics: React.FC = () => {
  // Pass/Fail distribution data
  const passFailData = [
    { type: 'Pass', value: 932, percentage: 98.3 },
    { type: 'Fail', value: 16, percentage: 1.7 },
  ];

  const pieConfig = {
    data: passFailData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}%',
    },
    interactions: [{ type: 'element-active' }],
    color: ['#52c41a', '#ff4d4f'],
  };

  // Pareto defect analysis data
  const defectData = [
    { defect: 'Kích thước sai', count: 45, cumulative: 45 },
    { defect: 'Bề mặt xước', count: 32, cumulative: 77 },
    { defect: 'Lỗi ren', count: 28, cumulative: 105 },
    { defect: 'Độ phẳng', count: 20, cumulative: 125 },
    { defect: 'Màu sắc', count: 15, cumulative: 140 },
    { defect: 'Khác', count: 10, cumulative: 150 },
  ];

  const paretoConfig = {
    data: defectData,
    xField: 'defect',
    yField: 'count',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
  };

  // Inspection timeline data
  const timelineData = [
    { time: '08:00', inspections: 12 },
    { time: '09:00', inspections: 18 },
    { time: '10:00', inspections: 22 },
    { time: '11:00', inspections: 20 },
    { time: '12:00', inspections: 8 },
    { time: '13:00', inspections: 15 },
    { time: '14:00', inspections: 25 },
    { time: '15:00', inspections: 28 },
    { time: '16:00', inspections: 24 },
    { time: '17:00', inspections: 18 },
  ];

  const timelineConfig = {
    data: timelineData,
    xField: 'time',
    yField: 'inspections',
    smooth: true,
    point: {
      size: 5,
      shape: 'diamond',
    },
  };

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3}>Phân tích chất lượng</Title>
          </Col>
          <Col>
            <Space>
              <RangePicker format="DD/MM/YYYY" />
            </Space>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Phân bố Pass/Fail" bordered={false}>
              <Pie {...pieConfig} height={300} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Phân tích Pareto lỗi" bordered={false}>
              <Column {...paretoConfig} height={300} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card title="Timeline kiểm tra trong ngày" bordered={false}>
              <Line {...timelineConfig} height={300} />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default QCAnalytics;