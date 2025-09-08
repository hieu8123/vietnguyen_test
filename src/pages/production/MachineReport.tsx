import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, Form, Input, Select, DatePicker, InputNumber, message, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { FormCard, DataTable, StatusTag, SearchForm, ExportButton, PrintButton } from '../../shared/components';
import type { MachineReport } from '../../types';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const MachineReportPage: React.FC = () => {
  const [data, setData] = useState<MachineReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MachineReport | null>(null);
  const [form] = Form.useForm();

  // Mock data
  const mockData: MachineReport[] = [
    {
      id: '1',
      reportNumber: 'RPT-2024-001',
      poId: 'PO-2024-001',
      machineId: 'CNC-001',
      machineName: 'CNC Mill 01',
      operatorId: 'OP-001',
      operatorName: 'Nguyễn Văn A',
      shift: 'morning',
      date: '2024-01-10',
      setupTime: 30,
      runTime: 240,
      outputQuantity: 98,
      scrapQuantity: 2,
      defectQuantity: 1,
      downtime: 15,
      downtimeReason: 'Thay dao cắt',
      qcFeedback: 'Chất lượng tốt',
      notes: 'Máy hoạt động ổn định',
      status: 'completed',
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-10T16:00:00Z',
      createdBy: 'OP-001',
      updatedBy: 'OP-001'
    },
    {
      id: '2',
      reportNumber: 'RPT-2024-002',
      poId: 'PO-2024-002',
      machineId: 'CNC-002',
      machineName: 'CNC Mill 02',
      operatorId: 'OP-002',
      operatorName: 'Trần Thị B',
      shift: 'afternoon',
      date: '2024-01-10',
      setupTime: 45,
      runTime: 180,
      outputQuantity: 150,
      scrapQuantity: 3,
      defectQuantity: 2,
      downtime: 20,
      downtimeReason: 'Bảo trì định kỳ',
      notes: 'Cần kiểm tra hệ thống làm mát',
      status: 'in_progress',
      createdAt: '2024-01-10T14:00:00Z',
      updatedAt: '2024-01-10T18:00:00Z',
      createdBy: 'OP-002',
      updatedBy: 'OP-002'
    },
    {
      id: '3',
      reportNumber: 'RPT-2024-003',
      poId: 'PO-2024-003',
      machineId: 'LATHE-001',
      machineName: 'CNC Lathe 01',
      operatorId: 'OP-003',
      operatorName: 'Lê Văn C',
      shift: 'night',
      date: '2024-01-11',
      setupTime: 60,
      runTime: 300,
      outputQuantity: 75,
      scrapQuantity: 1,
      defectQuantity: 0,
      downtime: 10,
      downtimeReason: 'Kiểm tra chất lượng',
      qcFeedback: 'Đạt yêu cầu',
      notes: 'Sản xuất đúng tiến độ',
      status: 'completed',
      createdAt: '2024-01-11T22:00:00Z',
      updatedAt: '2024-01-12T06:00:00Z',
      createdBy: 'OP-003',
      updatedBy: 'OP-003'
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

  const handleEdit = (record: MachineReport) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date)
    });
    setModalVisible(true);
  };

  const handleDelete = async (record: MachineReport) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(data.filter(item => item.id !== record.id));
      message.success('Đã xóa báo cáo máy');
    } catch (error) {
      message.error('Không thể xóa báo cáo máy');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const formData = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
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
        message.success('Đã cập nhật báo cáo máy');
      } else {
        // Create new record
        const newRecord: MachineReport = {
          id: Date.now().toString(),
          reportNumber: `RPT-2024-${String(data.length + 1).padStart(3, '0')}`,
          ...formData
        };
        setData([newRecord, ...data]);
        message.success('Đã tạo báo cáo máy mới');
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

  const columns: ColumnsType<MachineReport> = [
    {
      title: 'Số báo cáo',
      dataIndex: 'reportNumber',
      key: 'reportNumber',
      width: 120,
      fixed: 'left',
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
      width: 150,
    },
    {
      title: 'Người vận hành',
      dataIndex: 'operatorName',
      key: 'operatorName',
      width: 120,
    },
    {
      title: 'Ca',
      dataIndex: 'shift',
      key: 'shift',
      width: 80,
      render: (value) => {
        const shiftMap = {
          morning: 'Sáng',
          afternoon: 'Chiều', 
          night: 'Đêm'
        };
        return shiftMap[value as keyof typeof shiftMap] || value;
      },
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      render: (value) => dayjs(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Setup (phút)',
      dataIndex: 'setupTime',
      key: 'setupTime',
      width: 100,
      align: 'right',
    },
    {
      title: 'Chạy máy (phút)',
      dataIndex: 'runTime',
      key: 'runTime',
      width: 120,
      align: 'right',
    },
    {
      title: 'Sản lượng',
      dataIndex: 'outputQuantity',
      key: 'outputQuantity',
      width: 100,
      align: 'right',
    },
    {
      title: 'Phế phẩm',
      dataIndex: 'scrapQuantity',
      key: 'scrapQuantity',
      width: 100,
      align: 'right',
      render: (value) => (
        <span style={{ color: value > 0 ? '#ff4d4f' : '#52c41a' }}>
          {value}
        </span>
      ),
    },
    {
      title: 'Lỗi',
      dataIndex: 'defectQuantity',
      key: 'defectQuantity',
      width: 80,
      align: 'right',
      render: (value) => (
        <span style={{ color: value > 0 ? '#ff4d4f' : '#52c41a' }}>
          {value}
        </span>
      ),
    },
    {
      title: 'Downtime (phút)',
      dataIndex: 'downtime',
      key: 'downtime',
      width: 120,
      align: 'right',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value) => <StatusTag status={value} type="production" />,
    },
  ];

  const searchFields = [
    {
      name: 'reportNumber',
      label: 'Số báo cáo',
      type: 'text' as const,
      span: 6,
    },
    {
      name: 'poId',
      label: 'PO',
      type: 'text' as const,
      span: 6,
    },
    {
      name: 'machineId',
      label: 'Máy',
      type: 'select' as const,
      options: [
        { value: 'CNC-001', label: 'CNC Mill 01' },
        { value: 'CNC-002', label: 'CNC Mill 02' },
        { value: 'LATHE-001', label: 'CNC Lathe 01' },
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
    { key: 'reportNumber', title: 'Số báo cáo' },
    { key: 'poId', title: 'PO' },
    { key: 'machineName', title: 'Máy' },
    { key: 'operatorName', title: 'Người vận hành' },
    { key: 'shift', title: 'Ca' },
    { key: 'date', title: 'Ngày' },
    { key: 'setupTime', title: 'Setup (phút)' },
    { key: 'runTime', title: 'Chạy máy (phút)' },
    { key: 'outputQuantity', title: 'Sản lượng' },
    { key: 'scrapQuantity', title: 'Phế phẩm' },
    { key: 'defectQuantity', title: 'Lỗi' },
    { key: 'status', title: 'Trạng thái' },
  ];

  return (
    <div>
      <FormCard
        title="Báo cáo Máy"
        subtitle="Quản lý báo cáo hoạt động máy móc (F-PR-03-02)"
        extra={
          <Space>
            <ExportButton
              data={data}
              columns={exportColumns}
              filename="machine-reports"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Tạo báo cáo mới
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
          scroll={{ x: 1600 }}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customActions={(record) => (
            <PrintButton
              data={record}
              templateType="machine_report"
              size="small"
            />
          )}
          pagination={{
            total: data.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} báo cáo`,
          }}
        />
      </FormCard>

      {/* Create/Edit Modal */}
      <Modal
        title={editingRecord ? 'Chỉnh sửa báo cáo máy' : 'Tạo báo cáo máy mới'}
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
            shift: 'morning',
            status: 'in_progress'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
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
              name="operatorName"
              label="Người vận hành"
              rules={[{ required: true, message: 'Vui lòng nhập tên người vận hành' }]}
            >
              <Input placeholder="Nhập tên người vận hành" />
            </Form.Item>

            <Form.Item
              name="shift"
              label="Ca làm việc"
              rules={[{ required: true, message: 'Vui lòng chọn ca làm việc' }]}
            >
              <Select placeholder="Chọn ca làm việc">
                <Option value="morning">Ca sáng</Option>
                <Option value="afternoon">Ca chiều</Option>
                <Option value="night">Ca đêm</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="date"
              label="Ngày"
              rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
            >
              <DatePicker
                placeholder="Chọn ngày"
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
              />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
            >
              <Select>
                <Option value="in_progress">Đang xử lý</Option>
                <Option value="completed">Hoàn thành</Option>
                <Option value="on_hold">Tạm dừng</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="setupTime"
              label="Thời gian setup (phút)"
              rules={[{ required: true, message: 'Vui lòng nhập thời gian setup' }]}
            >
              <InputNumber
                placeholder="Nhập thời gian setup"
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="runTime"
              label="Thời gian chạy máy (phút)"
              rules={[{ required: true, message: 'Vui lòng nhập thời gian chạy máy' }]}
            >
              <InputNumber
                placeholder="Nhập thời gian chạy máy"
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="outputQuantity"
              label="Sản lượng"
              rules={[{ required: true, message: 'Vui lòng nhập sản lượng' }]}
            >
              <InputNumber
                placeholder="Nhập sản lượng"
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="scrapQuantity"
              label="Phế phẩm"
            >
              <InputNumber
                placeholder="Nhập số lượng phế phẩm"
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="defectQuantity"
              label="Lỗi"
            >
              <InputNumber
                placeholder="Nhập số lượng lỗi"
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="downtime"
              label="Downtime (phút)"
            >
              <InputNumber
                placeholder="Nhập thời gian dừng máy"
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="downtimeReason"
            label="Lý do downtime"
          >
            <Input placeholder="Nhập lý do dừng máy" />
          </Form.Item>

          <Form.Item
            name="qcFeedback"
            label="Phản hồi QC"
          >
            <TextArea
              rows={2}
              placeholder="Nhập phản hồi từ QC"
            />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <TextArea
              rows={3}
              placeholder="Nhập ghi chú về ca làm việc"
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

export default MachineReportPage;