import React, { useState } from 'react';
import {
  Form,
  Input,
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
  Select,
} from 'antd';
import {
  SaveOutlined,
  PrinterOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface MaterialIncomingData {
  key: string;
  material: string;
  dimension: string;
  color: string;
  flatness: string;
  cosmetics: string;
  result: string;
  inspector: string;
  inspectionDate: string;
  po: string;
  supplier: string;
}

const MaterialIncoming: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState<MaterialIncomingData[]>([
    {
      key: '1',
      material: 'Aluminum 6061 Sheet',
      dimension: '1000x500x10mm',
      color: 'Natural',
      flatness: '±0.05mm',
      cosmetics: 'No scratches, clean surface',
      result: 'Pass',
      inspector: 'Nguyễn Văn QC',
      inspectionDate: '2024-01-10',
      po: 'PO-2024-001',
      supplier: 'ABC Materials Co.',
    },
  ]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formattedData: MaterialIncomingData = {
        key: Date.now().toString(),
        ...values,
        inspector: 'Admin',
        inspectionDate: dayjs().format('YYYY-MM-DD'),
      };

      setDataSource([...dataSource, formattedData]);
      message.success('Lưu kết quả kiểm tra thành công!');
      
      form.resetFields();
      setIsModalVisible(false);
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
      title: 'Vật liệu',
      dataIndex: 'material',
      key: 'material',
      width: 150,
    },
    {
      title: 'Kích thước',
      dataIndex: 'dimension',
      key: 'dimension',
      width: 120,
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
      key: 'color',
      width: 100,
    },
    {
      title: 'Độ phẳng',
      dataIndex: 'flatness',
      key: 'flatness',
      width: 100,
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplier',
      key: 'supplier',
      width: 150,
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      key: 'result',
      width: 100,
      render: (result: string) => (
        <Tag 
          color={result === 'Pass' ? 'green' : 'red'}
          icon={result === 'Pass' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        >
          {result === 'Pass' ? 'Đạt' : 'Không đạt'}
        </Tag>
      ),
    },
    {
      title: 'Người kiểm tra',
      dataIndex: 'inspector',
      key: 'inspector',
      width: 120,
    },
    {
      title: 'Ngày kiểm tra',
      dataIndex: 'inspectionDate',
      key: 'inspectionDate',
      width: 110,
    },
  ];

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3}>Material Incoming Inspection Sheet (F-QC-15-02)</Title>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  form.resetFields();
                  setIsModalVisible(true);
                }}
              >
                Kiểm tra mới
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
            showTotal: (total) => `Tổng cộng ${total} phiếu kiểm tra`,
          }}
        />
      </Card>

      <Modal
        title="Kiểm tra vật liệu đầu vào"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="PO"
                name="po"
                rules={[{ required: true, message: 'Vui lòng nhập PO!' }]}
              >
                <Input placeholder="PO-2024-XXX" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Nhà cung cấp"
                name="supplier"
                rules={[{ required: true, message: 'Vui lòng nhập nhà cung cấp!' }]}
              >
                <Input placeholder="Tên nhà cung cấp" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Material"
                name="material"
                rules={[{ required: true, message: 'Vui lòng nhập vật liệu!' }]}
              >
                <Input placeholder="Aluminum 6061" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Dimension"
                name="dimension"
                rules={[{ required: true, message: 'Vui lòng nhập kích thước!' }]}
              >
                <Input placeholder="1000x500x10mm" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Color"
                name="color"
              >
                <Input placeholder="Natural/Black/Silver..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Flatness"
                name="flatness"
              >
                <Input placeholder="±0.05mm" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Result"
                name="result"
                rules={[{ required: true, message: 'Vui lòng chọn kết quả!' }]}
              >
                <Radio.Group>
                  <Radio value="Pass">Pass</Radio>
                  <Radio value="Fail">Fail</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Cosmetics"
            name="cosmetics"
          >
            <TextArea
              rows={4}
              placeholder="Mô tả tình trạng bề mặt, vết xước, khuyết tật..."
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                Lưu kết quả
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                Hủy
              </Button>
              <Button icon={<PrinterOutlined />}>
                In phiếu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MaterialIncoming;