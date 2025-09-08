import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
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
  FileExcelOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;

interface CustomerBOMData {
  key: string;
  po: string;
  drawingCode: string;
  rev: string;
  material: string;
  deliveryQuantity: number;
  stockQuantity: number;
  otherMaterials: string;
  qcTime: string;
  notes: string;
  createdDate: string;
  createdBy: string;
}

const CustomerBOM: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [dataSource, setDataSource] = useState<CustomerBOMData[]>([
    {
      key: '1',
      po: 'PO-2024-001',
      drawingCode: 'DWG-A1-001',
      rev: 'R1',
      material: 'Aluminum 6061',
      deliveryQuantity: 500,
      stockQuantity: 50,
      otherMaterials: 'Screws M3x10 (100pcs)',
      qcTime: '30 phút/100pcs',
      notes: 'Kiểm tra độ phẳng ±0.02mm',
      createdDate: '2024-01-10',
      createdBy: 'Nguyễn Văn A',
    },
  ]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formattedData: CustomerBOMData = {
        key: editingKey || Date.now().toString(),
        ...values,
        createdDate: editingKey ? 
          dataSource.find(item => item.key === editingKey)?.createdDate || dayjs().format('YYYY-MM-DD') :
          dayjs().format('YYYY-MM-DD'),
        createdBy: 'Admin',
      };

      if (editingKey) {
        setDataSource(dataSource.map(item => 
          item.key === editingKey ? formattedData : item
        ));
        message.success('Cập nhật BOM thành công!');
      } else {
        setDataSource([...dataSource, formattedData]);
        message.success('Tạo BOM thành công!');
      }
      
      form.resetFields();
      setIsModalVisible(false);
      setEditingKey('');
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
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
      title: 'Vật liệu',
      dataIndex: 'material',
      key: 'material',
      width: 120,
    },
    {
      title: 'SL giao',
      dataIndex: 'deliveryQuantity',
      key: 'deliveryQuantity',
      width: 80,
      align: 'right' as const,
    },
    {
      title: 'SL tồn',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      width: 80,
      align: 'right' as const,
      render: (value: number) => (
        <Tag color={value > 0 ? 'green' : 'red'}>{value}</Tag>
      ),
    },
    {
      title: 'TG chạy QC',
      dataIndex: 'qcTime',
      key: 'qcTime',
      width: 120,
    },
    {
      title: 'Lưu ý',
      dataIndex: 'notes',
      key: 'notes',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 100,
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right' as const,
      width: 120,
      render: (_: any, record: CustomerBOMData) => (
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
            onClick={() => {
              Modal.confirm({
                title: 'Xác nhận xóa',
                content: 'Bạn có chắc chắn muốn xóa BOM này?',
                okText: 'Xóa',
                cancelText: 'Hủy',
                onOk: () => {
                  setDataSource(dataSource.filter(item => item.key !== record.key));
                  message.success('Đã xóa BOM!');
                },
              });
            }}
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
            <Title level={3}>BOM khách hàng (F-PR-01-01)</Title>
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
                Tạo BOM mới
              </Button>
              <Button icon={<FileExcelOutlined />}>
                Xuất Excel
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} BOM`,
          }}
        />
      </Card>

      <Modal
        title={editingKey ? "Chỉnh sửa BOM" : "Tạo BOM mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingKey('');
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="PO"
                name="po"
                rules={[{ required: true, message: 'Vui lòng nhập PO!' }]}
              >
                <Input placeholder="PO-2024-XXX" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Mã bản vẽ"
                name="drawingCode"
                rules={[{ required: true, message: 'Vui lòng nhập mã bản vẽ!' }]}
              >
                <Input placeholder="DWG-XXX-XXX" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Rev"
                name="rev"
                rules={[{ required: true, message: 'Vui lòng nhập Rev!' }]}
              >
                <Input placeholder="R1" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Vật liệu"
                name="material"
                rules={[{ required: true, message: 'Vui lòng nhập vật liệu!' }]}
              >
                <Input placeholder="Aluminum 6061" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Số lượng giao"
                name="deliveryQuantity"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Số lượng tồn"
                name="stockQuantity"
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
                label="Vật tư khác"
                name="otherMaterials"
              >
                <TextArea
                  rows={3}
                  placeholder="Nhập danh sách vật tư khác..."
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="TG chạy QC"
                name="qcTime"
              >
                <Input placeholder="30 phút/100pcs" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Lưu ý khác"
            name="notes"
          >
            <TextArea
              rows={4}
              placeholder="Nhập các lưu ý khác..."
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                {editingKey ? 'Cập nhật' : 'Tạo BOM'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingKey('');
                form.resetFields();
              }}>
                Hủy
              </Button>
              <Button icon={<PrinterOutlined />}>
                In BOM
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerBOM;