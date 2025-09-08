import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, Form, Input, Select, Upload, message, Tabs, Table } from 'antd';
import { PlusOutlined, UploadOutlined, FileTextOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';

import { FormCard, DataTable, StatusTag, ApprovalButton, SearchForm, ExportButton, PrintButton } from '../../shared/components';
import type { Drawing, DrawingVersion, ApprovalStatus } from '../../types';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const DrawingMasterPage: React.FC = () => {
  const [data, setData] = useState<Drawing[]>([]);
  const [versions, setVersions] = useState<DrawingVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [versionModalVisible, setVersionModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Drawing | null>(null);
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);
  const [form] = Form.useForm();
  const [versionForm] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Mock data for drawings
  const mockData: Drawing[] = [
    {
      id: '1',
      drawingCode: 'DWG-PCB-A1-001',
      drawingName: 'PCB Board A1 Layout',
      productCode: 'PCB-A1-001',
      productName: 'PCB Board A1',
      category: 'product',
      version: 'V1.2',
      revision: 'REV-C',
      drawingFile: 'PCB-A1-V1.2-REVC.pdf',
      fileSize: 2048000,
      fileType: 'pdf',
      description: 'Bản vẽ layout PCB cho sản phẩm A1',
      status: 'active',
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
      drawingCode: 'DWG-CON-B-002',
      drawingName: 'Connector Type B Detail',
      productCode: 'CON-B-002',
      productName: 'Connector Type B',
      category: 'detail',
      version: 'V2.0',
      revision: 'REV-A',
      drawingFile: 'CON-B-V2.0-REVA.dwg',
      fileSize: 1536000,
      fileType: 'dwg',
      description: 'Bản vẽ chi tiết connector type B',
      status: 'active',
      approvalStatus: 'pending',
      createdAt: '2024-01-02T09:00:00Z',
      updatedAt: '2024-01-02T09:00:00Z',
      createdBy: 'admin'
    },
    {
      id: '3',
      drawingCode: 'DWG-HS-C-003',
      drawingName: 'Heat Sink Assembly',
      productCode: 'HS-C-003',
      productName: 'Heat Sink Model C',
      category: 'assembly',
      version: 'V1.0',
      revision: 'REV-B',
      drawingFile: 'HS-C-V1.0-REVB.pdf',
      fileSize: 3072000,
      fileType: 'pdf',
      description: 'Bản vẽ lắp ráp heat sink model C',
      status: 'active',
      approvalStatus: 'approved',
      approvedBy: 'Trần Thị B',
      approvedAt: '2024-01-03T14:00:00Z',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-10T16:00:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    }
  ];

  // Mock data for drawing versions
  const mockVersions: DrawingVersion[] = [
    {
      id: '1',
      drawingId: '1',
      version: 'V1.2',
      revision: 'REV-C',
      versionName: 'Final Production Version',
      changeDescription: 'Cập nhật kích thước pad và via',
      drawingFile: 'PCB-A1-V1.2-REVC.pdf',
      fileSize: 2048000,
      fileType: 'pdf',
      isActive: true,
      approvalStatus: 'approved',
      approvedBy: 'Nguyễn Văn A',
      approvedAt: '2024-01-05T10:00:00Z',
      createdAt: '2024-01-05T08:00:00Z',
      updatedAt: '2024-01-05T10:00:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      id: '2',
      drawingId: '1',
      version: 'V1.1',
      revision: 'REV-B',
      versionName: 'Prototype Version',
      changeDescription: 'Điều chỉnh routing và placement',
      drawingFile: 'PCB-A1-V1.1-REVB.pdf',
      fileSize: 1920000,
      fileType: 'pdf',
      isActive: false,
      approvalStatus: 'approved',
      approvedBy: 'Nguyễn Văn A',
      approvedAt: '2024-01-03T14:00:00Z',
      createdAt: '2024-01-03T08:00:00Z',
      updatedAt: '2024-01-03T14:00:00Z',
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
      setVersions(mockVersions);
    } catch (error) {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRecord(null);
    form.resetFields();
    setFileList([]);
    setModalVisible(true);
  };

  const handleEdit = (record: Drawing) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (record: Drawing) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(data.filter(item => item.id !== record.id));
      message.success('Đã xóa bản vẽ');
    } catch (error) {
      message.error('Không thể xóa bản vẽ');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const formData = {
        ...values,
        approvalStatus: 'pending' as ApprovalStatus,
        status: 'active' as const,
        drawingFile: fileList[0]?.name || '',
        fileSize: fileList[0]?.size || 0,
        fileType: fileList[0]?.name?.split('.').pop() || '',
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
        message.success('Đã cập nhật bản vẽ');
      } else {
        // Create new record
        const newRecord: Drawing = {
          id: Date.now().toString(),
          drawingCode: `DWG-${values.category?.toUpperCase()}-${String(data.length + 1).padStart(3, '0')}`,
          ...formData
        };
        setData([newRecord, ...data]);
        message.success('Đã tạo bản vẽ mới');
      }

      setModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (record: Drawing, comments?: string) => {
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

  const handleReject = async (record: Drawing, comments?: string) => {
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

  const handleViewVersions = (record: Drawing) => {
    setSelectedDrawing(record);
    setVersionModalVisible(true);
  };

  const handleCreateVersion = () => {
    if (!selectedDrawing) return;
    versionForm.resetFields();
    versionForm.setFieldsValue({
      drawingId: selectedDrawing.id,
      version: 'V1.0',
      revision: 'REV-A'
    });
    // Open version creation modal
  };

  const handleSearch = (values: any) => {
    // Implement search logic
    console.log('Search values:', values);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const columns: ColumnsType<Drawing> = [
    {
      title: 'Mã bản vẽ',
      dataIndex: 'drawingCode',
      key: 'drawingCode',
      width: 150,
      fixed: 'left',
    },
    {
      title: 'Tên bản vẽ',
      dataIndex: 'drawingName',
      key: 'drawingName',
      width: 200,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      width: 150,
      render: (value, record) => value ? `${value} (${record.productCode})` : '-',
    },
    {
      title: 'Loại',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (value) => {
        const categoryMap = {
          'product': 'Sản phẩm',
          'part': 'Bộ phận',
          'assembly': 'Lắp ráp',
          'detail': 'Chi tiết'
        };
        return categoryMap[value as keyof typeof categoryMap] || value;
      },
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      width: 100,
    },
    {
      title: 'Revision',
      dataIndex: 'revision',
      key: 'revision',
      width: 100,
    },
    {
      title: 'File',
      dataIndex: 'drawingFile',
      key: 'drawingFile',
      width: 180,
      render: (value, record) => value ? (
        <div>
          <FileTextOutlined /> {value}
          <br />
          <small style={{ color: '#666' }}>
            {record.fileType?.toUpperCase()} - {formatFileSize(record.fileSize)}
          </small>
        </div>
      ) : '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value) => <StatusTag status={value} type="general" />,
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

  const versionColumns: ColumnsType<DrawingVersion> = [
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      width: 100,
    },
    {
      title: 'Revision',
      dataIndex: 'revision',
      key: 'revision',
      width: 100,
    },
    {
      title: 'Tên phiên bản',
      dataIndex: 'versionName',
      key: 'versionName',
      width: 200,
    },
    {
      title: 'Mô tả thay đổi',
      dataIndex: 'changeDescription',
      key: 'changeDescription',
      width: 250,
    },
    {
      title: 'File',
      dataIndex: 'drawingFile',
      key: 'drawingFile',
      width: 180,
      render: (value, record) => (
        <div>
          <FileTextOutlined /> {value}
          <br />
          <small style={{ color: '#666' }}>
            {record.fileType?.toUpperCase()} - {formatFileSize(record.fileSize)}
          </small>
        </div>
      ),
    },
    {
      title: 'Đang sử dụng',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (value) => <StatusTag status={value ? 'active' : 'inactive'} type="general" />,
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
      name: 'drawingCode',
      label: 'Mã bản vẽ',
      type: 'text' as const,
      span: 6,
    },
    {
      name: 'drawingName',
      label: 'Tên bản vẽ',
      type: 'text' as const,
      span: 6,
    },
    {
      name: 'category',
      label: 'Loại',
      type: 'select' as const,
      options: [
        { value: 'product', label: 'Sản phẩm' },
        { value: 'part', label: 'Bộ phận' },
        { value: 'assembly', label: 'Lắp ráp' },
        { value: 'detail', label: 'Chi tiết' },
      ],
      span: 6,
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Đang sử dụng' },
        { value: 'inactive', label: 'Không sử dụng' },
        { value: 'obsolete', label: 'Lỗi thời' },
      ],
      span: 6,
    },
  ];

  const exportColumns = [
    { key: 'drawingCode', title: 'Mã bản vẽ' },
    { key: 'drawingName', title: 'Tên bản vẽ' },
    { key: 'productName', title: 'Sản phẩm' },
    { key: 'category', title: 'Loại' },
    { key: 'version', title: 'Version' },
    { key: 'revision', title: 'Revision' },
    { key: 'status', title: 'Trạng thái' },
    { key: 'approvalStatus', title: 'Phê duyệt' },
  ];

  return (
    <div>
      <FormCard
        title="Quản lý Bản vẽ"
        subtitle="Quản lý bản vẽ kỹ thuật và phiên bản"
        extra={
          <Space>
            <ExportButton
              data={data}
              columns={exportColumns}
              filename="drawings"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Tạo bản vẽ mới
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
          deleteDisabled={(record) => record.status === 'active'}
          customActions={(record) => (
            <Space size="small">
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleViewVersions(record)}
                title="Xem phiên bản"
              >
                Versions
              </Button>
              <PrintButton
                data={record}

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
            showTotal: (total) => `Tổng ${total} bản vẽ`,
          }}
        />
      </FormCard>

      {/* Create/Edit Modal */}
      <Modal
        title={editingRecord ? 'Chỉnh sửa bản vẽ' : 'Tạo bản vẽ mới'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setFileList([]);
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
            category: 'product',
            status: 'active',
            version: 'V1.0',
            revision: 'REV-A'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="drawingName"
              label="Tên bản vẽ"
              rules={[{ required: true, message: 'Vui lòng nhập tên bản vẽ' }]}
            >
              <Input placeholder="Nhập tên bản vẽ" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Loại bản vẽ"
              rules={[{ required: true, message: 'Vui lòng chọn loại bản vẽ' }]}
            >
              <Select placeholder="Chọn loại bản vẽ">
                <Option value="product">Sản phẩm</Option>
                <Option value="part">Bộ phận</Option>
                <Option value="assembly">Lắp ráp</Option>
                <Option value="detail">Chi tiết</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="productCode"
              label="Mã sản phẩm"
            >
              <Input placeholder="Nhập mã sản phẩm (nếu có)" />
            </Form.Item>

            <Form.Item
              name="productName"
              label="Tên sản phẩm"
            >
              <Input placeholder="Nhập tên sản phẩm (nếu có)" />
            </Form.Item>

            <Form.Item
              name="version"
              label="Version"
              rules={[{ required: true, message: 'Vui lòng nhập version' }]}
            >
              <Input placeholder="VD: V1.0, V2.1" />
            </Form.Item>

            <Form.Item
              name="revision"
              label="Revision"
              rules={[{ required: true, message: 'Vui lòng nhập revision' }]}
            >
              <Input placeholder="VD: REV-A, REV-B" />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="active">Đang sử dụng</Option>
                <Option value="inactive">Không sử dụng</Option>
                <Option value="obsolete">Lỗi thời</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="drawingFile"
              label="File bản vẽ"
            >
              <Upload
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                accept=".pdf,.dwg,.dxf,.step,.igs"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Chọn file</Button>
              </Upload>
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea
              rows={3}
              placeholder="Nhập mô tả bản vẽ"
            />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <TextArea
              rows={2}
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

      {/* Drawing Versions Modal */}
      <Modal
        title={`Phiên bản bản vẽ: ${selectedDrawing?.drawingName || ''}`}
        open={versionModalVisible}
        onCancel={() => setVersionModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setVersionModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateVersion}
          >
            Tạo phiên bản mới
          </Button>
        ]}
        width={1200}
        destroyOnClose
      >
        <Table
          columns={versionColumns}
          dataSource={versions.filter(v => v.drawingId === selectedDrawing?.id)}
          rowKey="id"
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
          }}
          scroll={{ x: 1000 }}
        />
      </Modal>
    </div>
  );
};

export default DrawingMasterPage;
