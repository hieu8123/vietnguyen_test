import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Space, Progress, Table, Tag, Spin } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ToolOutlined,
  InboxOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Column, Pie, Line } from '@ant-design/charts';
import { StatisticCard, ChartCard } from '../shared/components';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock dashboard data
      setDashboardData({
        totalOrders: { value: 156, trend: { value: 12.5, direction: 'up', period: 'tháng trước' } },
        todayProduction: { value: 1893, trend: { value: 8.3, direction: 'up', period: 'hôm qua' } },
        qualityRate: { value: 98.3, trend: { value: 2.1, direction: 'up', period: 'tháng trước' } },
        defectRate: { value: 1.7, trend: { value: 0.5, direction: 'down', period: 'tháng trước' } },
        inventoryLevel: { value: 85, trend: { value: 3.2, direction: 'down', period: 'tuần trước' } },
        activeEmployees: { value: 42, total: 45 },
        pendingDeliveries: { value: 3, urgent: 2 }
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Quality distribution data
  const qualityData = [
    { type: 'Đạt', value: 95.5 },
    { type: 'Có điều kiện', value: 2.8 },
    { type: 'Không đạt', value: 1.7 }
  ];

  // Production trend data
  const trendData = [
    { date: '01/01', production: 1650, target: 1800, quality: 96.5 },
    { date: '02/01', production: 1720, target: 1800, quality: 97.2 },
    { date: '03/01', production: 1580, target: 1800, quality: 95.8 },
    { date: '04/01', production: 1890, target: 1800, quality: 98.1 },
    { date: '05/01', production: 1750, target: 1800, quality: 97.8 },
    { date: '06/01', production: 1820, target: 1800, quality: 98.5 },
    { date: '07/01', production: 1893, target: 1800, quality: 98.3 }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Đang tải dữ liệu dashboard...</Text>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Tổng quan hệ thống</Title>
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="Tổng đơn hàng tháng này"
            value={dashboardData.totalOrders?.value || 0}
            prefix={<ToolOutlined />}
            color="#1890ff"
            trend={dashboardData.totalOrders?.trend}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="Sản lượng hôm nay"
            value={dashboardData.todayProduction?.value || 0}
            suffix="pcs"
            color="#52c41a"
            trend={dashboardData.todayProduction?.trend}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="Tỷ lệ đạt chất lượng"
            value={dashboardData.qualityRate?.value || 0}
            suffix="%"
            precision={1}
            color="#52c41a"
            trend={dashboardData.qualityRate?.trend}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="Tỷ lệ lỗi"
            value={dashboardData.defectRate?.value || 0}
            suffix="%"
            precision={1}
            color="#cf1322"
            trend={dashboardData.defectRate?.trend}
          />
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <ChartCard title="Tiến độ sản xuất tuần này" height={300}>
            <Column {...config} height={250} />
          </ChartCard>
        </Col>
        <Col xs={24} lg={8}>
          <ChartCard title="Phân bố chất lượng" height={300}>
            <Pie
              data={qualityData}
              angleField="value"
              colorField="type"
              radius={0.8}
              innerRadius={0.4}
              label={{
                type: 'inner',
                offset: '-30%',
                content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
                style: {
                  fontSize: 14,
                  textAlign: 'center',
                },
              }}
              color={['#52c41a', '#faad14', '#ff4d4f']}
              height={250}
            />
          </ChartCard>
        </Col>
        <Col xs={24} lg={8}>
          <ChartCard title="Xu hướng sản xuất 7 ngày" height={300}>
            <Line
              data={trendData}
              xField="date"
              yField="production"
              seriesField="type"
              yAxis={{
                label: {
                  formatter: (v) => `${v}`,
                },
              }}
              color={['#1890ff']}
              smooth={true}
              height={250}
            />
          </ChartCard>
        </Col>
      </Row>

      {/* Machine Performance */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Hiệu suất máy móc" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>CNC Mill 01</Text>
                  <Text strong>92%</Text>
                </div>
                <Progress percent={92} status="active" strokeColor="#52c41a" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>CNC Mill 02</Text>
                  <Text strong>87%</Text>
                </div>
                <Progress percent={87} status="active" strokeColor="#52c41a" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>CNC Lathe 01</Text>
                  <Text strong>78%</Text>
                </div>
                <Progress percent={78} status="active" strokeColor="#faad14" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Band Saw 01</Text>
                  <Text strong>95%</Text>
                </div>
                <Progress percent={95} status="active" strokeColor="#52c41a" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Milling Machine 01</Text>
                  <Text strong>65%</Text>
                </div>
                <Progress percent={65} status="active" strokeColor="#ff4d4f" />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <StatisticCard
                title="Tồn kho NVL"
                value={dashboardData.inventoryLevel?.value || 0}
                suffix="%"
                color="#1890ff"
                trend={dashboardData.inventoryLevel?.trend}
                extra={<Text type="success">Đủ cho 15 ngày sản xuất</Text>}
              />
            </Col>
            <Col span={24}>
              <StatisticCard
                title="Nhân viên đang làm việc"
                value={`${dashboardData.activeEmployees?.value || 0}/${dashboardData.activeEmployees?.total || 0}`}
                color="#52c41a"
                prefix={<TeamOutlined />}
                extra={<Text>Ca sáng: 20, Ca chiều: 22</Text>}
              />
            </Col>
            <Col span={24}>
              <StatisticCard
                title="Đơn hàng cần giao hôm nay"
                value={dashboardData.pendingDeliveries?.value || 0}
                color="#faad14"
                prefix={<InboxOutlined />}
                extra={<Text type="warning">2 đang đóng gói, 1 chờ QC</Text>}
              />
            </Col>
          </Row>
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

    </div>
  );
};

export default Dashboard;