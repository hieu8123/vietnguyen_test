import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, Form, Input, Select, InputNumber, message, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { FormCard, DataTable, StatusTag, ApprovalButton, SearchForm, ExportButton, PrintButton } from '../../shared/components';
import type { SetupSheet, ApprovalStatus } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

const SetupSheetPage: React.FC = () => {
  const [data, setData] = useState<SetupSheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SetupSheet | null>(null);
  const [form] = Form.useForm();

  // Mock data
  const mockData: SetupSheet[] = [
    {
      id: '1',
      setupNumber: 'SETUP-2024-001',
      poId: 'PO-2024-001',
      machineId: 'CNC-001',
      machineName: 'CNC Mill 01',
      productCode: 'PCB-A1-001',
      productName: 'PCB Board A1',
      setupDate: '2024-01-10',
      operatorId: 'OP-001',
      operatorName: 'Nguyễn Văn A',
      toolList: [],
      cycleTime: 300,
      setupTime: 45,
      programNumber: 'O1001',
      workOffset: {
        g54X: 0,
        g54Y: 0,
        g54Z: -50.5
      },
      toolOffsets: [],
      qualityChecks: [],
      approvalStatus: 'approved',
      approvedBy: 'Trưởng ca',
      approvedAt: '2024-01-10T08:30:00Z',
      createdAt: '2024-01-10T07:00:00Z',
      updatedAt: '2024-01-10T08:30:00Z',
      createdBy: 'OP-001',
      updatedBy: 'OP-001'
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

  const handleEdit = (record: SetupSheet) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      setupDate: dayjs(record.setupDate)
    });
    setModalVisible(true);
  };

  const handleDelete = async (record: SetupSheet) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(data.filter(item => item.id !== record.id));
      message.success('Đã xóa setup sheet');
    } catch (error) {
      message.error('Không thể xóa setup sheet');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const formData = {
        ...values,
        setupDate: values.setupDate.format('YYYY-MM-DD'),
        toolList: [],
        toolOffsets: [],
        qualityChecks: [],
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
        message.success('Đã cập nhật setup sheet');
      } else {
        const newRecord: SetupSheet = {
          id: Date.now().toString(),
          setupNumber: `SETUP-2024-${String(data.length + 1).padStart(3, '0')}`,
          ...formData
        };
        setData([newRecord, ...data]);
        message.success('Đã tạo setup sheet mới');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<SetupSheet> = [
    {
      title: 'Số Setup',
      dataIndex: 'setupNumber',
      key: 'setupNumber',
      width: 150,
    },
    {
      title: 'PO',
      dataIndex: 'poId',
      key: 'poId',
      width: 120,
    },
    {
      title: 'Máy',
      dataIndex: 'machineName',
      key: 'machineName',
      width: 120,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      width: 180,
    },
    {
      title: 'Người setup',
      dataIndex: 'operatorName',
      key: 'operatorName',
      width: 120,
    },
    {
      title: 'Ngày setup',
      dataIndex: 'setupDate',
      key: 'setupDate',
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

  return (
    <div>
      <FormCard
        title="Setup Sheet Report"
        subtitle="Báo cáo thiết lập máy và công cụ"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Tạo setup sheet
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
            showTotal: (total) => `Tổng ${total} setup sheet`,
          }}
        />
      </FormCard>

      <Modal
        title={editingRecord ? 'Chỉnh sửa setup sheet' : 'Tạo setup sheet mới'}
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
            setupDate: dayjs()
          }}
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
              name="machineId"
              label="Máy"
              rules={[{ required: true, message: 'Vui lòng chọn máy' }]}
            >
              <Select placeholder="Chọn máy">
                <Option value="CNC-001">CNC Mill 01</Option>
                <Option value="CNC-002">CNC Mill 02</Option>
                <Option value="LATHE-001">CNC Lathe 01</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="productName"
              label="Tên sản phẩm"
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>

            <Form.Item
              name="operatorName"
              label="Người setup"
              rules={[{ required: true, message: 'Vui lòng nhập tên người setup' }]}
            >
              <Input placeholder="Nhập tên người setup" />
            </Form.Item>

            <Form.Item
              name="setupTime"
              label="Thời gian setup (phút)"
              rules={[{ required: true, message: 'Vui lòng nhập thời gian setup' }]}
            >
              <InputNumber
                placeholder="Nhập thời gian setup"
                style={{ width: '100%' }}
                min={1}
              />
            </Form.Item>

            <Form.Item
              name="cycleTime"
              label="Cycle time (giây)"
              rules={[{ required: true, message: 'Vui lòng nhập cycle time' }]}
            >
              <InputNumber
                placeholder="Nhập cycle time"
                style={{ width: '100%' }}
                min={1}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="safetyNotes"
            label="Ghi chú an toàn"
          >
            <TextArea
              rows={2}
              placeholder="Nhập các ghi chú về an toàn"
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

export default SetupSheetPage;