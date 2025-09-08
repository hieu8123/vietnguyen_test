import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, Form, Input, Select, InputNumber, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { FormCard, DataTable, StatusTag, SearchForm, ExportButton } from '../../shared/components';
import type { Material } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

const MaterialMasterPage: React.FC = () => {
  const [data, setData] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Material | null>(null);
  const [form] = Form.useForm();

  // Mock data
  const mockData: Material[] = [
    {
      id: '1',
      materialCode: 'AL-6061-100',
      materialName: 'Aluminum 6061 Sheet',
      category: 'Metal',
      specification: '100x50x10mm, T6 Temper',
      unit: 'pcs',
      standardCost: 50000,
      supplier: 'ABC Materials Co.',
      supplierId: 'SUP-001',
      minimumStock: 100,
      maximumStock: 500,
      leadTime: 14,
      storageLocation: 'A-01-01',
      status: 'active',
      notes: 'Chất lượng cao, dùng cho PCB mounting',
      createdAt: '2024-01-01T08:00:00Z',
      updatedAt: '2024-01-01T08:00:00Z',
      createdBy: 'admin'
    },
    {
      id: '2',
      materialCode: 'SS-304-200',
      materialName: 'Stainless Steel 304',
      category: 'Metal',
      specification: '200x100x5mm, Mirror Finish',
      unit: 'pcs',
      standardCost: 75000,
      supplier: 'DEF Steel Ltd.',
      supplierId: 'SUP-002',
      minimumStock: 50,
      maximumStock: 200,
      leadTime: 21,
      storageLocation: 'B-02-01',
      status: 'active',
      notes: 'Inox 304 cao cấp, chống ăn mòn tốt',
      createdAt: '2024-01-02T09:00:00Z',
      updatedAt: '2024-01-02T09:00:00Z',
      createdBy: 'admin'
    },
    {
      id: '3',
      materialCode: 'CU-101-50',
      materialName: 'Copper C101',
      category: 'Metal',
      specification: 'Pure Copper, 99.9%',
      unit: 'kg',
      standardCost: 120000,
      supplier: 'GHI Metals Inc.',
      supplierId: 'SUP-003',
      minimumStock: 20,
      maximumStock: 100,
      leadTime: 10,
      storageLocation: 'C-01-02',
      status: 'active',
      notes: 'Đồng nguyên chất cho ứng dụng điện tử',
      createdAt: '2024-01-03T10:00:00Z',
      updatedAt: '2024-01-03T10:00:00Z',
      createdBy: 'admin'
    },
    {
      id: '4',
      materialCode: 'SCR-M3-10',
      materialName: 'Screw M3x10',
      category: 'Fastener',
      specification: 'Stainless Steel 304, Phillips Head',
      unit: 'pcs',
      standardCost: 500,
      supplier: 'XYZ Hardware',
      supplierId: 'SUP-004',
      minimumStock: 1000,
      maximumStock: 5000,
      leadTime: 7,
      storageLocation: 'D-03-01',
      status: 'active',
      notes: 'Vít inox chất lượng cao',
      createdAt: '2024-01-04T11:00:00Z',
      updatedAt: '2024-01-04T11:00:00Z',
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

  const handleEdit = (record: Material) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (record: Material) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(data.filter(item => item.id !== record.id));
      message.success('Đã xóa nguyên vật liệu');
    } catch (error) {
      message.error('Không thể xóa nguyên vật liệu');
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
        message.success('Đã cập nhật thông tin nguyên vật liệu');
      } else {
        // Create new record
        const newRecord: Material = {
          id: Date.now().toString(),
          ...formData
        };
        setData([newRecord, ...data]);
        message.success('Đã tạo nguyên vật liệu mới');
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

  const columns: ColumnsType<Material> = [
    {
      title: 'Mã NVL',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 120,
      fixed: 'left',
    },
    {
      title: 'Tên nguyên vật liệu',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 200,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 120,
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
      title: 'Giá chuẩn',
      dataIndex: 'standardCost',
      key: 'standardCost',
      width: 120,
      align: 'right',
      render: (value) => value ? `${value.toLocaleString()}` : '0',
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplier',
      key: 'supplier',
      width: 150,
    },
    {
      title: 'Tồn kho Min',
      dataIndex: 'minimumStock',
      key: 'minimumStock',
      width: 100,
      align: 'right',
    },
    {
      title: 'Tồn kho Max',
      dataIndex: 'maximumStock',
      key: 'maximumStock',
      width: 100,
      align: 'right',
    },
    {
      title: 'Lead Time',
      dataIndex: 'leadTime',
      key: 'leadTime',
      width: 100,
      render: (value) => value ? `${value} ngày` : '-',
    },
    {
      title: 'Vị trí',
      dataIndex: 'storageLocation',
      key: 'storageLocation',
      width: 100,
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
      name: 'materialCode',
      label: 'Mã NVL',
      type: 'text' as const,
      span: 6,
    },
    {
      name: 'materialName',
      label: 'Tên NVL',
      type: 'text' as const,
      span: 6,
    },
    {
      name: 'category',
      label: 'Danh mục',
      type: 'select' as const,
      options: [
        { value: 'Metal', label: 'Metal' },
        { value: 'Plastic', label: 'Plastic' },
        { value: 'Fastener', label: 'Fastener' },
        { value: 'Electronic', label: 'Electronic' },
        { value: 'Chemical', label: 'Chemical' },
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
      ],
      span: 6,
    },
  ];

  const exportColumns = [
    { key: 'materialCode', title: 'Mã NVL' },
    { key: 'materialName', title: 'Tên NVL' },
    { key: 'category', title: 'Danh mục' },
    { key: 'specification', title: 'Thông số' },
    { key: 'unit', title: 'Đơn vị' },
    { key: 'standardCost', title: 'Giá chuẩn' },
    { key: 'supplier', title: 'Nhà cung cấp' },
    { key: 'minimumStock', title: 'Tồn kho Min' },
    { key: 'maximumStock', title: 'Tồn kho Max' },
    { key: 'leadTime', title: 'Lead Time' },
    { key: 'storageLocation', title: 'Vị trí' },
    { key: 'status', title: 'Trạng thái' },
  ];

  return (
    <div>
      <FormCard
        title="Quản lý Nguyên vật liệu"
        subtitle="Master data - Danh sách nguyên vật liệu"
        extra={
          <Space>
            <ExportButton
              data={data}
              columns={exportColumns}
              filename="material-master"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Thêm NVL
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
          scroll={{ x: 1800 }}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={{
            total: data.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} nguyên vật liệu`,
          }}
        />
      </FormCard>

      {/* Create/Edit Modal */}
      <Modal
        title={editingRecord ? 'Chỉnh sửa nguyên vật liệu' : 'Thêm nguyên vật liệu mới'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={900}
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
            minimumStock: 0,
            maximumStock: 1000
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item
              name="materialCode"
              label="Mã nguyên vật liệu"
              rules={[{ required: true, message: 'Vui lòng nhập mã NVL' }]}
            >
              <Input placeholder="Nhập mã NVL" />
            </Form.Item>

            <Form.Item
              name="materialName"
              label="Tên nguyên vật liệu"
              rules={[{ required: true, message: 'Vui lòng nhập tên NVL' }]}
            >
              <Input placeholder="Nhập tên NVL" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Danh mục"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
            >
              <Select placeholder="Chọn danh mục">
                <Option value="Metal">Metal</Option>
                <Option value="Plastic">Plastic</Option>
                <Option value="Fastener">Fastener</Option>
                <Option value="Electronic">Electronic</Option>
                <Option value="Chemical">Chemical</Option>
                <Option value="Rubber">Rubber</Option>
                <Option value="Ceramic">Ceramic</Option>
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
                <Option value="liter">liter</Option>
                <Option value="roll">roll</Option>
                <Option value="sheet">sheet</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="standardCost"
              label="Giá chuẩn (VND)"
            >
              <InputNumber
                placeholder="Nhập giá chuẩn"
                style={{ width: '100%' }}
                min={0}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              name="supplier"
              label="Nhà cung cấp"
            >
              <Input placeholder="Nhập tên nhà cung cấp" />
            </Form.Item>

            <Form.Item
              name="supplierId"
              label="Mã nhà cung cấp"
            >
              <Input placeholder="Nhập mã nhà cung cấp" />
            </Form.Item>

            <Form.Item
              name="minimumStock"
              label="Tồn kho tối thiểu"
            >
              <InputNumber
                placeholder="Nhập tồn kho min"
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="maximumStock"
              label="Tồn kho tối đa"
            >
              <InputNumber
                placeholder="Nhập tồn kho max"
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="leadTime"
              label="Lead Time (ngày)"
            >
              <InputNumber
                placeholder="Nhập lead time"
                style={{ width: '100%' }}
                min={1}
              />
            </Form.Item>

            <Form.Item
              name="storageLocation"
              label="Vị trí lưu trữ"
            >
              <Input placeholder="Ví dụ: A-01-01" />
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
              placeholder="Nhập ghi chú về nguyên vật liệu"
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

export default MaterialMasterPage;