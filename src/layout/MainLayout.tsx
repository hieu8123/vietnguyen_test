import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  theme,
  Typography,
  Avatar,
  Space,
  Dropdown,
  Button,
} from 'antd';
import {
  DashboardOutlined,
  ToolOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  SwapOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'production',
      icon: <ToolOutlined />,
      label: 'Quản lý sản xuất',
      children: [
        {
          key: '/production/machine-report',
          label: 'Báo cáo máy (F-PR-03-02)',
          onClick: () => navigate('/production/machine-report'),
        },
        {
          key: '/production/production-order',
          label: 'Lệnh sản xuất (F-PN-01-02)',
          onClick: () => navigate('/production/production-order'),
        },
        {
          key: '/production/customer-bom',
          label: 'BOM khách hàng (F-PR-01-01)',
          onClick: () => navigate('/production/customer-bom'),
        },
        {
          key: '/production/production-output',
          label: 'Báo cáo sản lượng',
          onClick: () => navigate('/production/production-output'),
        },
        {
          key: '/production/process-control',
          label: 'Kiểm soát công đoạn (F-TN-01-01)',
          onClick: () => navigate('/production/process-control'),
        },
        {
          key: '/production/process-evaluation',
          label: 'Đánh giá quy trình (F-PR-02-01)',
          onClick: () => navigate('/production/process-evaluation'),
        },
      ],
    },
    {
      key: 'quality',
      icon: <CheckCircleOutlined />,
      label: 'Kiểm soát chất lượng',
      children: [
        {
          key: '/quality/material-incoming',
          label: 'Kiểm tra NVL đầu vào (F-QC-15-02)',
          onClick: () => navigate('/quality/material-incoming'),
        },
        {
          key: '/quality/inspection-sheet',
          label: 'Phiếu kiểm tra (F-QC-03-01)',
          onClick: () => navigate('/quality/inspection-sheet'),
        },
        {
          key: '/quality/final-inspection',
          label: 'Kiểm tra cuối cùng (F-QC-04-02)',
          onClick: () => navigate('/quality/final-inspection'),
        },
        {
          key: '/quality/qc-inspection',
          label: 'Phiếu kiểm tra QC (F-QC-02-02)',
          onClick: () => navigate('/quality/qc-inspection'),
        },
        {
          key: '/quality/program-check',
          label: 'Kiểm tra chương trình (F-TN-04-01)',
          onClick: () => navigate('/quality/program-check'),
        },
        {
          key: '/quality/program-update',
          label: 'Cập nhật chương trình (F-TN-04-02)',
          onClick: () => navigate('/quality/program-update'),
        },
      ],
    },
    {
      key: 'warehouse',
      icon: <InboxOutlined />,
      label: 'Quản lý kho',
      children: [
        {
          key: '/warehouse/outsourcing-export',
          label: 'Xuất kho gia công ngoài (F-WH-05-01)',
          onClick: () => navigate('/warehouse/outsourcing-export'),
        },
        {
          key: '/warehouse/material-export',
          label: 'Xuất kho NVL (F-WH-09-01)',
          onClick: () => navigate('/warehouse/material-export'),
        },
        {
          key: '/warehouse/delivery-note',
          label: 'Phiếu giao nhận hàng (F-WH-04-01)',
          onClick: () => navigate('/warehouse/delivery-note'),
        },
        {
          key: '/warehouse/daily-delivery',
          label: 'Theo dõi giao nhận hàng (F-WH-03-02)',
          onClick: () => navigate('/warehouse/daily-delivery'),
        },
        {
          key: '/warehouse/finished-goods',
          label: 'Thành phẩm tồn kho (F-WH-11-01)',
          onClick: () => navigate('/warehouse/finished-goods'),
        },
        {
          key: '/warehouse/material-in-out',
          label: 'Nhập xuất NVL (F-WH-01-01)',
          onClick: () => navigate('/warehouse/material-in-out'),
        },
        {
          key: '/warehouse/supplies-in-out',
          label: 'Nhập xuất phụ liệu (F-WH-02-01)',
          onClick: () => navigate('/warehouse/supplies-in-out'),
        },
        {
          key: '/warehouse/material-import',
          label: 'Nhập kho NVL (F-WH-08-01)',
          onClick: () => navigate('/warehouse/material-import'),
        },
        {
          key: '/warehouse/supplies-import',
          label: 'Nhập kho phụ liệu (F-WH-10-01)',
          onClick: () => navigate('/warehouse/supplies-import'),
        },
      ],
    },
    {
      key: 'shift',
      icon: <SwapOutlined />,
      label: 'Bàn giao ca & Setup',
      children: [
        {
          key: '/shift/leader-handover',
          label: 'Bàn giao ca Leader',
          onClick: () => navigate('/shift/leader-handover'),
        },
        {
          key: '/shift/worker-handover',
          label: 'Bàn giao ca công nhân',
          onClick: () => navigate('/shift/worker-handover'),
        },
        {
          key: '/shift/setup-sheet',
          label: 'Setup Sheet Report',
          onClick: () => navigate('/shift/setup-sheet'),
        },
      ],
    },
    {
      key: 'master',
      icon: <DatabaseOutlined />,
      label: 'Dữ liệu Master',
      children: [
        {
          key: '/master/customer',
          label: 'Khách hàng',
          onClick: () => navigate('/master/customer'),
        },
        {
          key: '/master/product',
          label: 'Sản phẩm',
          onClick: () => navigate('/master/product'),
        },
        {
          key: '/master/material',
          label: 'Nguyên vật liệu',
          onClick: () => navigate('/master/material'),
        },
        {
          key: '/master/supplier',
          label: 'Nhà cung cấp',
          onClick: () => navigate('/master/supplier'),
        },
        {
          key: '/master/machine',
          label: 'Máy móc thiết bị',
          onClick: () => navigate('/master/machine'),
        },
        {
          key: '/master/drawing',
          label: 'Bản vẽ kỹ thuật',
          onClick: () => navigate('/master/drawing'),
        },
      ],
    },
    {
      key: 'statistics',
      icon: <BarChartOutlined />,
      label: 'Thống kê & Phân tích',
      children: [
        {
          key: '/statistics/production',
          label: 'Thống kê sản xuất',
          onClick: () => navigate('/statistics/production'),
        },
        {
          key: '/statistics/quality',
          label: 'Phân tích chất lượng',
          onClick: () => navigate('/statistics/quality'),
        },
        {
          key: '/statistics/warehouse',
          label: 'Phân tích kho',
          onClick: () => navigate('/statistics/warehouse'),
        },
      ],
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={280}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            {collapsed ? 'VN' : 'Viet Nguyen Precision'}
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 280, transition: 'margin-left 0.2s' }}>
        <Header 
          style={{ 
            padding: '0 24px', 
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Space>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>Admin</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;