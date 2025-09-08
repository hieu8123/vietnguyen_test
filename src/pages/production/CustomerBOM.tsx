import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, Form, Input, Select, InputNumber, message, Table } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { FormCard, DataTable, StatusTag, ApprovalButton, SearchForm, ExportButton, PrintButton } from '../../shared/components';
import type { BillOfMaterials, BOMItem, ApprovalStatus } from '../../types';
import { useMaterials, useSuppliers } from '../../hooks/useMasterData';

const { Option } = Select;
const { TextArea } = Input;

const CustomerBOMPage: React.FC = () => {
  const [data, setData] = useState<BillOfMaterials[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BillOfMaterials | null>(null);
  const [form] = Form.useForm();
  const [materials, setMaterials] = useState<BOMItem[]>([]);
  
  // Master data hooks
  const { materials: masterMaterials } = useMaterials();
  const { suppliers } = useSuppliers();

  // Mock data
  const mockData: BillOfMaterials[] = [
    {
      id: '1',
      bomCode: 'BOM-2024-001',
      productName: 'PCB Board A1',
      productCode: 'PCB-A1-001',
      version: 'V1.0',
      status: 'active',
      materials: [
        {
          id: '1',
          materialCode: 'AL-6061-100',
          materialName: 'Aluminum 6061',
          specification: '100x50x10mm',
          quantity: 1,
          unit: 'pcs',
          unitCost: 50000,
          totalCost: 50000,
          supplier: 'ABC Materials',
          notes: 'Chất lượng cao'
        },
        {
          id: '2',
          materialCode: 'SCR-M3-10',
          materialName: 'Screw M3x10',
          specification: 'Stainless Steel 304',
          quantity: 4,
          unit: 'pcs',
          unitCost: 500,
          totalCost: 2000,
          supplier: 'XYZ Hardware'
        }
      ],
      totalCost: 52000,
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
      bomCode: 'BOM-2024-002',
      productName: 'Connector Type B',
      productCode: 'CON-B-002',
      version: 'V2.1',
      status: 'draft',
      materials: [
        {
          id: '3',
          materialCode: 'SS-304-200',
          materialName: 'Stainless Steel 304',
          specification: '200x100x5mm',
          quantity: 1,
          unit: 'pcs',
          unitCost: 75000,
          totalCost: 75000,
          supplier: 'DEF Steel'
        }
      ],
      totalCost: 75000,
      approvalStatus: 'pending',
      createdAt: '2024-01-02T09:00:00Z',
      updatedAt: '2024-01-02T09:00:00Z',
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
    setMaterials([]);
    setModalVisible(true);
  };

  const handleEdit = (record: BillOfMaterials) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setMaterials(record.materials);
    setModalVisible(true);
  };

  const handleDelete = async (record: BillOfMaterials) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(data.filter(item => item.id !== record.id));
      message.success('Đã xóa BOM');
    } catch (error) {
      message.error('Không thể xóa BOM');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const totalCost = materials.reduce((sum, item) => sum + (item.totalCost || 0), 0);
      
      const formData = {
        ...values,
        materials,
        totalCost,
        approvalStatus: 'pending' as ApprovalStatus,
        status: 'draft' as const,
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
        message.success('Đã cập nhật BOM');
      } else {
        // Create new record
        const newRecord: BillOfMaterials = {
          id: Date.now().toString(),
          bomCode: `BOM-2024-${String(data.length + 1).padStart(3, '0')}`,
          ...formData
        };
        setData([newRecord, ...data]);
        message.success('Đã tạo BOM mới');
      }

      setModalVisible(false);
      form.resetFields();
      setMaterials([]);
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (record: BillOfMaterials, comments?: string) => {
    try {
      const updatedData = data.map(item => 
        item.id === record.id 
          ? { 
              ...item, 
              approvalStatus: 'approved' as ApprovalStatus,
              status: 'active' as const,
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

  const handleReject = async (record: BillOfMaterials, comments?: string) => {
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

  const addMaterial = () => {
    const newMaterial: BOMItem = {
      id: Date.now().toString(),
      materialCode: '',
      materialName: '',
      specification: '',
      quantity: 1,
      unit: 'pcs',
      unitCost: 0,
      totalCost: 0,
      supplier: ''
    };
    setMaterials([...materials, newMaterial]);
  };

  const updateMaterial = (index: number, field: keyof BOMItem, value: any) => {
    const updatedMaterials = materials.map((material, i) => {
      if (i === index) {
        const updated = { ...material, [field]: value };
        if (field === 'quantity' || field === 'unitCost') {
          updated.totalCost = (updated.quantity || 0) * (updated.unitCost || 0);
        }
        return updated;
      }
      return material;
    });
    setMaterials(updatedMaterials);
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const columns: ColumnsType<BillOfMaterials> = [
    {
      title: 'Mã BOM',
      dataIndex: 'bomCode',
      key: 'bomCode',
      width: 120,
      fixed: 'left',
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
      title: 'Phiên bản',
      dataIndex: 'version',
      key: 'version',
      width: 80,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value) => <StatusTag status={value} type="general" />,
    },
    {
      title: 'Số NVL',
      key: 'materialCount',
      width: 80,
      align: 'center',
      render: (_, record) => record.materials.length,
    },
    {
      title: 'Tổng giá',
      dataIndex: 'totalCost',
      key: 'totalCost',
      width: 120,
      align: 'right',
      render: (value) => value ? `${value.toLocaleString()} VND` : '0 VND',
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

  const materialColumns: ColumnsType<BOMItem> = [
    {
      title: 'Mã NVL',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 120,
      render: (value, record, index) => (
        <Select
          value={value}
          onChange={(val) => {
            updateMaterial(index, 'materialCode', val);
            // Tự động điền thông tin NVL
            const selectedMaterial = masterMaterials.find(m => m.materialCode === val);
            if (selectedMaterial) {
              updateMaterial(index, 'materialName', selectedMaterial.materialName);
              updateMaterial(index, 'specification', selectedMaterial.specification || '');
              updateMaterial(index, 'unit', selectedMaterial.unit);
              updateMaterial(index, 'unitCost', selectedMaterial.standardCost || 0);
              updateMaterial(index, 'supplier', selectedMaterial.supplier || '');
            }
          }}
          placeholder="Chọn NVL"
          size="small"
          style={{ width: '100%' }}
          showSearch
          optionFilterProp="children"
        >
          {masterMaterials.map(material => (
            <Option key={material.id} value={material.materialCode}>
              {material.materialCode}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Tên NVL',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 150,
      render: (value, record, index) => (
        <Input
          value={value}
          onChange={(e) => updateMaterial(index, 'materialName', e.target.value)}
          placeholder="Sẽ được tự động điền"
          size="small"
          disabled
        />
      ),
    },
    {
      title: 'Thông số',
      dataIndex: 'specification',
      key: 'specification',
      width: 120,
      render: (value, record, index) => (
        <Input
          value={value}
          onChange={(e) => updateMaterial(index, 'specification', e.target.value)}
          placeholder="Nhập thông số"
          size="small"
        />
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (value, record, index) => (
        <InputNumber
          value={value}
          onChange={(val) => updateMaterial(index, 'quantity', val || 0)}
          min={0}
          size="small"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
      render: (value, record, index) => (
        <Select
          value={value}
          onChange={(val) => updateMaterial(index, 'unit', val)}
          size="small"
          style={{ width: '100%' }}
        >
          <Option value="pcs">pcs</Option>
          <Option value="kg">kg</Option>
          <Option value="m">m</Option>
          <Option value="set">set</Option>
        </Select>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unitCost',
      key: 'unitCost',
      width: 100,
      render: (value, record, index) => (
        <InputNumber
          value={value}
          onChange={(val) => updateMaterial(index, 'unitCost', val || 0)}
          min={0}
          size="small"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'totalCost',
      key: 'totalCost',
      width: 100,
      align: 'right',
      render: (value) => `${(value || 0).toLocaleString()}`,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 80,
      render: (_, record, index) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          size="small"
          onClick={() => removeMaterial(index)}
        />
      ),
    },
  ];

  const searchFields = [
    {
      name: 'bomCode',
      label: 'Mã BOM',
      type: 'text' as const,
      span: 6,
    },
    {
      name: 'productName',
      label: 'Sản phẩm',
      type: 'text' as const,
      span: 6,
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select' as const,
      options: [
        { value: 'draft', label: 'Nháp' },
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
    { key: 'bomCode', title: 'Mã BOM' },
    { key: 'productName', title: 'Sản phẩm' },
    { key: 'productCode', title: 'Mã sản phẩm' },
    { key: 'version', title: 'Phiên bản' },
    { key: 'status', title: 'Trạng thái' },
    { key: 'totalCost', title: 'Tổng giá' },
    { key: 'approvalStatus', title: 'Phê duyệt' },
  ];

  return (
    <div>
      <FormCard
        title="BOM Khách hàng"
        subtitle="Quản lý Bill of Materials (F-PR-01-01)"
        extra={
          <Space>
            <ExportButton
              data={data}
              columns={exportColumns}
              filename="customer-bom"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Tạo BOM mới
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
          scroll={{ x: 1200 }}
          onEdit={handleEdit}
          onDelete={handleDelete}
          editDisabled={(record) => record.approvalStatus === 'approved'}
          deleteDisabled={(record) => record.status === 'active'}
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
            showTotal: (total) => `Tổng ${total} BOM`,
          }}
        />
      </FormCard>

      {/* Create/Edit Modal */}
      <Modal
        title={editingRecord ? 'Chỉnh sửa BOM' : 'Tạo BOM mới'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setMaterials([]);
        }}
        footer={null}
        width={1200}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            version: 'V1.0',
            status: 'draft'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
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
              name="version"
              label="Phiên bản"
              rules={[{ required: true, message: 'Vui lòng nhập phiên bản' }]}
            >
              <Input placeholder="V1.0" />
            </Form.Item>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h4>Danh sách nguyên vật liệu</h4>
              <Button type="dashed" onClick={addMaterial} icon={<PlusOutlined />}>
                Thêm NVL
              </Button>
            </div>

            <Table
              columns={materialColumns}
              dataSource={materials}
              pagination={false}
              size="small"
              scroll={{ x: 800 }}
              rowKey="id"
            />

            <div style={{ textAlign: 'right', marginTop: 16, fontSize: 16, fontWeight: 'bold' }}>
              Tổng cộng: {materials.reduce((sum, item) => sum + (item.totalCost || 0), 0).toLocaleString()} VND
            </div>
          </div>

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

export default CustomerBOMPage;