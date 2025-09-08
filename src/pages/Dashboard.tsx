import React from 'react';
import { Row, Col, Card, Statistic, Typography, Space, Progress, Table, Tag } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { Column } from '@ant-design/charts';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  // Sample data for production chart
  const productionData = [
    { date: 'T2', value: 85, type: 'Hoàn thành' },
    { date: 'T2', value: 15, type: 'Đang xử lý' },
    { date: 'T3', value: 90, type: 'Hoàn thành' },
    { date: 'T3', value: 10, type: 'Đang xử lý' },
    { date: 'T4', value: 88, type: 'Hoàn thành' },
    { date: 'T4', value: 12, type: 'Đang xử lý' },
    { date: 'T5', value: 92, type: 'Hoàn thành' },
    { date: 'T5', value: 8, type: 'Đang xử lý' },
    { date: 'T6', value: 87, type: 'Hoàn thành' },
    { date: 'T6', value: 13, type: 'Đang xử lý' },
    { date: 'T7', value: 95, type: 'Hoàn thành' },
    { date: 'T7', value: 5, type: 'Đang xử lý' },
    { date: 'CN', value: 60, type: 'Hoàn thành' },
    { date: 'CN', value: 40, type: 'Đang xử lý' },
  ];

  const config = {
    data: productionData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    isStack: true,
    label: {
      position: 'middle',
      style: {
        fill: '#fff',
      },
    },
    color: ['#52c41a', '#faad14'],
  };

  // Sample data for recent orders
  const recentOrders = [
    {
      key: '1',
      po: 'PO-2024-001',
      customer: 'Samsung Electronics',
      product: 'PCB Board A1',
      quantity: 500,
      status: 'processing',
      deadline: '2024-01-15',
    },
    {
      key: '2',
      po: 'PO-2024-002',
      customer: 'LG Display',
      product: 'Connector Type B',
      quantity: 1000,
      status: 'completed',
      deadline: '2024-01-12',
    },
    {
      key: '3',
      po: 'PO-2024-003',
      customer: 'Intel Vietnam',
      product: 'Heat Sink Model C',
      quantity: 250,
      status: 'pending',
      deadline: '2024-01-18',
    },
    {
      key: '4',
      po: 'PO-2024-004',
      customer: 'Foxconn',
      product: 'Metal Frame D2',
      quantity: 750,
      status: 'processing',
      deadline: '2024-01-20',
    },
  ];

  const columns = [
    {
      title: 'PO',
      dataIndex: 'po',
      key: 'po',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right' as const,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let text = '';
        let icon = null;
        
        switch(status) {
          case 'completed':
            color = 'success';
            text = 'Hoàn thành';
            icon = <CheckCircleOutlined />;
            break;
          case 'processing':
            color = 'processing';
            text = 'Đang xử lý';
            icon = <ClockCircleOutlined />;
            break;
          case 'pending':
            color = 'warning';
            text = 'Chờ xử lý';
            icon = <ClockCircleOutlined />;
            break;
          default:
            text = status;
        }
        
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'Hạn chót',
      dataIndex: 'deadline',
      key: 'deadline',
    },
  ];

  return (
    <div>
      <Title level={2}>Tổng quan hệ thống</Title>
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng tháng này"
              value={156}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sản lượng hôm nay"
              value={1893}
              valueStyle={{ color: '#52c41a' }}
              prefix={<ArrowUpOutlined />}
              suffix="pcs"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tỷ lệ đạt chất lượng"
              value={98.3}
              valueStyle={{ color: '#52c41a' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tỷ lệ lỗi"
              value={1.7}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Charts and Tables */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Tiến độ sản xuất tuần này" bordered={false}>
            <Column {...config} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Hiệu suất máy móc" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Text>CNC Mill 01</Text>
                <Progress percent={92} status="active" strokeColor="#52c41a" />
              </div>
              <div>
                <Text>CNC Mill 02</Text>
                <Progress percent={87} status="active" strokeColor="#52c41a" />
              </div>
              <div>
                <Text>CNC Lathe 01</Text>
                <Progress percent={78} status="active" strokeColor="#faad14" />
              </div>
              <div>
                <Text>Band Saw 01</Text>
                <Progress percent={95} status="active" strokeColor="#52c41a" />
              </div>
              <div>
                <Text>Milling Machine 01</Text>
                <Progress percent={65} status="active" strokeColor="#ff4d4f" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders Table */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Đơn hàng gần đây" bordered={false}>
            <Table 
              columns={columns} 
              dataSource={recentOrders}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text type="secondary">Tồn kho NVL</Text>
              <Title level={3} style={{ margin: 0 }}>85%</Title>
              <Text type="success">Đủ cho 15 ngày sản xuất</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text type="secondary">Nhân viên đang làm việc</Text>
              <Title level={3} style={{ margin: 0 }}>42/45</Title>
              <Text>Ca sáng: 20, Ca chiều: 22</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text type="secondary">Đơn hàng cần giao hôm nay</Text>
              <Title level={3} style={{ margin: 0 }}>3</Title>
              <Text type="warning">2 đang đóng gói, 1 chờ QC</Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;