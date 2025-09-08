import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, Form, Input, Select, InputNumber, message, DatePicker, Tag } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { FormCard, DataTable, StatusTag, SearchForm, ExportButton } from '../../shared/components';
import type { FinishedGoods } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

const FinishedGoodsInventoryPage: React.FC = () => {
  const [data, setData] = useState<FinishedGoods[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinishedGoods | null>(null);
  const [form] = Form.useForm();

  // Mock data
  const mockData: FinishedGoods[] = [
    {
      id: '1',
      productCode: 'PCB-A1-001',
      productName: 'PCB Board A1',
      poId: 'PO-2024-001',
      quantity: 480,
      unit: 'pcs',
      lotNumber: 'FG-LOT-001',
      productionDate: '2024-01-10',
      qcStatus: 'passed',
      qcInspectionId: 'QC-FIN-2024-001',
      storageLocation: 'FG-A-01',
      status: 'in_stock',
      reservedQuantity: 50,
      notes: 'Chất lượng tốt, đã qua kiểm tra cuối',
      createdAt: '2024-01-10T16:00:00Z',
      updatedAt: '2024-01-10T16:00:00Z',
      createdBy: 'WH-001',
      updatedBy: 'WH-001'
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

  const handleEdit = (record: FinishedGoods) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (record: FinishedGoods) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(data.filter(item => item.id !== record.id));
      message.success('Đã xóa bản ghi thành phẩm');
    } catch (error) {
      message.error('Không thể xóa bản ghi thành phẩm');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const formData = {
        ...values,
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
        message.success('Đã cập nhật thông tin thành phẩm');
      } else {
        const newRecord: FinishedGoods = {
          id: Date.now().toString(),
          lotNumber: `FG-LOT-${String(data.length + 1).padStart(3, '0')}`,
          ...formData
        };
        setData([newRecord, ...data]);
        message.success('Đã thêm thành phẩm mới');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<FinishedGoods> = [
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 120,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      width: 180,
    },
    {
      title: 'PO',
      dataIndex: 'poId',
      key: 'poId',
      width: 120,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'center',
      render: (value, record) => `${value} ${record.unit}`,
    },
    {
      title: 'QC',
      dataIndex: 'qcStatus',
      key: 'qcStatus',
      width: 100,
      render: (value) => (
        <Tag color={value === 'passed' ? 'success' : value === 'failed' ? 'error' : 'warning'}>
          {value === 'passed' ? 'Đạt' : value === 'failed' ? 'Không đạt' : 'Chờ'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value) => (
        <Tag color={value === 'in_stock' ? 'success' : value === 'reserved' ? 'warning' : 'default'}>
          {value === 'in_stock' ? 'Tồn kho' : 
           value === 'reserved' ? 'Đã đặt' : 
           value === 'shipped' ? 'Đã xuất' : value}
        </Tag>
      ),
    },
    {
      title: 'Vị trí',
      dataIndex: 'storageLocation',
      key: 'storageLocation',
      width: 100,
    },
  ];

  return (
    <div>
      <FormCard
        title="Thành phẩm tồn kho"
        subtitle="Bảng theo dõi thành phẩm tồn kho (F-WH-11-01)"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Thêm thành phẩm
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
            showTotal: (total) => `Tổng ${total} sản phẩm`,
          }}
        />
      </FormCard>

      <Modal
        title={editingRecord ? 'Chỉnh sửa thành phẩm' : 'Thêm thành phẩm mới'}
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
              name="productCode"
              label="Mã sản phẩm"
              rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm' }]}
            >
              <Input placeholder="Nhập mã sản phẩm" />
            </Form.Item>

            <Form.Item
              name="productName"
              label="Tên sản phẩm"
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>

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
              name="quantity"
              label="Số lượng"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
            >
              <InputNumber
                placeholder="Nhập số lượng"
                style={{ width: '100%' }}
                min={1}
              />
            </Form.Item>

            <Form.Item
              name="qcStatus"
              label="Trạng thái QC"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái QC' }]}
            >
              <Select placeholder="Chọn trạng thái QC">
                <Option value="pending">Chờ kiểm tra</Option>
                <Option value="passed">Đạt</Option>
                <Option value="failed">Không đạt</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="storageLocation"
              label="Vị trí lưu trữ"
              rules={[{ required: true, message: 'Vui lòng nhập vị trí lưu trữ' }]}
            >
              <Input placeholder="FG-A-01" />
            </Form.Item>
          </div>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <TextArea
              rows={3}
              placeholder="Nhập ghi chú về thành phẩm"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingRecord ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FinishedGoodsInventoryPage;