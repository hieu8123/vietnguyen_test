import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, Form, Input, Select, InputNumber, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { FormCard, DataTable, StatusTag, SearchForm, ExportButton } from '../../shared/components';
import type { Product } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

const ProductMasterPage: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Product | null>(null);
  const [form] = Form.useForm();

  // Mock data
  const mockData: Product[] = [
    {
      id: '1',
      productCode: 'PCB-A1-001',
      productName: 'PCB Board A1',
      category: 'Electronics',
      specification: 'FR4, 1.6mm, Green Solder Mask',
      unit: 'pcs',
      standardCost: 45000,
      sellingPrice: 75000,
      leadTime: 7,
      minOrderQuantity: 100,
      status: 'active',
      bomId: 'BOM-001',
      notes: 'Sản phẩm chính cho Samsung',
      createdAt: '2024-01-01T08:00:00Z',
      updatedAt: '2024-01-01T08:00:00Z',
      createdBy: 'admin'
    },
    {
      id: '2',
      productCode: 'CON-B-002',
      productName: 'Connector Type B',
      category: 'Connectors',
      specification: '50-pin, Gold Plated',
      unit: 'pcs',
      standardCost: 25000,
      sellingPrice: 40000,
      leadTime: 5,
      minOrderQuantity: 500,
      status: 'active',
      bomId: 'BOM-002',
      notes: 'Connector chuyên dụng cho LG Display',
      createdAt: '2024-01-02T09:00:00Z',
      updatedAt: '2024-01-02T09:00:00Z',
      createdBy: 'admin'
    },
    {
      id: '3',
      productCode: 'HS-C-003',
      productName: 'Heat Sink Model C',
      category: 'Thermal Management',
      specification: 'Aluminum 6061, Anodized',
      unit: 'pcs',
      standardCost: 85000,
      sellingPrice: 125000,
      leadTime: 10,
      minOrderQuantity: 50,
      status: 'active',
      bomId: 'BOM-003',
      notes: 'Tản nhiệt cho Intel processors',
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

  const handleEdit = (record: Product) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (record: Product) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(data.filter(item => item.id !== record.id));
      message.success('Đã xóa sản phẩm');
    } catch (error) {
      message.error('Không thể xóa sản phẩm');
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
        message.success('Đã cập nhật thông tin sản phẩm');
      } else {
        // Create new record
        const newRecord: Product = {
          id: Date.now().toString(),
          ...formData
        };
        setData([newRecord, ...data]);
        message.success('Đã tạo sản phẩm mới');
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

  const columns: ColumnsType<Product> = [
    {
      title: 'Mã SP',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 120,
      fixed: 'left',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 150,
    },
    {
      title: 'Thông số',
      dataIndex: 'specification',
      key: 'specification',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
    },
    {
      title: 'Giá gốc',
      dataIndex: 'standardCost',
      key: 'standardCost',
      width: 120,
      align: 'right',
      render: (value) => value ? `${value.toLocaleString()}` : '0',
    },
    {
      title: 'Giá bán',
      dataIndex: 'sellingPrice',
      key: 'sellingPrice',
      width: 120,
      align: 'right',
      render: (value) => value ? `${value.toLocaleString()}` : '0',
    },
    {
      title: 'Lead Time',
      dataIndex: 'leadTime',
      key: 'leadTime',
      width: 100,
      render: (value) => value ? `${value} ngày` : '-',
    },
    {
      title: 'MOQ',
      dataIndex: 'minOrderQuantity',
      key: 'minOrderQuantity',
      width: 100,
      align: 'right',
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
      name: 'productCode',
      label: 'Mã sản phẩm',
      type: 'text' as const,
      span: 6,
    },
    {
      name: 'productName',
      label: 'Tên sản phẩm',
      type: 'text' as const,
      span: 6,
    },
    {
      name: 'category',
      label: 'Danh mục',
      type: 'select' as const,
      options: [
        { value: 'Electronics', label: 'Electronics' },
        { value: 'Connectors', label: 'Connectors' },
        { value: 'Thermal Management', label: 'Thermal Management' },
        { value: 'Mechanical', label: 'Mechanical' },
      ],
      span: 6,
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Không hoạt động' },
        { value: 'discontinued', label: 'Ngừng sản xuất' },
      ],
      span: 6,
    },
  ];

  const exportColumns = [
    { key: 'productCode', title: 'Mã SP' },
    { key: 'productName', title: 'Tên sản phẩm' },
    { key: 'category', title: 'Danh mục' },
    { key: 'specification', title: 'Thông số' },
    { key: 'unit', title: 'Đơn vị' },
    { key: 'standardCost', title: 'Giá gốc' },
    { key: 'sellingPrice', title: 'Giá bán' },
    { key: 'leadTime', title: 'Lead Time' },
    { key: 'minOrderQuantity', title: 'MOQ' },
    { key: 'status', title: 'Trạng thái' },
  ];

  return (
    <div>
      <FormCard
        title="Quản lý Sản phẩm"
        subtitle="Master data - Danh sách sản phẩm"
        extra={
          <Space>
            <ExportButton
              data={data}
              columns={exportColumns}
              filename="product-master"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Thêm sản phẩm
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
            showTotal: (total) => `Tổng ${total} sản phẩm`,
          }}
        />
      </FormCard>

      {/* Create/Edit Modal */}
      <Modal
        title={editingRecord ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
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
            unit: 'pcs',
            leadTime: 7,
            minOrderQuantity: 1
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="productCode"
              label="Mã sản phẩm"
              rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm' }]}
            >
              <Input placeholder="Nhập mã sản phẩm" />
            </Form.Item>

            <Form.Item
              name="productName"
              label="Tên sản phẩm"
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Danh mục"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
            >
              <Select placeholder="Chọn danh mục">
                <Option value="Electronics">Electronics</Option>
                <Option value="Connectors">Connectors</Option>
                <Option value="Thermal Management">Thermal Management</Option>
                <Option value="Mechanical">Mechanical</Option>
                <Option value="Chemical">Chemical</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="unit"
              label="Đơn vị"
              rules={[{ required: true, message: 'Vui lòng chọn đơn vị' }]}
            >
              <Select placeholder="Chọn đơn vị">
                <Option value="pcs">pcs</Option>
                <Option value="kg">kg</Option>
                <Option value="m">m</Option>
                <Option value="m2">m²</Option>
                <Option value="set">set</Option>
                <Option value="roll">roll</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="standardCost"
              label="Giá gốc (VND)"
            >
              <InputNumber
                placeholder="Nhập giá gốc"
                style={{ width: '100%' }}
                min={0}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              name="sellingPrice"
              label="Giá bán (VND)"
            >
              <InputNumber
                placeholder="Nhập giá bán"
                style={{ width: '100%' }}
                min={0}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              name="leadTime"
              label="Lead Time (ngày)"
            >
              <InputNumber
                placeholder="Nhập thời gian lead time"
                style={{ width: '100%' }}
                min={1}
              />
            </Form.Item>

            <Form.Item
              name="minOrderQuantity"
              label="MOQ (Số lượng tối thiểu)"
            >
              <InputNumber
                placeholder="Nhập MOQ"
                style={{ width: '100%' }}
                min={1}
              />
            </Form.Item>

            <Form.Item
              name="bomId"
              label="BOM ID"
            >
              <Input placeholder="Nhập BOM ID (nếu có)" />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
                <Option value="discontinued">Ngừng sản xuất</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="specification"
            label="Thông số kỹ thuật"
          >
            <TextArea
              rows={2}
              placeholder="Nhập thông số kỹ thuật chi tiết"
            />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <TextArea
              rows={3}
              placeholder="Nhập ghi chú về sản phẩm"
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

export default ProductMasterPage;
