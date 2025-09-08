import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, Form, Input, Select, InputNumber, message, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { FormCard, DataTable, StatusTag, ApprovalButton, SearchForm, ExportButton, PrintButton } from '../../shared/components';
import type { MaterialTransaction, ApprovalStatus } from '../../types';
import { useMaterials, useSuppliers } from '../../hooks/useMasterData';

const { Option } = Select;
const { TextArea } = Input;

const MaterialImportPage: React.FC = () => {
  const [data, setData] = useState<MaterialTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MaterialTransaction | null>(null);
  const [form] = Form.useForm();
  
  // Master data hooks
  const { materials } = useMaterials();
  const { suppliers } = useSuppliers();

  // Mock data
  const mockData: MaterialTransaction[] = [
    {
      id: '1',
      transactionNumber: 'MI-2024-001',
      type: 'inbound',
      materialCode: 'AL-6061-100',
      materialName: 'Aluminum 6061 Sheet',
      quantity: 50,
      unit: 'pcs',
      unitPrice: 50000,
      totalValue: 2500000,
      supplierId: 'SUP-001',
      supplierName: 'ABC Materials Co.',
      lotNumber: 'LOT-AL-001',
      expiryDate: '2025-12-31',
      storageLocation: 'A-01-01',
      warehouseStaffId: 'WH-001',
      warehouseStaffName: 'Nguyễn Văn Kho',
      transactionDate: '2024-01-10',
      notes: 'Chất lượng tốt, đã qua kiểm tra QC',
      approvalStatus: 'approved',
      approvedBy: 'Trưởng kho',
      approvedAt: '2024-01-10T16:00:00Z',
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-10T16:00:00Z',
      createdBy: 'WH-001',
      updatedBy: 'WH-001'
    },
    {
      id: '2',
      transactionNumber: 'MI-2024-002',
      type: 'inbound',
      materialCode: 'SS-304-200',
      materialName: 'Stainless Steel 304',
      quantity: 30,
      unit: 'pcs',
      unitPrice: 75000,
      totalValue: 2250000,
      supplierId: 'SUP-002',
      supplierName: 'DEF Steel Ltd.',
      lotNumber: 'LOT-SS-002',
      storageLocation: 'B-02-01',
      warehouseStaffId: 'WH-002',
      warehouseStaffName: 'Trần Thị Kho',
      transactionDate: '2024-01-11',
      notes: 'Cần kiểm tra thêm về độ bền',
      approvalStatus: 'pending',
      createdAt: '2024-01-11T09:00:00Z',
      updatedAt: '2024-01-11T09:00:00Z',
      createdBy: 'WH-002'
    },
    {
      id: '3',
      transactionNumber: 'MI-2024-003',
      type: 'inbound',
      materialCode: 'CU-101-50',
      materialName: 'Copper C101',
      quantity: 20,
      unit: 'kg',
      unitPrice: 120000,
      totalValue: 2400000,
      supplierId: 'SUP-003',
      supplierName: 'GHI Metals Inc.',
      lotNumber: 'LOT-CU-003',
      storageLocation: 'C-01-02',
      warehouseStaffId: 'WH-001',
      warehouseStaffName: 'Nguyễn Văn Kho',
      transactionDate: '2024-01-12',
      approvalStatus: 'approved',
      approvedBy: 'Trưởng kho',
      approvedAt: '2024-01-12T15:00:00Z',
      createdAt: '2024-01-12T10:00:00Z',
      updatedAt: '2024-01-12T15:00:00Z',
      createdBy: 'WH-001',
      updatedBy: 'WH-001'
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

  const handleEdit = (record: MaterialTransaction) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      transactionDate: dayjs(record.transactionDate),
      expiryDate: record.expiryDate ? dayjs(record.expiryDate) : null
    });
    setModalVisible(true);
  };

  const handleDelete = async (record: MaterialTransaction) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(data.filter(item => item.id !== record.id));
      message.success('Đã xóa phiếu nhập kho');
    } catch (error) {
      message.error('Không thể xóa phiếu nhập kho');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const formData = {
        ...values,
        type: 'inbound' as const,
        transactionDate: values.transactionDate.format('YYYY-MM-DD'),
        expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : null,
        totalValue: (values.quantity || 0) * (values.unitPrice || 0),
        approvalStatus: 'pending' as ApprovalStatus,
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
        message.success('Đã cập nhật phiếu nhập kho');
      } else {
        // Create new record
        const newRecord: MaterialTransaction = {
          id: Date.now().toString(),
          transactionNumber: `MI-2024-${String(data.length + 1).padStart(3, '0')}`,
          ...formData
        };
        setData([newRecord, ...data]);
        message.success('Đã tạo phiếu nhập kho mới');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (record: MaterialTransaction, comments?: string) => {
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

  const handleReject = async (record: MaterialTransaction, comments?: string) => {
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

  const columns: ColumnsType<MaterialTransaction> = [
    {
      title: 'Số phiếu',
      dataIndex: 'transactionNumber',
      key: 'transactionNumber',
      width: 120,
      fixed: 'left',
    },
    {
      title: 'Mã NVL',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 120,
    },
    {
      title: 'Tên NVL',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 180,
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
      title: 'Đơn giá',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      align: 'right',
      render: (value) => value ? `${value.toLocaleString()} VND` : '0 VND',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'totalValue',
      key: 'totalValue',
      width: 140,
      align: 'right',
      render: (value) => value ? `${value.toLocaleString()} VND` : '0 VND',
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150,
    },
    {
      title: 'Số lô',
      dataIndex: 'lotNumber',
      key: 'lotNumber',
      width: 100,
    },
    {
      title: 'Vị trí',
      dataIndex: 'storageLocation',
      key: 'storageLocation',
      width: 100,
    },
    {
      title: 'Nhân viên kho',
      dataIndex: 'warehouseStaffName',
      key: 'warehouseStaffName',
      width: 120,
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      width: 120,
      render: (value) => dayjs(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Phê duyệt',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 100,
      render: (value) => <StatusTag status={value} type="approval" />,
    },
  ];

  const searchFields = [
    {
      name: 'transactionNumber',
      label: 'Số phiếu',
      type: 'text' as const,
      span: 6,
    },
    {
      name: 'materialCode',
      label: 'Mã NVL',
      type: 'text' as const,
      span: 6,
    },
    {
      name: 'supplierName',
      label: 'Nhà cung cấp',
      type: 'text' as const,
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
    { key: 'transactionNumber', title: 'Số phiếu' },
    { key: 'materialCode', title: 'Mã NVL' },
    { key: 'materialName', title: 'Tên NVL' },
    { key: 'quantity', title: 'Số lượng' },
    { key: 'unit', title: 'Đơn vị' },
    { key: 'unitPrice', title: 'Đơn giá' },
    { key: 'totalValue', title: 'Thành tiền' },
    { key: 'supplierName', title: 'Nhà cung cấp' },
    { key: 'lotNumber', title: 'Số lô' },
    { key: 'storageLocation', title: 'Vị trí' },
    { key: 'transactionDate', title: 'Ngày nhập' },
    { key: 'approvalStatus', title: 'Phê duyệt' },
  ];

  return (
    <div>
      <FormCard
        title="Nhập kho NVL"
        subtitle="Phiếu nhập kho nguyên vật liệu (F-WH-08-01)"
        extra={
          <Space>
            <ExportButton
              data={data}
              columns={exportColumns}
              filename="material-import"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Tạo phiếu nhập
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
          editDisabled={(record) => record.approvalStatus === 'approved'}
          customActions={(record) => (
            <Space size="small">
              <PrintButton
                data={record}
                templateType="delivery_note"
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
            showTotal: (total) => `Tổng ${total} phiếu nhập`,
          }}
        />
      </FormCard>

      {/* Create/Edit Modal */}
      <Modal
        title={editingRecord ? 'Chỉnh sửa phiếu nhập kho' : 'Tạo phiếu nhập kho mới'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={1000}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            transactionDate: dayjs(),
            unit: 'pcs'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item
              name="materialName"
              label="Nguyên vật liệu"
              rules={[{ required: true, message: 'Vui lòng chọn nguyên vật liệu' }]}
            >
              <Select 
                placeholder="Chọn nguyên vật liệu"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as string)?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={(value, option: any) => {
                  // Tự động điền thông tin NVL
                  const selectedMaterial = materials.find(m => m.materialName === value);
                  if (selectedMaterial) {
                    form.setFieldsValue({
                      materialCode: selectedMaterial.materialCode,
                      unit: selectedMaterial.unit,
                      unitPrice: selectedMaterial.standardCost,
                      storageLocation: selectedMaterial.storageLocation,
                      supplierName: selectedMaterial.supplier,
                      supplierId: selectedMaterial.supplierId
                    });
                  }
                }}
              >
                {materials.map(material => (
                  <Option key={material.id} value={material.materialName}>
                    {material.materialName} ({material.materialCode})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="materialCode"
              label="Mã nguyên vật liệu"
              rules={[{ required: true, message: 'Mã NVL sẽ được tự động điền' }]}
            >
              <Input placeholder="Sẽ được tự động điền" disabled />
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
                <Option value="m2">m²</Option>
                <Option value="set">set</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="unitPrice"
              label="Đơn giá (VND)"
            >
              <InputNumber
                placeholder="Nhập đơn giá"
                style={{ width: '100%' }}
                min={0}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              name="supplierId"
              label="Mã nhà cung cấp"
            >
              <Input placeholder="Nhập mã nhà cung cấp" />
            </Form.Item>

            <Form.Item
              name="supplierName"
              label="Nhà cung cấp"
              rules={[{ required: true, message: 'Nhà cung cấp sẽ được tự động điền' }]}
            >
              <Select 
                placeholder="Sẽ được tự động điền hoặc chọn khác"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as string)?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={(value, option: any) => {
                  const selectedSupplier = suppliers.find(s => s.supplierName === value);
                  if (selectedSupplier) {
                    form.setFieldsValue({
                      supplierId: selectedSupplier.supplierCode
                    });
                  }
                }}
              >
                {suppliers.map(supplier => (
                  <Option key={supplier.id} value={supplier.supplierName}>
                    {supplier.supplierName} ({supplier.supplierCode})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="lotNumber"
              label="Số lô"
            >
              <Input placeholder="Nhập số lô" />
            </Form.Item>

            <Form.Item
              name="storageLocation"
              label="Vị trí lưu trữ"
              rules={[{ required: true, message: 'Vui lòng nhập vị trí lưu trữ' }]}
            >
              <Input placeholder="A-01-01" />
            </Form.Item>

            <Form.Item
              name="warehouseStaffName"
              label="Nhân viên kho"
              rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên kho' }]}
            >
              <Input placeholder="Nhập tên nhân viên kho" />
            </Form.Item>

            <Form.Item
              name="transactionDate"
              label="Ngày nhập kho"
              rules={[{ required: true, message: 'Vui lòng chọn ngày nhập kho' }]}
            >
              <DatePicker
                placeholder="Chọn ngày nhập kho"
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
              />
            </Form.Item>

            <Form.Item
              name="expiryDate"
              label="Ngày hết hạn"
            >
              <DatePicker
                placeholder="Chọn ngày hết hạn"
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <TextArea
              rows={3}
              placeholder="Nhập ghi chú về phiếu nhập kho"
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

export default MaterialImportPage;