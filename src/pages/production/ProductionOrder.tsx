import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, Form, Input, Select, DatePicker, InputNumber, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { FormCard, DataTable, StatusTag, ApprovalButton, SearchForm, ExportButton, PrintButton } from '../../shared/components';
import type { ProductionOrder, ApprovalStatus } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

const ProductionOrderPage: React.FC = () => {
  const [data, setData] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ProductionOrder | null>(null);
  const [form] = Form.useForm();

  // Mock data
  const mockData: ProductionOrder[] = [
    {
      id: '1',
      poNumber: 'PO-2024-001',
      customerName: 'Samsung Electronics',
      customerPO: 'SAM-2024-0015',
      productName: 'PCB Board A1',
      productCode: 'PCB-A1-001',
      quantity: 500,
      unit: 'pcs',
      dueDate: '2024-01-15',
      priority: 'high',
      status: 'in_progress',
      bomId: 'BOM-001',
      notes: 'Yêu cầu đặc biệt về chất lượng bề mặt',
      approvalStatus: 'approved',
      approvedBy: 'Nguyễn Văn A',
      approvedAt: '2024-01-05T10:00:00Z',
      createdAt: '2024-01-01T08:00:00Z',
      updatedAt: '2024-01-05T10:00:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      id: '2',
      poNumber: 'PO-2024-002',
      customerName: 'LG Display',
      customerPO: 'LG-2024-0008',
      productName: 'Connector Type B',
      productCode: 'CON-B-002',
      quantity: 1000,
      unit: 'pcs',
      dueDate: '2024-01-20',
      priority: 'medium',
      status: 'pending',
      bomId: 'BOM-002',
      notes: 'Đóng gói theo yêu cầu đặc biệt',
      approvalStatus: 'pending',
      createdAt: '2024-01-02T09:00:00Z',
      updatedAt: '2024-01-02T09:00:00Z',
      createdBy: 'admin'
    },
    {
      id: '3',
      poNumber: 'PO-2024-003',
      customerName: 'Intel Vietnam',
      customerPO: 'INTEL-2024-0012',
      productName: 'Heat Sink Model C',
      productCode: 'HS-C-003',
      quantity: 250,
      unit: 'pcs',
      dueDate: '2024-01-25',
      priority: 'urgent',
      status: 'completed',
      bomId: 'BOM-003',
      approvalStatus: 'approved',
      approvedBy: 'Trần Thị B',
      approvedAt: '2024-01-03T14:00:00Z',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-10T16:00:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
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

  const handleEdit = (record: ProductionOrder) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      dueDate: dayjs(record.dueDate)
    });
    setModalVisible(true);
  };

  const handleDelete = async (record: ProductionOrder) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(data.filter(item => item.id !== record.id));
      message.success('Đã xóa lệnh sản xuất');
    } catch (error) {
      message.error('Không thể xóa lệnh sản xuất');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const formData = {
        ...values,
        dueDate: values.dueDate.format('YYYY-MM-DD'),
        approvalStatus: 'pending' as ApprovalStatus,
        status: 'pending' as const,
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
        message.success('Đã cập nhật lệnh sản xuất');
      } else {
        // Create new record
        const newRecord: ProductionOrder = {
          id: Date.now().toString(),
          poNumber: `PO-2024-${String(data.length + 1).padStart(3, '0')}`,
          ...formData
        };
        setData([newRecord, ...data]);
        message.success('Đã tạo lệnh sản xuất mới');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (record: ProductionOrder, comments?: string) => {
    try {
      const updatedData = data.map(item => 
        item.id === record.id 
          ? { 
              ...item, 
              approvalStatus: 'approved' as ApprovalStatus,
              approvedBy: 'current_user',
              approvedAt: new Date().toISOString()
            }
          : item
      );
      setData(updatedData);
    } catch (error) {
      throw error;
    }
  };

  const handleReject = async (record: ProductionOrder, comments?: string) => {
    try {
      const updatedData = data.map(item => 
        item.id === record.id 
          ? { 
              ...item, 
              approvalStatus: 'rejected' as ApprovalStatus
            }
          : item
      );
      setData(updatedData);
    } catch (error) {
      throw error;
    }
  };

  const handleSearch = (values: any) => {
    // Implement search logic
    console.log('Search values:', values);
  };

  const columns: ColumnsType<ProductionOrder> = [
    {
      title: 'Số PO',
      dataIndex: 'poNumber',
      key: 'poNumber',
      width: 120,
      fixed: 'left',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 120,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'right',
      render: (value, record) => `${value} ${record.unit}`,
    },
    {
      title: 'Hạn chót',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 120,
      render: (value) => dayjs(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (value) => <StatusTag status={value} type="general" />,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value) => <StatusTag status={value} type="production" />,
    },
    {
      title: 'Phê duyệt',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 100,
      render: (value) => <StatusTag status={value} type="approval" />,
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
      name: 'poNumber',
      label: 'Số PO',
      type: 'text' as const,
      span: 6,
    },
    {
      name: 'customerName',
      label: 'Khách hàng',
      type: 'text' as const,
      span: 6,
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select' as const,
      options: [
        { value: 'pending', label: 'Chờ xử lý' },
        { value: 'in_progress', label: 'Đang xử lý' },
        { value: 'completed', label: 'Hoàn thành' },
        { value: 'cancelled', label: 'Đã hủy' },
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
    { key: 'poNumber', title: 'Số PO' },
    { key: 'customerName', title: 'Khách hàng' },
    { key: 'productName', title: 'Sản phẩm' },
    { key: 'productCode', title: 'Mã sản phẩm' },
    { key: 'quantity', title: 'Số lượng' },
    { key: 'unit', title: 'Đơn vị' },
    { key: 'dueDate', title: 'Hạn chót' },
    { key: 'priority', title: 'Độ ưu tiên' },
    { key: 'status', title: 'Trạng thái' },
    { key: 'approvalStatus', title: 'Phê duyệt' },
  ];

  return (
    <div>
      <FormCard
        title="Quản lý Lệnh sản xuất"
        subtitle="Tạo và quản lý các lệnh sản xuất (F-PN-01-02)"
        extra={
          <Space>
            <ExportButton
              data={data}
              columns={exportColumns}
              filename="production-orders"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Tạo lệnh sản xuất
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
          editDisabled={(record) => record.approvalStatus === 'approved'}
          deleteDisabled={(record) => record.status === 'completed'}
          customActions={(record) => (
            <Space size="small">
              <PrintButton
                data={record}
                templateType="production_order"
                size="small"
              />
              {record.approvalStatus === 'pending' && (
                <ApprovalButton
                  currentStatus={record.approvalStatus}
                  onApprove={(comments) => handleApprove(record, comments)}
                  onReject={(comments) => handleReject(record, comments)}
                  size="small"
                />
              )}
            </Space>
          )}
          pagination={{
            total: data.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} lệnh sản xuất`,
          }}
        />
      </FormCard>

      {/* Create/Edit Modal */}
      <Modal
        title={editingRecord ? 'Chỉnh sửa lệnh sản xuất' : 'Tạo lệnh sản xuất mới'}
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
            priority: 'medium',
            unit: 'pcs'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="customerName"
              label="Khách hàng"
              rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
            >
              <Input placeholder="Nhập tên khách hàng" />
            </Form.Item>

            <Form.Item
              name="customerPO"
              label="PO khách hàng"
            >
              <Input placeholder="Nhập số PO của khách hàng" />
            </Form.Item>

            <Form.Item
              name="productName"
              label="Tên sản phẩm"
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>

            <Form.Item
              name="productCode"
              label="Mã sản phẩm"
              rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm' }]}
            >
              <Input placeholder="Nhập mã sản phẩm" />
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Số lượng"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
            >
              <InputNumber
                placeholder="Nhập số lượng"
                style={{ width: '100%' }}
                min={1}
              />
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
                <Option value="set">set</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="dueDate"
              label="Hạn chót"
              rules={[{ required: true, message: 'Vui lòng chọn hạn chót' }]}
            >
              <DatePicker
                placeholder="Chọn hạn chót"
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
              />
            </Form.Item>

            <Form.Item
              name="priority"
              label="Độ ưu tiên"
              rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên' }]}
            >
              <Select placeholder="Chọn độ ưu tiên">
                <Option value="low">Thấp</Option>
                <Option value="medium">Trung bình</Option>
                <Option value="high">Cao</Option>
                <Option value="urgent">Khẩn cấp</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="bomId"
            label="BOM ID"
          >
            <Select placeholder="Chọn BOM" allowClear>
              <Option value="BOM-001">BOM-001 - PCB Board A1</Option>
              <Option value="BOM-002">BOM-002 - Connector Type B</Option>
              <Option value="BOM-003">BOM-003 - Heat Sink Model C</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <TextArea
              rows={3}
              placeholder="Nhập ghi chú (không bắt buộc)"
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

export default ProductionOrderPage;