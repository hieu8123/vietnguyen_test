import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, Form, Input, Select, InputNumber, DatePicker, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { FormCard, DataTable, StatusTag, SearchForm, ExportButton } from '../../shared/components';
import type { Machine } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

const MachineMasterPage: React.FC = () => {
  const [data, setData] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Machine | null>(null);
  const [form] = Form.useForm();

  // Mock data
  const mockData: Machine[] = [
    {
      id: '1',
      machineCode: 'MC-001',
      machineName: 'CNC Milling Machine A1',
      type: 'CNC Milling',
      manufacturer: 'Haas Automation',
      model: 'VF-2SS',
      serialNumber: 'HS2024001',
      installationDate: '2023-06-15',
      capacity: 500,
      status: 'active',
      location: 'Production Line 1',
      maintenanceSchedule: 'Weekly',
      lastMaintenanceDate: '2024-01-08',
      nextMaintenanceDate: '2024-01-15',
      notes: 'Máy CNC chính cho gia công PCB',
      createdAt: '2024-01-01T08:00:00Z',
      updatedAt: '2024-01-01T08:00:00Z',
      createdBy: 'admin'
    },
    {
      id: '2',
      machineCode: 'MC-002',
      machineName: 'Injection Molding Press B2',
      type: 'Injection Molding',
      manufacturer: 'Sumitomo',
      model: 'SE180DU',
      serialNumber: 'SM2023005',
      installationDate: '2023-08-20',
      capacity: 180,
      status: 'maintenance',
      location: 'Production Line 2',
      maintenanceSchedule: 'Monthly',
      lastMaintenanceDate: '2024-01-10',
      nextMaintenanceDate: '2024-02-10',
      notes: 'Đang bảo trì định kỳ',
      createdAt: '2024-01-02T09:00:00Z',
      updatedAt: '2024-01-10T14:00:00Z',
      createdBy: 'admin'
    },
    {
      id: '3',
      machineCode: 'MC-003',
      machineName: 'Laser Cutting System C3',
      type: 'Laser Cutting',
      manufacturer: 'Trumpf',
      model: 'TruLaser 3030',
      serialNumber: 'TR2024002',
      installationDate: '2023-09-10',
      capacity: 300,
      status: 'active',
      location: 'Cutting Department',
      maintenanceSchedule: 'Bi-weekly',
      lastMaintenanceDate: '2024-01-05',
      nextMaintenanceDate: '2024-01-19',
      notes: 'Máy cắt laser độ chính xác cao',
      createdAt: '2024-01-03T10:00:00Z',
      updatedAt: '2024-01-05T16:00:00Z',
      createdBy: 'admin'
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

  const handleEdit = (record: Machine) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      installationDate: record.installationDate ? dayjs(record.installationDate) : null,
      lastMaintenanceDate: record.lastMaintenanceDate ? dayjs(record.lastMaintenanceDate) : null,
      nextMaintenanceDate: record.nextMaintenanceDate ? dayjs(record.nextMaintenanceDate) : null,
    });
    setModalVisible(true);
  };

  const handleDelete = async (record: Machine) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(data.filter(item => item.id !== record.id));
      message.success('Đã xóa máy móc');
    } catch (error) {
      message.error('Không thể xóa máy móc');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const formData = {
        ...values,
        installationDate: values.installationDate?.format('YYYY-MM-DD'),
        lastMaintenanceDate: values.lastMaintenanceDate?.format('YYYY-MM-DD'),
        nextMaintenanceDate: values.nextMaintenanceDate?.format('YYYY-MM-DD'),
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
        message.success('Đã cập nhật thông tin máy móc');
      } else {
        const newRecord: Machine = {
          id: Date.now().toString(),
          machineCode: `MC-${String(data.length + 1).padStart(3, '0')}`,
          ...formData
        };
        setData([newRecord, ...data]);
        message.success('Đã tạo máy móc mới');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Machine> = [
    {
      title: 'Mã máy',
      dataIndex: 'machineCode',
      key: 'machineCode',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'Tên máy',
      dataIndex: 'machineName',
      key: 'machineName',
      width: 200,
    },
    {
      title: 'Loại máy',
      dataIndex: 'type',
      key: 'type',
      width: 150,
    },
    {
      title: 'Hãng SX',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: 120,
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      width: 120,
    },
    {
      title: 'Công suất',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 100,
      align: 'right',
    },
    {
      title: 'Vị trí',
      dataIndex: 'location',
      key: 'location',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value) => <StatusTag status={value} type="machine" />,
    },
    {
      title: 'BT kế tiếp',
      dataIndex: 'nextMaintenanceDate',
      key: 'nextMaintenanceDate',
      width: 120,
      render: (value) => value ? dayjs(value).format('DD/MM/YYYY') : '-',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (value) => dayjs(value).format('DD/MM/YYYY'),
    },
  ];

  return (
    <div>
      <FormCard
        title="Quản lý Máy móc"
        subtitle="Master data - Danh sách máy móc thiết bị"
        extra={
          <Space>
            <ExportButton
              data={data}
              columns={[]}
              filename="machine-master"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Thêm máy móc
            </Button>
          </Space>
        }
      >
        <DataTable
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1500 }}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={{
            total: data.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} máy móc`,
          }}
        />
      </FormCard>

      <Modal
        title={editingRecord ? 'Chỉnh sửa máy móc' : 'Thêm máy móc mới'}
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
            maintenanceSchedule: 'Weekly'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item
              name="machineName"
              label="Tên máy"
              rules={[{ required: true, message: 'Vui lòng nhập tên máy' }]}
            >
              <Input placeholder="Nhập tên máy" />
            </Form.Item>

            <Form.Item
              name="type"
              label="Loại máy"
              rules={[{ required: true, message: 'Vui lòng chọn loại máy' }]}
            >
              <Select placeholder="Chọn loại máy">
                <Option value="CNC Milling">CNC Milling</Option>
                <Option value="CNC Turning">CNC Turning</Option>
                <Option value="Injection Molding">Injection Molding</Option>
                <Option value="Laser Cutting">Laser Cutting</Option>
                <Option value="Press Machine">Press Machine</Option>
                <Option value="Assembly Line">Assembly Line</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="manufacturer"
              label="Hãng sản xuất"
            >
              <Input placeholder="Nhập hãng sản xuất" />
            </Form.Item>

            <Form.Item
              name="model"
              label="Model"
            >
              <Input placeholder="Nhập model" />
            </Form.Item>

            <Form.Item
              name="serialNumber"
              label="Số serial"
            >
              <Input placeholder="Nhập số serial" />
            </Form.Item>

            <Form.Item
              name="capacity"
              label="Công suất"
            >
              <InputNumber
                placeholder="Nhập công suất"
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="location"
              label="Vị trí"
            >
              <Input placeholder="Nhập vị trí đặt máy" />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="active">Hoạt động</Option>
                <Option value="maintenance">Bảo trì</Option>
                <Option value="breakdown">Hỏng hóc</Option>
                <Option value="inactive">Không hoạt động</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="maintenanceSchedule"
              label="Lịch bảo trì"
            >
              <Select placeholder="Chọn lịch bảo trì">
                <Option value="Daily">Hàng ngày</Option>
                <Option value="Weekly">Hàng tuần</Option>
                <Option value="Bi-weekly">2 tuần/lần</Option>
                <Option value="Monthly">Hàng tháng</Option>
                <Option value="Quarterly">Hàng quý</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="installationDate"
              label="Ngày lắp đặt"
            >
              <DatePicker
                placeholder="Chọn ngày lắp đặt"
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
              />
            </Form.Item>

            <Form.Item
              name="lastMaintenanceDate"
              label="BT lần cuối"
            >
              <DatePicker
                placeholder="Chọn ngày BT cuối"
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
              />
            </Form.Item>

            <Form.Item
              name="nextMaintenanceDate"
              label="BT kế tiếp"
            >
              <DatePicker
                placeholder="Chọn ngày BT kế tiếp"
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
              placeholder="Nhập ghi chú về máy móc"
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

export default MachineMasterPage;