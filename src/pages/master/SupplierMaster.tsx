import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, Form, Input, Select, InputNumber, Rate, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { FormCard, DataTable, StatusTag, SearchForm, ExportButton } from '../../shared/components';
import type { Supplier } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

const SupplierMasterPage: React.FC = () => {
  const [data, setData] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Supplier | null>(null);
  const [form] = Form.useForm();

  // Mock data
  const mockData: Supplier[] = [
    {
      id: '1',
      supplierCode: 'SUP-001',
      supplierName: 'ABC Materials Co.',
      contactPerson: 'Nguyễn Văn A',
      phone: '+84-28-1111-2222',
      email: 'contact@abcmaterials.com',
      address: '123 Công nghiệp Street, Bình Dương',
      taxCode: '0301234567',
      paymentTerms: 'NET 30',
      deliveryTerms: 'FOB Factory',
      qualityRating: 5,
      status: 'active',
      notes: 'Nhà cung cấp uy tín, chất lượng tốt',
      createdAt: '2024-01-01T08:00:00Z',
      updatedAt: '2024-01-01T08:00:00Z',
      createdBy: 'admin'
    },
    {
      id: '2',
      supplierCode: 'SUP-002',
      supplierName: 'DEF Steel Ltd.',
      contactPerson: 'Trần Thị B',
      phone: '+84-28-3333-4444',
      email: 'sales@defsteel.com',
      address: '456 Industrial Zone, Đồng Nai',
      taxCode: '0302345678',
      paymentTerms: 'NET 45',
      deliveryTerms: 'CIF Port',
      qualityRating: 4,
      status: 'active',
      notes: 'Chuyên cung cấp thép inox, giao hàng đúng hạn',
      createdAt: '2024-01-02T09:00:00Z',
      updatedAt: '2024-01-02T09:00:00Z',
      createdBy: 'admin'
    },
    {
      id: '3',
      supplierCode: 'SUP-003',
      supplierName: 'GHI Metals Inc.',
      contactPerson: 'Lê Văn C',
      phone: '+84-28-5555-6666',
      email: 'info@ghimetals.com',
      address: '789 Export Processing Zone, Hồ Chí Minh',
      taxCode: '0303456789',
      paymentTerms: 'NET 60',
      deliveryTerms: 'EXW Warehouse',
      qualityRating: 4,
      status: 'active',
      notes: 'Chuyên kim loại màu, giá cạnh tranh',
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

  const handleEdit = (record: Supplier) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (record: Supplier) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(data.filter(item => item.id !== record.id));
      message.success('Đã xóa nhà cung cấp');
    } catch (error) {
      message.error('Không thể xóa nhà cung cấp');
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
        const updatedData = data.map(item => 
          item.id === editingRecord.id 
            ? { ...item, ...formData, updatedBy: 'current_user' }
            : item
        );
        setData(updatedData);
        message.success('Đã cập nhật thông tin nhà cung cấp');
      } else {
        const newRecord: Supplier = {
          id: Date.now().toString(),
          supplierCode: `SUP-${String(data.length + 1).padStart(3, '0')}`,
          ...formData
        };
        setData([newRecord, ...data]);
        message.success('Đã tạo nhà cung cấp mới');
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
    console.log('Search values:', values);
  };

  const columns: ColumnsType<Supplier> = [
    {
      title: 'Mã NCC',
      dataIndex: 'supplierCode',
      key: 'supplierCode',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'supplierName',
      key: 'supplierName',
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
      title: 'Điều kiện GH',
      dataIndex: 'deliveryTerms',
      key: 'deliveryTerms',
      width: 120,
    },
    {
      title: 'Đánh giá CL',
      dataIndex: 'qualityRating',
      key: 'qualityRating',
      width: 120,
      render: (value) => <Rate disabled defaultValue={value} style={{ fontSize: 14 }} />,
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
      name: 'supplierCode',
      label: 'Mã NCC',
      type: 'text' as const,
      span: 6,
    },
    {
      name: 'supplierName',
      label: 'Tên NCC',
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
        { value: 'blacklisted', label: 'Blacklist' },
      ],
      span: 6,
    },
  ];

  return (
    <div>
      <FormCard
        title="Quản lý Nhà cung cấp"
        subtitle="Master data - Danh sách nhà cung cấp"
        extra={
          <Space>
            <ExportButton
              data={data}
              columns={[]}
              filename="supplier-master"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Thêm nhà cung cấp
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
          scroll={{ x: 1600 }}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={{
            total: data.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} nhà cung cấp`,
          }}
        />
      </FormCard>

      <Modal
        title={editingRecord ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}
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
            paymentTerms: 'NET 30',
            qualityRating: 5
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="supplierName"
              label="Tên nhà cung cấp"
              rules={[{ required: true, message: 'Vui lòng nhập tên NCC' }]}
            >
              <Input placeholder="Nhập tên nhà cung cấp" />
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
              name="deliveryTerms"
              label="Điều kiện giao hàng"
            >
              <Select placeholder="Chọn điều kiện giao hàng">
                <Option value="FOB Factory">FOB Factory</Option>
                <Option value="CIF Port">CIF Port</Option>
                <Option value="EXW Warehouse">EXW Warehouse</Option>
                <Option value="DDP">DDP</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="qualityRating"
              label="Đánh giá chất lượng"
            >
              <Rate />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
                <Option value="blacklisted">Blacklist</Option>
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
              placeholder="Nhập ghi chú về nhà cung cấp"
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

export default SupplierMasterPage;
