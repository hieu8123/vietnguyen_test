import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, Form, Input, Select, InputNumber, message, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { FormCard, DataTable, StatusTag, ApprovalButton, SearchForm, ExportButton, PrintButton } from '../../shared/components';
import type { QCInspection, DefectRecord, ApprovalStatus } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

const FinalInspectionPage: React.FC = () => {
  const [data, setData] = useState<QCInspection[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<QCInspection | null>(null);
  const [form] = Form.useForm();

  // Mock data
  const mockData: QCInspection[] = [
    {
      id: '1',
      inspectionNumber: 'QC-FIN-2024-001',
      type: 'final',
      poId: 'PO-2024-001',
      productId: 'PCB-A1-001',
      inspectorId: 'QC-001',
      inspectorName: 'Nguyễn Văn QC',
      inspectionDate: '2024-01-10',
      sampleSize: 50,
      passedQuantity: 48,
      failedQuantity: 2,
      defectTypes: [
        {
          defectType: 'Cosmetic',
          defectDescription: 'Vết xước nhỏ trên bề mặt',
          quantity: 2,
          severity: 'minor',
          location: 'Góc sản phẩm'
        }
      ],
      overallResult: 'pass',
      notes: 'Chất lượng tốt, sẵn sàng xuất hàng',
      approvalStatus: 'approved',
      approvedBy: 'Trưởng phòng QC',
      approvedAt: '2024-01-10T17:00:00Z',
      createdAt: '2024-01-10T15:00:00Z',
      updatedAt: '2024-01-10T17:00:00Z',
      createdBy: 'QC-001',
      updatedBy: 'QC-001'
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

  const handleEdit = (record: QCInspection) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (record: QCInspection) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(data.filter(item => item.id !== record.id));
      message.success('Đã xóa phiếu kiểm tra cuối');
    } catch (error) {
      message.error('Không thể xóa phiếu kiểm tra cuối');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const formData = {
        ...values,
        type: 'final' as const,
        approvalStatus: 'pending' as ApprovalStatus,
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
        message.success('Đã cập nhật phiếu kiểm tra cuối');
      } else {
        const newRecord: QCInspection = {
          id: Date.now().toString(),
          inspectionNumber: `QC-FIN-2024-${String(data.length + 1).padStart(3, '0')}`,
          ...formData
        };
        setData([newRecord, ...data]);
        message.success('Đã tạo phiếu kiểm tra cuối mới');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<QCInspection> = [
    {
      title: 'Số phiếu',
      dataIndex: 'inspectionNumber',
      key: 'inspectionNumber',
      width: 150,
    },
    {
      title: 'PO',
      dataIndex: 'poId',
      key: 'poId',
      width: 120,
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productId',
      key: 'productId',
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

  return (
    <div>
      <FormCard
        title="Kiểm tra cuối cùng"
        subtitle="QC Final Inspection Sheet (F-QC-04-02)"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Tạo phiếu kiểm tra
          </Button>
        }
      >
        <DataTable
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={{
            total: data.length,
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} phiếu kiểm tra`,
          }}
        />
      </FormCard>

      <Modal
        title={editingRecord ? 'Chỉnh sửa phiếu kiểm tra cuối' : 'Tạo phiếu kiểm tra cuối mới'}
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
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="poId"
              label="PO"
              rules={[{ required: true, message: 'Vui lòng chọn PO' }]}
            >
              <Select placeholder="Chọn PO">
                <Option value="PO-2024-001">PO-2024-001</Option>
                <Option value="PO-2024-002">PO-2024-002</Option>
                <Option value="PO-2024-003">PO-2024-003</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="productId"
              label="Mã sản phẩm"
              rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm' }]}
            >
              <Input placeholder="Nhập mã sản phẩm" />
            </Form.Item>

            <Form.Item
              name="inspectorName"
              label="Người kiểm tra"
              rules={[{ required: true, message: 'Vui lòng nhập tên người kiểm tra' }]}
            >
              <Input placeholder="Nhập tên người kiểm tra" />
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

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <TextArea
              rows={3}
              placeholder="Nhập ghi chú về quá trình kiểm tra cuối"
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

export default FinalInspectionPage;