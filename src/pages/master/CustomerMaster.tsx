import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, Form, Input, Select, InputNumber, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { FormCard, DataTable, StatusTag, SearchForm, ExportButton } from '../../shared/components';
import type { Customer } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

const CustomerMasterPage: React.FC = () => {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Customer | null>(null);
  const [form] = Form.useForm();

  // Mock data
  const mockData: Customer[] = [
    {
      id: '1',
      customerCode: 'CUST-001',
      customerName: 'Samsung Electronics',
      contactPerson: 'Kim Min Jun',
      phone: '+84-28-1234-5678',
      email: 'kim.minjun@samsung.com',
      address: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
      taxCode: '0123456789',
      paymentTerms: 'NET 30',
      creditLimit: 1000000000,
      status: 'active',
      notes: 'Khách hàng VIP, ưu tiên xử lý',
      createdAt: '2024-01-01T08:00:00Z',
      updatedAt: '2024-01-01T08:00:00Z',
      createdBy: 'admin'
    },
    {
      id: '2',
      customerCode: 'CUST-002',
      customerName: 'LG Display',
      contactPerson: 'Park Seo Jun',
      phone: '+84-28-8765-4321',
      email: 'park.seojun@lgdisplay.com',
      address: '456 Le Loi Street, District 3, Ho Chi Minh City',
      taxCode: '0987654321',
      paymentTerms: 'NET 45',
      creditLimit: 800000000,
      status: 'active',
      notes: 'Yêu cầu báo cáo chất lượng chi tiết',
      createdAt: '2024-01-02T09:00:00Z',
      updatedAt: '2024-01-02T09:00:00Z',
      createdBy: 'admin'
    },
    {
      id: '3',
      customerCode: 'CUST-003',
      customerName: 'Intel Vietnam',
      contactPerson: 'John Smith',
      phone: '+84-28-5555-1234',
      email: 'john.smith@intel.com',
      address: '789 Dong Khoi Street, District 1, Ho Chi Minh City',
      taxCode: '0555123456',
      paymentTerms: 'NET 60',
      creditLimit: 1500000000,
      status: 'active',
      notes: 'Đối tác chiến lược, giao hàng ưu tiên',
      createdAt: '2024-01-03T10:00:00Z',
      updatedAt: '2024-01-03T10:00:00Z',
      createdBy: 'admin'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(mockData);
    } catch (error) {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Customer) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (record: Customer) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(data.filter(item => item.id !== record.id));
      message.success('Đã xóa khách hàng');
    } catch (error) {
      message.error('Không thể xóa khách hàng');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const formData = {
        ...values,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current_user'
      };

      if (editingRecord) {
        // Update existing record
        const updatedData = data.map(item => 
          item.id === editingRecord.id 
            ? { ...item, ...formData, updatedBy: 'current_user' }
            : item
        );
        setData(updatedData);
        message.success('Đã cập nhật thông tin khách hàng');
      } else {
        // Create new record
        const newRecord: Customer = {
          id: Date.now().toString(),
          customerCode: `CUST-${String(data.length + 1).padStart(3, '0')}`,
          ...formData
        };
        setData([newRecord, ...data]);
        message.success('Đã tạo khách hàng mới');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (values: any) => {
    // Implement search logic
    console.log('Search values:', values);
  };

  const columns: ColumnsType<Customer> = [
    {
      title: 'Mã KH',
      dataIndex: 'customerCode',
      key: 'customerCode',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
    },
    {
      title: 'Người liên hệ',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 150,
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    {
      title: 'Mã số thuế',
      dataIndex: 'taxCode',
      key: 'taxCode',
      width: 120,
    },
    {
      title: 'Điều kiện TT',
      dataIndex: 'paymentTerms',
      key: 'paymentTerms',
      width: 100,
    },
    {
      title: 'Hạn mức tín dụng',
      dataIndex: 'creditLimit',
      key: 'creditLimit',
      width: 150,
      align: 'right',
      render: (value) => value ? `${value.toLocaleString()} VND` : '0 VND',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value) => <StatusTag status={value} type="general" />,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (value) => dayjs(value).format('DD/MM/YYYY'),
    },
  ];

  const searchFields = [
    {
      name: 'customerCode',
      label: 'Mã khách hàng',
      type: 'text' as const,
      span: 6,
    },
    {
      name: 'customerName',
      label: 'Tên khách hàng',
      type: 'text' as const,
      span: 6,
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Không hoạt động' },
      ],
      span: 6,
    },
    {
      name: 'dateRange',
      label: 'Khoảng thời gian',
      type: 'dateRange' as const,
      span: 6,
    },
  ];

  const exportColumns = [
    { key: 'customerCode', title: 'Mã KH' },
    { key: 'customerName', title: 'Tên khách hàng' },
    { key: 'contactPerson', title: 'Người liên hệ' },
    { key: 'phone', title: 'Điện thoại' },
    { key: 'email', title: 'Email' },
    { key: 'address', title: 'Địa chỉ' },
    { key: 'taxCode', title: 'Mã số thuế' },
    { key: 'paymentTerms', title: 'Điều kiện TT' },
    { key: 'creditLimit', title: 'Hạn mức tín dụng' },
    { key: 'status', title: 'Trạng thái' },
  ];

  return (
    <div>
      <FormCard
        title="Quản lý Khách hàng"
        subtitle="Master data - Danh sách khách hàng"
        extra={
          <Space>
            <ExportButton
              data={data}
              columns={exportColumns}
              filename="customer-master"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Thêm khách hàng
            </Button>
          </Space>
        }
      >
        <SearchForm
          fields={searchFields}
          onSearch={handleSearch}
          loading={loading}
        />

        <DataTable
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1500 }}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={{
            total: data.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} khách hàng`,
          }}
        />
      </FormCard>

      {/* Create/Edit Modal */}
      <Modal
        title={editingRecord ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'active',
            paymentTerms: 'NET 30'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="customerName"
              label="Tên khách hàng"
              rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
            >
              <Input placeholder="Nhập tên khách hàng" />
            </Form.Item>

            <Form.Item
              name="contactPerson"
              label="Người liên hệ"
            >
              <Input placeholder="Nhập tên người liên hệ" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Điện thoại"
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              name="taxCode"
              label="Mã số thuế"
            >
              <Input placeholder="Nhập mã số thuế" />
            </Form.Item>

            <Form.Item
              name="paymentTerms"
              label="Điều kiện thanh toán"
            >
              <Select placeholder="Chọn điều kiện thanh toán">
                <Option value="NET 15">NET 15</Option>
                <Option value="NET 30">NET 30</Option>
                <Option value="NET 45">NET 45</Option>
                <Option value="NET 60">NET 60</Option>
                <Option value="COD">COD</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="creditLimit"
              label="Hạn mức tín dụng (VND)"
            >
              <InputNumber
                placeholder="Nhập hạn mức tín dụng"
                style={{ width: '100%' }}
                min={0}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="address"
            label="Địa chỉ"
          >
            <TextArea
              rows={2}
              placeholder="Nhập địa chỉ đầy đủ"
            />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <TextArea
              rows={3}
              placeholder="Nhập ghi chú về khách hàng"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingRecord ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerMasterPage;
