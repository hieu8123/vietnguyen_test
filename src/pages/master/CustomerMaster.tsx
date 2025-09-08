import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, Form, Input, Select, InputNumber, message, Descriptions, Splitter } from 'antd';
import { PlusOutlined, CloseOutlined, FilterOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { FormCard, DataTable, StatusTag, ExportButton } from '../../shared/components';
import type { Customer } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

const CustomerMasterPage: React.FC = () => {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Customer | null>(null);
  const [form] = Form.useForm();
  const [selectedRecord, setSelectedRecord] = useState<Customer | null>(null);
  // Filter states
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [filteredData, setFilteredData] = useState<Customer[]>([]);
  const [appliedSearchText, setAppliedSearchText] = useState<string>('');
  const [appliedStatusFilter, setAppliedStatusFilter] = useState<string | undefined>(undefined);
  const [isAnimating, setIsAnimating] = useState(false);

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

  // Filter effect - update filtered data when applied search criteria change
  useEffect(() => {
    let filtered = [...data];
    
    // Text search across multiple fields
    if (appliedSearchText.trim()) {
      const searchLower = appliedSearchText.toLowerCase().trim();
      filtered = filtered.filter(item => 
        item.customerName?.toLowerCase().includes(searchLower) ||
        item.customerCode?.toLowerCase().includes(searchLower) ||
        item.contactPerson?.toLowerCase().includes(searchLower) ||
        item.phone?.toLowerCase().includes(searchLower) ||
        item.email?.toLowerCase().includes(searchLower) ||
        item.taxCode?.toLowerCase().includes(searchLower)
      );
    }
    
    // Status filter
    if (appliedStatusFilter) {
      filtered = filtered.filter(item => item.status === appliedStatusFilter);
    }
    
    setFilteredData(filtered);
  }, [data, appliedSearchText, appliedStatusFilter]);

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

  const openDetail = (record: Customer) => {
    setIsAnimating(true);
    setSelectedRecord(record);
    window.setTimeout(() => setIsAnimating(false), 300);
  };

  const closeDetail = () => {
    setIsAnimating(true);
    setSelectedRecord(null);
    window.setTimeout(() => setIsAnimating(false), 300);
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

  const handleSearch = () => {
    setAppliedSearchText(searchText);
    setAppliedStatusFilter(statusFilter);
    // Auto close detail panel when searching
    setSelectedRecord(null);
  };

  const handleResetSearch = () => {
    setSearchText('');
    setStatusFilter(undefined);
    setAppliedSearchText('');
    setAppliedStatusFilter(undefined);
  };

  const getFilterCount = () => {
    let count = 0;
    if (appliedSearchText.trim()) count++;
    if (appliedStatusFilter) count++;
    return count;
  };

  const columns: ColumnsType<Customer> = [
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 220,
      fixed: 'left',
    },
    {
      title: 'Người liên hệ',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 160,
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 220,
    },
    {
      title: 'Mã số thuế',
      dataIndex: 'taxCode',
      key: 'taxCode',
      width: 140,
    },
  ];

  // Removed old SearchForm field definitions in favor of compact search bar

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
              data={filteredData}
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
        {/* Filter Section */}
        <div style={{ marginBottom: 16, padding: '16px', backgroundColor: '#fafafa', borderRadius: '6px', border: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <Input
              placeholder="Tìm kiếm theo tên, mã KH, người liên hệ, SĐT, email..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              style={{ flex: 1, minWidth: 300, maxWidth: 400 }}
              prefix={<FilterOutlined style={{ color: '#bfbfbf' }} />}
              allowClear
            />
            
            <Select
              placeholder="Trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 140 }}
              allowClear
            >
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>

            <Space>
              <Button 
                type="primary"
                onClick={handleSearch}
                disabled={!searchText && !statusFilter}
              >
                Tìm kiếm
              </Button>
              
              <Button 
                onClick={handleResetSearch}
                disabled={!appliedSearchText && !appliedStatusFilter}
              >
                Xóa bộ lọc
              </Button>
              
              {getFilterCount() > 0 && (
                <span style={{ 
                  fontSize: '12px', 
                  color: '#666',
                  backgroundColor: '#e6f7ff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid #91d5ff'
                }}>
                  {getFilterCount()} bộ lọc | {filteredData.length} kết quả
                </span>
              )}
            </Space>
          </div>
        </div>

        <Splitter className={`customer-splitter ${isAnimating ? 'animating' : ''}`} style={{ height: 560 }}>
          <Splitter.Panel defaultSize="65%">
            <DataTable
              columns={columns}
              dataSource={filteredData}
              loading={loading}
              rowKey="id"
              scroll={{ y: 500 }}
              rowClassName={(record) => 
                selectedRecord && selectedRecord.id === record.id ? 'selected-row' : ''
              }
              onRow={(record) => ({
                onClick: () => openDetail(record as Customer),
                style: { cursor: 'pointer' }
              })}
              onEdit={handleEdit}
              onDelete={handleDelete}
              pagination={{
                total: filteredData.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Tổng ${total} khách hàng`,
              }}
            />
          </Splitter.Panel>
          <Splitter.Panel size={selectedRecord ? 420 : 0} min={0}>
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
                opacity: selectedRecord ? 1 : 0,
                transform: selectedRecord ? 'translateX(0)' : 'translateX(16px)',
                transition: 'opacity 240ms ease, transform 240ms ease',
                pointerEvents: selectedRecord ? 'auto' : 'none'
              }}
              className="detail-panel"
            >
              <FormCard
                title="Chi tiết khách hàng"
                subtitle={selectedRecord?.customerName || ''}
                extra={
                  <Button
                    type="text"
                    aria-label="Đóng"
                    icon={<CloseOutlined />}
                    onClick={closeDetail}
                  />
                }
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Descriptions column={1} size="small" bordered>
                    <Descriptions.Item label="Mã KH">{selectedRecord?.customerCode}</Descriptions.Item>
                    <Descriptions.Item label="Tên khách hàng">{selectedRecord?.customerName}</Descriptions.Item>
                    <Descriptions.Item label="Người liên hệ">{selectedRecord?.contactPerson}</Descriptions.Item>
                    <Descriptions.Item label="SĐT">{selectedRecord?.phone}</Descriptions.Item>
                    <Descriptions.Item label="Email">{selectedRecord?.email}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">{selectedRecord?.address}</Descriptions.Item>
                    <Descriptions.Item label="Mã số thuế">{selectedRecord?.taxCode}</Descriptions.Item>
                    <Descriptions.Item label="Điều kiện thanh toán">{selectedRecord?.paymentTerms}</Descriptions.Item>
                    <Descriptions.Item label="Hạn mức tín dụng">{selectedRecord?.creditLimit?.toLocaleString()} VND</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                      {selectedRecord && (<StatusTag status={selectedRecord.status} type="general" />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">{selectedRecord && dayjs(selectedRecord.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                    <Descriptions.Item label="Cập nhật">{selectedRecord && dayjs(selectedRecord.updatedAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                    <Descriptions.Item label="Ghi chú">{selectedRecord?.notes}</Descriptions.Item>
                  </Descriptions>
                </Space>
              </FormCard>
            </div>
          </Splitter.Panel>
        </Splitter>
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