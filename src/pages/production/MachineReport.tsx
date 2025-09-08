import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  TimePicker,
  Radio,
  Button,
  Card,
  Row,
  Col,
  Space,
  Typography,
  message,
  Table,
  Modal,
  Tag,
} from 'antd';
import {
  SaveOutlined,
  PrinterOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface MachineReportData {
  key: string;
  po: string;
  drawingCode: string;
  rev: string;
  step: string;
  inputQuantity: number;
  outputQuantity: number;
  defectQuantity: number;
  nextStep: string;
  setupTime: [Dayjs, Dayjs] | null;
  machineTime: [Dayjs, Dayjs] | null;
  avgTimePerPart: number;
  qcTime: [Dayjs, Dayjs] | null;
  setupEvaluation: string;
  issues: string;
  createdDate: string;
  createdBy: string;
  status: string;
}

const MachineReport: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<MachineReportData[]>([
    {
      key: '1',
      po: 'PO-2024-001',
      drawingCode: 'DWG-A1-001',
      rev: 'R1',
      step: 'CNC Mill',
      inputQuantity: 100,
      outputQuantity: 98,
      defectQuantity: 2,
      nextStep: 'QC',
      setupTime: null,
      machineTime: null,
      avgTimePerPart: 5.5,
      qcTime: null,
      setupEvaluation: 'Đạt',
      issues: 'Không có vấn đề',
      createdDate: '2024-01-10',
      createdBy: 'Nguyễn Văn A',
      status: 'completed',
    },
    {
      key: '2',
      po: 'PO-2024-002',
      drawingCode: 'DWG-B2-003',
      rev: 'R2',
      step: 'Milling',
      inputQuantity: 200,
      outputQuantity: 195,
      defectQuantity: 5,
      nextStep: 'Surface Treatment',
      setupTime: null,
      machineTime: null,
      avgTimePerPart: 3.2,
      qcTime: null,
      setupEvaluation: 'Đạt',
      issues: 'Cần điều chỉnh tốc độ cắt',
      createdDate: '2024-01-11',
      createdBy: 'Trần Thị B',
      status: 'processing',
    },
  ]);
  const [editingKey, setEditingKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Format the data
      const formattedData: MachineReportData = {
        key: Date.now().toString(),
        po: values.po,
        drawingCode: values.drawingCode,
        rev: values.rev,
        step: values.step,
        inputQuantity: values.inputQuantity,
        outputQuantity: values.outputQuantity,
        defectQuantity: values.defectQuantity,
        nextStep: values.nextStep,
        setupTime: values.setupTime,
        machineTime: values.machineTime,
        avgTimePerPart: values.avgTimePerPart,
        qcTime: values.qcTime,
        setupEvaluation: values.setupEvaluation,
        issues: values.issues,
        createdDate: dayjs().format('YYYY-MM-DD'),
        createdBy: 'Admin',
        status: 'processing',
      };

      // Add to table
      setDataSource([...dataSource, formattedData]);
      
      message.success('Lưu báo cáo thành công!');
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu báo cáo!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa báo cáo này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        setDataSource(dataSource.filter(item => item.key !== key));
        message.success('Đã xóa báo cáo!');
      },
    });
  };

  const columns = [
    {
      title: 'PO',
      dataIndex: 'po',
      key: 'po',
      width: 120,
    },
    {
      title: 'Mã bản vẽ',
      dataIndex: 'drawingCode',
      key: 'drawingCode',
      width: 120,
    },
    {
      title: 'Rev',
      dataIndex: 'rev',
      key: 'rev',
      width: 60,
    },
    {
      title: 'Công đoạn',
      dataIndex: 'step',
      key: 'step',
      width: 100,
    },
    {
      title: 'SL đầu vào',
      dataIndex: 'inputQuantity',
      key: 'inputQuantity',
      width: 100,
      align: 'right' as const,
    },
    {
      title: 'SL đầu ra',
      dataIndex: 'outputQuantity',
      key: 'outputQuantity',
      width: 100,
      align: 'right' as const,
    },
    {
      title: 'SL lỗi',
      dataIndex: 'defectQuantity',
      key: 'defectQuantity',
      width: 80,
      align: 'right' as const,
      render: (text: number) => (
        <Text type={text > 0 ? 'danger' : 'success'}>{text}</Text>
      ),
    },
    {
      title: 'Đánh giá Setup',
      dataIndex: 'setupEvaluation',
      key: 'setupEvaluation',
      width: 120,
      render: (text: string) => (
        <Tag color={text === 'Đạt' ? 'green' : 'red'}>{text}</Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 100,
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 120,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        let color = 'default';
        let text = '';
        
        switch(status) {
          case 'completed':
            color = 'success';
            text = 'Hoàn thành';
            break;
          case 'processing':
            color = 'processing';
            text = 'Đang xử lý';
            break;
          default:
            text = status;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right' as const,
      width: 120,
      render: (_: any, record: MachineReportData) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue(record);
              setEditingKey(record.key);
              setIsModalVisible(true);
            }}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
          />
          <Button
            type="link"
            icon={<PrinterOutlined />}
            onClick={() => message.info('Đang in báo cáo...')}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3}>Báo cáo máy (F-PR-03-02)</Title>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  form.resetFields();
                  setEditingKey('');
                  setIsModalVisible(true);
                }}
              >
                Tạo báo cáo mới
              </Button>
              <Button icon={<SearchOutlined />}>
                Tìm kiếm
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1500 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} báo cáo`,
          }}
        />
      </Card>

      <Modal
        title={editingKey ? "Chỉnh sửa báo cáo máy" : "Tạo báo cáo máy mới"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={900}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="PO"
                name="po"
                rules={[{ required: true, message: 'Vui lòng nhập PO!' }]}
              >
                <Input placeholder="Nhập số PO" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Mã bản vẽ"
                name="drawingCode"
                rules={[{ required: true, message: 'Vui lòng nhập mã bản vẽ!' }]}
              >
                <Input placeholder="Nhập mã bản vẽ" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="Rev"
                name="rev"
                rules={[{ required: true, message: 'Vui lòng nhập Rev!' }]}
              >
                <Input placeholder="R1" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="Step"
                name="step"
                rules={[{ required: true, message: 'Vui lòng nhập Step!' }]}
              >
                <Input placeholder="CNC" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Số lượng phôi đầu vào"
                name="inputQuantity"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Số lượng hàng ra"
                name="outputQuantity"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Số lượng hư (giấy vàng/đỏ)"
                name="defectQuantity"
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Khâu tiếp nhận"
                name="nextStep"
              >
                <Input placeholder="Nhập khâu tiếp nhận" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Bình quân/part (phút)"
                name="avgTimePerPart"
              >
                <InputNumber
                  min={0}
                  step={0.1}
                  style={{ width: '100%' }}
                  placeholder="0.0"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Thời gian setup"
                name="setupTime"
              >
                <RangePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  style={{ width: '100%' }}
                  placeholder={['Bắt đầu', 'Kết thúc']}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Thời gian chạy máy"
                name="machineTime"
              >
                <RangePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  style={{ width: '100%' }}
                  placeholder={['Bắt đầu', 'Kết thúc']}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Thời gian QC"
                name="qcTime"
              >
                <RangePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  style={{ width: '100%' }}
                  placeholder={['Giao', 'Trả']}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Đánh giá setup"
                name="setupEvaluation"
                initialValue="Đạt"
              >
                <Radio.Group>
                  <Radio value="Đạt">Đạt</Radio>
                  <Radio value="Không đạt">Không đạt</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Vấn đề khó khăn"
            name="issues"
          >
            <TextArea
              rows={4}
              placeholder="Nhập các vấn đề gặp phải trong quá trình sản xuất..."
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                {editingKey ? 'Cập nhật' : 'Lưu báo cáo'}
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                Hủy
              </Button>
              <Button icon={<PrinterOutlined />}>
                In báo cáo
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MachineReport;