import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, Form, Input, Select, InputNumber, message, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { FormCard, DataTable, StatusTag, ApprovalButton, SearchForm, ExportButton, PrintButton } from '../../shared/components';
import type { QCInspection, DefectRecord, ApprovalStatus } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

const MaterialIncomingPage: React.FC = () => {
  const [data, setData] = useState<QCInspection[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<QCInspection | null>(null);
  const [form] = Form.useForm();
  const [defects, setDefects] = useState<DefectRecord[]>([]);

  // Mock data
  const mockData: QCInspection[] = [
    {
      id: '1',
      inspectionNumber: 'QC-INC-2024-001',
      type: 'incoming',
      materialId: 'AL-6061-001',
      inspectorId: 'QC-001',
      inspectorName: 'Nguyễn Văn QC',
      inspectionDate: '2024-01-10',
      sampleSize: 10,
      passedQuantity: 9,
      failedQuantity: 1,
      defectTypes: [
        {
          defectType: 'Surface',
          defectDescription: 'Vết xước nhỏ',
          quantity: 1,
          severity: 'minor',
          location: 'Góc phải'
        }
      ],
      overallResult: 'pass',
      notes: 'Chất lượng tổng thể tốt',
      approvalStatus: 'approved',
      approvedBy: 'Trưởng phòng QC',
      approvedAt: '2024-01-10T16:00:00Z',
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-10T16:00:00Z',
      createdBy: 'QC-001',
      updatedBy: 'QC-001'
    },
    {
      id: '2',
      inspectionNumber: 'QC-INC-2024-002',
      type: 'incoming',
      materialId: 'SS-304-002',
      inspectorId: 'QC-002',
      inspectorName: 'Trần Thị QC',
      inspectionDate: '2024-01-11',
      sampleSize: 20,
      passedQuantity: 18,
      failedQuantity: 2,
      defectTypes: [
        {
          defectType: 'Dimension',
          defectDescription: 'Sai kích thước',
          quantity: 2,
          severity: 'major',
          location: 'Chiều dài',
          measurement: 99.8,
          tolerance: '100±0.1'
        }
      ],
      overallResult: 'conditional',
      notes: 'Cần kiểm tra kỹ hơn',
      correctiveActions: 'Thông báo nhà cung cấp',
      approvalStatus: 'pending',
      createdAt: '2024-01-11T08:00:00Z',
      updatedAt: '2024-01-11T14:00:00Z',
      createdBy: 'QC-002',
      updatedBy: 'QC-002'
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
    setDefects([]);
    setModalVisible(true);
  };

  const handleEdit = (record: QCInspection) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      inspectionDate: dayjs(record.inspectionDate)
    });
    setDefects(record.defectTypes || []);
    setModalVisible(true);
  };

  const handleDelete = async (record: QCInspection) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(data.filter(item => item.id !== record.id));
      message.success('Đã xóa phiếu kiểm tra');
    } catch (error) {
      message.error('Không thể xóa phiếu kiểm tra');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const formData = {
        ...values,
        type: 'incoming' as const,
        inspectionDate: values.inspectionDate.format('YYYY-MM-DD'),
        defectTypes: defects,
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
        message.success('Đã cập nhật phiếu kiểm tra');
      } else {
        // Create new record
        const newRecord: QCInspection = {
          id: Date.now().toString(),
          inspectionNumber: `QC-INC-2024-${String(data.length + 1).padStart(3, '0')}`,
          ...formData
        };
        setData([newRecord, ...data]);
        message.success('Đã tạo phiếu kiểm tra mới');
      }

      setModalVisible(false);
      form.resetFields();
      setDefects([]);
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (record: QCInspection, comments?: string) => {
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

  const handleReject = async (record: QCInspection, comments?: string) => {
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

  const addDefect = () => {
    const newDefect: DefectRecord = {
      defectType: '',
      defectDescription: '',
      quantity: 1,
      severity: 'minor',
      location: ''
    };
    setDefects([...defects, newDefect]);
  };

  const updateDefect = (index: number, field: keyof DefectRecord, value: any) => {
    const updatedDefects = defects.map((defect, i) => 
      i === index ? { ...defect, [field]: value } : defect
    );
    setDefects(updatedDefects);
  };

  const removeDefect = (index: number) => {
    setDefects(defects.filter((_, i) => i !== index));
  };

  const columns: ColumnsType<QCInspection> = [
    {
      title: 'Số phiếu',
      dataIndex: 'inspectionNumber',
      key: 'inspectionNumber',
      width: 150,
      fixed: 'left',
    },
    {
      title: 'Mã NVL',
      dataIndex: 'materialId',
      key: 'materialId',
      width: 120,
    },
    {
      title: 'Người kiểm tra',
      dataIndex: 'inspectorName',
      key: 'inspectorName',
      width: 120,
    },
    {
      title: 'Ngày kiểm tra',
      dataIndex: 'inspectionDate',
      key: 'inspectionDate',
      width: 120,
      render: (value) => dayjs(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Mẫu kiểm tra',
      dataIndex: 'sampleSize',
      key: 'sampleSize',
      width: 100,
      align: 'center',
    },
    {
      title: 'Đạt',
      dataIndex: 'passedQuantity',
      key: 'passedQuantity',
      width: 80,
      align: 'center',
      render: (value) => <span style={{ color: '#52c41a' }}>{value}</span>,
    },
    {
      title: 'Không đạt',
      dataIndex: 'failedQuantity',
      key: 'failedQuantity',
      width: 100,
      align: 'center',
      render: (value) => <span style={{ color: value > 0 ? '#ff4d4f' : '#52c41a' }}>{value}</span>,
    },
    {
      title: 'Kết quả',
      dataIndex: 'overallResult',
      key: 'overallResult',
      width: 100,
      render: (value) => <StatusTag status={value} type="quality" />,
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
      name: 'inspectionNumber',
      label: 'Số phiếu',
      type: 'text' as const,
      span: 6,
    },
    {
      name: 'materialId',
      label: 'Mã NVL',
      type: 'text' as const,
      span: 6,
    },
    {
      name: 'overallResult',
      label: 'Kết quả',
      type: 'select' as const,
      options: [
        { value: 'pass', label: 'Đạt' },
        { value: 'fail', label: 'Không đạt' },
        { value: 'conditional', label: 'Có điều kiện' },
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
    { key: 'inspectionNumber', title: 'Số phiếu' },
    { key: 'materialId', title: 'Mã NVL' },
    { key: 'inspectorName', title: 'Người kiểm tra' },
    { key: 'inspectionDate', title: 'Ngày kiểm tra' },
    { key: 'sampleSize', title: 'Mẫu kiểm tra' },
    { key: 'passedQuantity', title: 'Đạt' },
    { key: 'failedQuantity', title: 'Không đạt' },
    { key: 'overallResult', title: 'Kết quả' },
    { key: 'approvalStatus', title: 'Phê duyệt' },
  ];

  return (
    <div>
      <FormCard
        title="Kiểm tra NVL đầu vào"
        subtitle="Material Incoming Inspection Sheet (F-QC-15-02)"
        extra={
          <Space>
            <ExportButton
              data={data}
              columns={exportColumns}
              filename="material-incoming-inspection"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Tạo phiếu kiểm tra
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
          scroll={{ x: 1400 }}
          onEdit={handleEdit}
          onDelete={handleDelete}
          editDisabled={(record) => record.approvalStatus === 'approved'}
          customActions={(record) => (
            <Space size="small">
              <PrintButton
                data={record}
                templateType="qc_inspection"
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
            showTotal: (total) => `Tổng ${total} phiếu kiểm tra`,
          }}
        />
      </FormCard>

      {/* Create/Edit Modal */}
      <Modal
        title={editingRecord ? 'Chỉnh sửa phiếu kiểm tra' : 'Tạo phiếu kiểm tra mới'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setDefects([]);
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
            overallResult: 'pass'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item
              name="materialId"
              label="Mã nguyên vật liệu"
              rules={[{ required: true, message: 'Vui lòng nhập mã NVL' }]}
            >
              <Input placeholder="Nhập mã NVL" />
            </Form.Item>

            <Form.Item
              name="inspectorName"
              label="Người kiểm tra"
              rules={[{ required: true, message: 'Vui lòng nhập tên người kiểm tra' }]}
            >
              <Input placeholder="Nhập tên người kiểm tra" />
            </Form.Item>

            <Form.Item
              name="inspectionDate"
              label="Ngày kiểm tra"
              rules={[{ required: true, message: 'Vui lòng chọn ngày kiểm tra' }]}
            >
              <Input placeholder="Chọn ngày kiểm tra" />
            </Form.Item>

            <Form.Item
              name="sampleSize"
              label="Kích thước mẫu"
              rules={[{ required: true, message: 'Vui lòng nhập kích thước mẫu' }]}
            >
              <InputNumber
                placeholder="Nhập kích thước mẫu"
                style={{ width: '100%' }}
                min={1}
              />
            </Form.Item>

            <Form.Item
              name="passedQuantity"
              label="Số lượng đạt"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng đạt' }]}
            >
              <InputNumber
                placeholder="Nhập số lượng đạt"
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="failedQuantity"
              label="Số lượng không đạt"
            >
              <InputNumber
                placeholder="Nhập số lượng không đạt"
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="overallResult"
            label="Kết quả tổng thể"
            rules={[{ required: true, message: 'Vui lòng chọn kết quả' }]}
          >
            <Radio.Group>
              <Radio value="pass">Đạt</Radio>
              <Radio value="fail">Không đạt</Radio>
              <Radio value="conditional">Có điều kiện</Radio>
            </Radio.Group>
          </Form.Item>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h4>Danh sách lỗi (nếu có)</h4>
              <Button type="dashed" onClick={addDefect} icon={<PlusOutlined />}>
                Thêm lỗi
              </Button>
            </div>

            {defects.map((defect, index) => (
              <div key={index} style={{ border: '1px solid #d9d9d9', padding: 16, marginBottom: 8, borderRadius: 6 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 100px auto', gap: 8, alignItems: 'center' }}>
                  <Input
                    placeholder="Loại lỗi"
                    value={defect.defectType}
                    onChange={(e) => updateDefect(index, 'defectType', e.target.value)}
                  />
                  <Input
                    placeholder="Mô tả lỗi"
                    value={defect.defectDescription}
                    onChange={(e) => updateDefect(index, 'defectDescription', e.target.value)}
                  />
                  <InputNumber
                    placeholder="SL"
                    value={defect.quantity}
                    onChange={(val) => updateDefect(index, 'quantity', val || 1)}
                    min={1}
                    style={{ width: '100%' }}
                  />
                  <Select
                    value={defect.severity}
                    onChange={(val) => updateDefect(index, 'severity', val)}
                    style={{ width: '100%' }}
                  >
                    <Option value="minor">Nhẹ</Option>
                    <Option value="major">Nặng</Option>
                    <Option value="critical">Nghiêm trọng</Option>
                  </Select>
                  <Button
                    type="text"
                    danger
                    onClick={() => removeDefect(index)}
                  >
                    Xóa
                  </Button>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Input
                    placeholder="Vị trí lỗi"
                    value={defect.location}
                    onChange={(e) => updateDefect(index, 'location', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <TextArea
              rows={3}
              placeholder="Nhập ghi chú về quá trình kiểm tra"
            />
          </Form.Item>

          <Form.Item
            name="correctiveActions"
            label="Hành động khắc phục"
          >
            <TextArea
              rows={2}
              placeholder="Nhập các hành động khắc phục (nếu có)"
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

export default MaterialIncomingPage;