import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
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
  Divider,
  DatePicker,
} from 'antd';
import {
  SaveOutlined,
  PrinterOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

interface ProductionOrderData {
  key: string;
  customer: string;
  po: string;
  batchNumber: string;
  pinCode: string;
  drawingCode: string;
  rev: string;
  material: string;
  surface: string;
  deliveryQuantity: number;
  processingQuantity: number;
  materialSize: string;
  issuer: string;
  approver: string;
  createdDate: string;
  status: string;
}

const ProductionOrder: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [dataSource, setDataSource] = useState<ProductionOrderData[]>([
    {
      key: '1',
      customer: 'Samsung Electronics',
      po: 'PO-2024-001',
      batchNumber: 'LOT-001',
      pinCode: 'PIN-A1',
      drawingCode: 'DWG-A1-001',
      rev: 'R1',
      material: 'Aluminum 6061',
      surface: 'Anodized',
      deliveryQuantity: 500,
      processingQuantity: 520,
      materialSize: '100x50x10mm',
      issuer: 'Nguyễn Văn A',
      approver: 'Trần Văn B',
      createdDate: '2024-01-10',
      status: 'approved',
    },
    {
      key: '2',
      customer: 'LG Display',
      po: 'PO-2024-002',
      batchNumber: 'LOT-002',
      pinCode: 'PIN-B2',
      drawingCode: 'DWG-B2-003',
      rev: 'R2',
      material: 'Stainless Steel 304',
      surface: 'Polished',
      deliveryQuantity: 1000,
      processingQuantity: 1050,
      materialSize: '200x100x5mm',
      issuer: 'Lê Thị C',
      approver: 'Phạm Văn D',
      createdDate: '2024-01-11',
      status: 'processing',
    },
  ]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formattedData: ProductionOrderData = {
        key: editingKey || Date.now().toString(),
        customer: values.customer,
        po: values.po,
        batchNumber: values.batchNumber,
        pinCode: values.pinCode,
        drawingCode: values.drawingCode,
        rev: values.rev,
        material: values.material,
        surface: values.surface,
        deliveryQuantity: values.deliveryQuantity,
        processingQuantity: values.processingQuantity,
        materialSize: values.materialSize,
        issuer: values.issuer,
        approver: values.approver,
        createdDate: editingKey ? 
          dataSource.find(item => item.key === editingKey)?.createdDate || dayjs().format('YYYY-MM-DD') :
          dayjs().format('YYYY-MM-DD'),
        status: values.status || 'draft',
      };

      if (editingKey) {
        setDataSource(dataSource.map(item => 
          item.key === editingKey ? formattedData : item
        ));
        message.success('Cập nhật lệnh sản xuất thành công!');
      } else {
        setDataSource([...dataSource, formattedData]);
        message.success('Tạo lệnh sản xuất thành công!');
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

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa lệnh sản xuất này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        setDataSource(dataSource.filter(item => item.key !== key));
        message.success('Đã xóa lệnh sản xuất!');
      },
    });
  };

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      width: 150,
    },
    {
      title: 'PO',
      dataIndex: 'po',
      key: 'po',
      width: 120,
    },
    {
      title: 'Số lô',
      dataIndex: 'batchNumber',
      key: 'batchNumber',
      width: 100,
    },
    {
      title: 'Mã PIN',
      dataIndex: 'pinCode',
      key: 'pinCode',
      width: 100,
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
      title: 'Bề mặt',
      dataIndex: 'surface',
      key: 'surface',
      width: 100,
    },
    {
      title: 'SL giao',
      dataIndex: 'deliveryQuantity',
      key: 'deliveryQuantity',
      width: 80,
      align: 'right' as const,
    },
    {
      title: 'SL gia công',
      dataIndex: 'processingQuantity',
      key: 'processingQuantity',
      width: 100,
      align: 'right' as const,
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
          case 'draft':
            color = 'default';
            text = 'Nháp';
            break;
          case 'approved':
            color = 'success';
            text = 'Đã duyệt';
            break;
          case 'processing':
            color = 'processing';
            text = 'Đang SX';
            break;
          case 'completed':
            color = 'green';
            text = 'Hoàn thành';
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
      width: 150,
      render: (_: any, record: ProductionOrderData) => (
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
            onClick={() => message.info('Đang in lệnh sản xuất...')}
          />
        </Space>
      ),
    },
  ];

  const materialOptions = [
    'Aluminum 6061',
    'Aluminum 7075',
    'Stainless Steel 304',
    'Stainless Steel 316',
    'Mild Steel',
    'Brass',
    'Copper',
    'Titanium',
    'Plastic ABS',
    'Plastic PC',
  ];

  const surfaceOptions = [
    'Anodized',
    'Polished',
    'Brushed',
    'Painted',
    'Powder Coated',
    'Chrome Plated',
    'Nickel Plated',
    'Passivated',
    'Natural',
  ];

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3}>Lệnh sản xuất – Xuất hàng (F-PN-01-02)</Title>
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
                Tạo lệnh mới
              </Button>
              <Button icon={<FileTextOutlined />}>
                Xuất báo cáo
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
            showTotal: (total) => `Tổng cộng ${total} lệnh sản xuất`,
          }}
        />
      </Card>

      <Modal
        title={editingKey ? "Chỉnh sửa lệnh sản xuất" : "Tạo lệnh sản xuất mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingKey('');
          form.resetFields();
        }}
        footer={null}
        width={900}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Divider orientation="left">Thông tin khách hàng</Divider>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Khách hàng"
                name="customer"
                rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}
              >
                <Select placeholder="Chọn khách hàng">
                  <Option value="Samsung Electronics">Samsung Electronics</Option>
                  <Option value="LG Display">LG Display</Option>
                  <Option value="Intel Vietnam">Intel Vietnam</Option>
                  <Option value="Foxconn">Foxconn</Option>
                  <Option value="Canon Vietnam">Canon Vietnam</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="PO"
                name="po"
                rules={[{ required: true, message: 'Vui lòng nhập số PO!' }]}
              >
                <Input placeholder="PO-2024-XXX" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Số lô"
                name="batchNumber"
                rules={[{ required: true, message: 'Vui lòng nhập số lô!' }]}
              >
                <Input placeholder="LOT-XXX" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Mã PIN"
                name="pinCode"
              >
                <Input placeholder="PIN-XXX" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Trạng thái"
                name="status"
                initialValue="draft"
              >
                <Select>
                  <Option value="draft">Nháp</Option>
                  <Option value="approved">Đã duyệt</Option>
                  <Option value="processing">Đang sản xuất</Option>
                  <Option value="completed">Hoàn thành</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Thông tin sản phẩm</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Mã bản vẽ"
                name="drawingCode"
                rules={[{ required: true, message: 'Vui lòng nhập mã bản vẽ!' }]}
              >
                <Input placeholder="DWG-XXX-XXX" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Rev"
                name="rev"
                rules={[{ required: true, message: 'Vui lòng nhập Rev!' }]}
              >
                <Input placeholder="R1" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Kích thước phôi"
                name="materialSize"
              >
                <Input placeholder="100x50x10mm" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Vật liệu"
                name="material"
                rules={[{ required: true, message: 'Vui lòng chọn vật liệu!' }]}
              >
                <Select placeholder="Chọn vật liệu">
                  {materialOptions.map(material => (
                    <Option key={material} value={material}>{material}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Xử lý bề mặt"
                name="surface"
              >
                <Select placeholder="Chọn xử lý bề mặt">
                  {surfaceOptions.map(surface => (
                    <Option key={surface} value={surface}>{surface}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Số lượng giao hàng"
                name="deliveryQuantity"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số lượng gia công"
                name="processingQuantity"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Phê duyệt</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Người phát hành"
                name="issuer"
                rules={[{ required: true, message: 'Vui lòng nhập người phát hành!' }]}
              >
                <Input placeholder="Họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Người duyệt"
                name="approver"
              >
                <Input placeholder="Họ và tên" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                {editingKey ? 'Cập nhật' : 'Tạo lệnh'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingKey('');
                form.resetFields();
              }}>
                Hủy
              </Button>
              {editingKey && (
                <Button type="primary" icon={<CheckCircleOutlined />} style={{ background: '#52c41a' }}>
                  Phê duyệt
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductionOrder;