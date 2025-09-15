import React, { useState } from 'react';
import {
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Space,
  Popconfirm,
  message,
  Drawer,
  Descriptions,
  Switch,
  TimePicker,
  Row,
  Col,
  Select
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FilterOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title } = Typography;

interface ProcessStep {
  id: string;
  processName: string;
  startTime: string;
  endTime: string;
  inputQuantity: number;
  inputDate: string;
  outputQuantity: number;
  outputDate: string;
  employeeName: string;
  repairQuantity: number;
  rejectQuantity: number;
  goodPartQuantity: number;
  qlConfirm: boolean;
  qcConfirm: boolean;
  stepNote: string;
}

interface ProcessControlRecord {
  id: string;
  customer: string;
  drawingCode: string;
  rev: number;
  date: string;
  material: string;
  size: string;
  note: string;
  // Additional fields for drawer
  lotNumber: string;
  poNumber: string;
  processingQuantity: number;
  passedQuantity: number;
  deliveryQuantity: number;
  rejectQuantity: number;
  warehouseExportDate: string;
  deliveryDate: string;
  processSteps: ProcessStep[];
}

const { Option } = Select;

const ProcessControl: React.FC = () => {
  const [data, setData] = useState<ProcessControlRecord[]>([
    {
      id: '1',
      customer: 'Công ty TNHH Samsung Electronics',
      drawingCode: 'DWG-2024-001',
      rev: 3,
      date: '15/01/2024',
      material: 'Thép không gỉ 304',
      size: '100x50x20mm',
      note: 'Yêu cầu độ bóng cao',
      lotNumber: 'LOT-240115-001',
      poNumber: 'PO-SAM-2024-0001',
      processingQuantity: 1000,
      passedQuantity: 950,
      deliveryQuantity: 950,
      rejectQuantity: 50,
      warehouseExportDate: '16/01/2024',
      deliveryDate: '20/01/2024',
      processSteps: [
        {
          id: '1-1',
          processName: 'Cắt laser',
          startTime: '08:00',
          endTime: '12:00',
          inputQuantity: 1000,
          inputDate: '15/01/2024',
          outputQuantity: 1000,
          outputDate: '15/01/2024',
          employeeName: 'Nguyễn Văn A',
          repairQuantity: 0,
          rejectQuantity: 0,
          goodPartQuantity: 1000,
          qlConfirm: true,
          qcConfirm: true,
          stepNote: 'Cắt chính xác theo bản vẽ'
        },
        {
          id: '1-2',
          processName: 'Uốn dập',
          startTime: '13:00',
          endTime: '17:00',
          inputQuantity: 1000,
          inputDate: '15/01/2024',
          outputQuantity: 980,
          outputDate: '15/01/2024',
          employeeName: 'Trần Thị B',
          repairQuantity: 15,
          rejectQuantity: 5,
          goodPartQuantity: 980,
          qlConfirm: true,
          qcConfirm: true,
          stepNote: 'Một số sản phẩm bị nứt nhỏ'
        },
        {
          id: '1-3',
          processName: 'Đánh bóng',
          startTime: '08:00',
          endTime: '16:00',
          inputQuantity: 980,
          inputDate: '16/01/2024',
          outputQuantity: 950,
          outputDate: '16/01/2024',
          employeeName: 'Lê Văn C',
          repairQuantity: 0,
          rejectQuantity: 30,
          goodPartQuantity: 950,
          qlConfirm: true,
          qcConfirm: true,
          stepNote: 'Đạt độ bóng yêu cầu Ra 0.8'
        }
      ]
    },
    {
      id: '2',
      customer: 'Công ty CP Thaco Auto',
      drawingCode: 'DWG-2024-002',
      rev: 1,
      date: '18/01/2024',
      material: 'Nhôm 6061-T6',
      size: '200x100x15mm',
      note: 'Cần anodizing màu đen',
      lotNumber: 'LOT-240118-002',
      poNumber: 'PO-THACO-2024-0015',
      processingQuantity: 500,
      passedQuantity: 485,
      deliveryQuantity: 485,
      rejectQuantity: 15,
      warehouseExportDate: '19/01/2024',
      deliveryDate: '22/01/2024',
      processSteps: [
        {
          id: '2-1',
          processName: 'Phay CNC',
          startTime: '07:30',
          endTime: '15:30',
          inputQuantity: 500,
          inputDate: '18/01/2024',
          outputQuantity: 495,
          outputDate: '18/01/2024',
          employeeName: 'Phạm Văn D',
          repairQuantity: 0,
          rejectQuantity: 5,
          goodPartQuantity: 495,
          qlConfirm: true,
          qcConfirm: true,
          stepNote: 'Gia công chính xác theo tolerance'
        },
        {
          id: '2-2',
          processName: 'Anodizing',
          startTime: '08:00',
          endTime: '12:00',
          inputQuantity: 495,
          inputDate: '19/01/2024',
          outputQuantity: 485,
          outputDate: '19/01/2024',
          employeeName: 'Hoàng Thị E',
          repairQuantity: 0,
          rejectQuantity: 10,
          goodPartQuantity: 485,
          qlConfirm: true,
          qcConfirm: true,
          stepNote: 'Màu đen đồng đều, độ dày lớp phủ đạt yêu cầu'
        }
      ]
    },
    {
      id: '3',
      customer: 'Công ty TNHH LG Display',
      drawingCode: 'DWG-2024-003',
      rev: 2,
      date: '20/01/2024',
      material: 'Đồng C11000',
      size: '80x40x5mm',
      note: 'Yêu cầu độ phẳng cao',
      lotNumber: 'LOT-240120-003',
      poNumber: 'PO-LG-2024-0008',
      processingQuantity: 2000,
      passedQuantity: 1950,
      deliveryQuantity: 1950,
      rejectQuantity: 50,
      warehouseExportDate: '21/01/2024',
      deliveryDate: '25/01/2024',
      processSteps: [
        {
          id: '3-1',
          processName: 'Cắt dây',
          startTime: '08:00',
          endTime: '11:00',
          inputQuantity: 2000,
          inputDate: '20/01/2024',
          outputQuantity: 2000,
          outputDate: '20/01/2024',
          employeeName: 'Vũ Văn F',
          repairQuantity: 0,
          rejectQuantity: 0,
          goodPartQuantity: 2000,
          qlConfirm: true,
          qcConfirm: true,
          stepNote: 'Cắt sạch, không có burr'
        },
        {
          id: '3-2',
          processName: 'Dập phẳng',
          startTime: '13:00',
          endTime: '16:00',
          inputQuantity: 2000,
          inputDate: '20/01/2024',
          outputQuantity: 1980,
          outputDate: '20/01/2024',
          employeeName: 'Đỗ Thị G',
          repairQuantity: 10,
          rejectQuantity: 10,
          goodPartQuantity: 1980,
          qlConfirm: true,
          qcConfirm: true,
          stepNote: 'Độ phẳng đạt 0.05mm'
        },
        {
          id: '3-3',
          processName: 'Kiểm tra cuối',
          startTime: '08:00',
          endTime: '10:00',
          inputQuantity: 1980,
          inputDate: '21/01/2024',
          outputQuantity: 1950,
          outputDate: '21/01/2024',
          employeeName: 'Ngô Văn H',
          repairQuantity: 0,
          rejectQuantity: 30,
          goodPartQuantity: 1950,
          qlConfirm: true,
          qcConfirm: true,
          stepNote: 'Kiểm tra kích thước và độ phẳng'
        }
      ]
    },
    {
      id: '4',
      customer: 'Công ty CP Vinfast',
      drawingCode: 'DWG-2024-004',
      rev: 4,
      date: '22/01/2024',
      material: 'Thép carbon S45C',
      size: '150x75x30mm',
      note: 'Cần nhiệt luyện HRC 45-50',
      lotNumber: 'LOT-240122-004',
      poNumber: 'PO-VF-2024-0025',
      processingQuantity: 800,
      passedQuantity: 760,
      deliveryQuantity: 760,
      rejectQuantity: 40,
      warehouseExportDate: '24/01/2024',
      deliveryDate: '28/01/2024',
      processSteps: [
        {
          id: '4-1',
          processName: 'Tiện thô',
          startTime: '07:00',
          endTime: '12:00',
          inputQuantity: 800,
          inputDate: '22/01/2024',
          outputQuantity: 800,
          outputDate: '22/01/2024',
          employeeName: 'Bùi Văn I',
          repairQuantity: 0,
          rejectQuantity: 0,
          goodPartQuantity: 800,
          qlConfirm: true,
          qcConfirm: true,
          stepNote: 'Tiện để dư 2mm cho gia công tinh'
        },
        {
          id: '4-2',
          processName: 'Nhiệt luyện',
          startTime: '13:00',
          endTime: '18:00',
          inputQuantity: 800,
          inputDate: '22/01/2024',
          outputQuantity: 790,
          outputDate: '23/01/2024',
          employeeName: 'Cao Thị K',
          repairQuantity: 0,
          rejectQuantity: 10,
          goodPartQuantity: 790,
          qlConfirm: true,
          qcConfirm: true,
          stepNote: 'Đạt độ cứng HRC 47, một số bị cong vênh'
        },
        {
          id: '4-3',
          processName: 'Tiện tinh',
          startTime: '08:00',
          endTime: '15:00',
          inputQuantity: 790,
          inputDate: '23/01/2024',
          outputQuantity: 760,
          outputDate: '24/01/2024',
          employeeName: 'Lý Văn L',
          repairQuantity: 0,
          rejectQuantity: 30,
          goodPartQuantity: 760,
          qlConfirm: true,
          qcConfirm: false,
          stepNote: 'Đạt kích thước yêu cầu, chờ QC xác nhận lại'
        }
      ]
    }
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ProcessControlRecord | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ProcessControlRecord | null>(null);
  const [isDrawerEditing, setIsDrawerEditing] = useState(false);
  const [editingProcessStep, setEditingProcessStep] = useState<ProcessStep | null>(null);
  const [isProcessStepModalVisible, setIsProcessStepModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [processStepForm] = Form.useForm();

  // Filter states
  const [searchText, setSearchText] = useState<string>('');
  const [customerFilter, setCustomerFilter] = useState<string | undefined>(undefined);
  const [materialFilter, setMaterialFilter] = useState<string | undefined>(undefined);
  const [filteredData, setFilteredData] = useState<ProcessControlRecord[]>(data);
  const [appliedSearchText, setAppliedSearchText] = useState<string>('');
  const [appliedCustomerFilter, setAppliedCustomerFilter] = useState<string | undefined>(undefined);
  const [appliedMaterialFilter, setAppliedMaterialFilter] = useState<string | undefined>(undefined);

  // Filter effect
  React.useEffect(() => {
    let filtered = [...data];

    // Text search across multiple fields
    if (appliedSearchText.trim()) {
      const searchLower = appliedSearchText.toLowerCase().trim();
      filtered = filtered.filter(item =>
        item.customer?.toLowerCase().includes(searchLower) ||
        item.drawingCode?.toLowerCase().includes(searchLower) ||
        item.lotNumber?.toLowerCase().includes(searchLower) ||
        item.poNumber?.toLowerCase().includes(searchLower) ||
        item.material?.toLowerCase().includes(searchLower)
      );
    }

    // Customer filter
    if (appliedCustomerFilter) {
      filtered = filtered.filter(item => item.customer === appliedCustomerFilter);
    }

    // Material filter
    if (appliedMaterialFilter) {
      filtered = filtered.filter(item => item.material === appliedMaterialFilter);
    }

    setFilteredData(filtered);
  }, [data, appliedSearchText, appliedCustomerFilter, appliedMaterialFilter]);

  // Filter handlers
  const handleSearch = () => {
    setAppliedSearchText(searchText);
    setAppliedCustomerFilter(customerFilter);
    setAppliedMaterialFilter(materialFilter);
  };

  const handleResetSearch = () => {
    setSearchText('');
    setCustomerFilter(undefined);
    setMaterialFilter(undefined);
    setAppliedSearchText('');
    setAppliedCustomerFilter(undefined);
    setAppliedMaterialFilter(undefined);
  };

  const getFilterCount = () => {
    let count = 0;
    if (appliedSearchText) count++;
    if (appliedCustomerFilter) count++;
    if (appliedMaterialFilter) count++;
    return count;
  };

  // Get unique values for filters
  const uniqueCustomers = [...new Set(data.map(item => item.customer))];
  const uniqueMaterials = [...new Set(data.map(item => item.material))];

  const columns: ColumnsType<ProcessControlRecord> = [
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      width: 150,
    },
    {
      title: 'Mã bản vẽ',
      dataIndex: 'drawingCode',
      key: 'drawingCode',
      width: 120,
    },
    {
      title: 'REV',
      dataIndex: 'rev',
      key: 'rev',
      width: 80,
      align: 'center',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      align: 'center',
    },
    {
      title: 'Vật liệu',
      dataIndex: 'material',
      key: 'material',
      width: 120,
    },
    {
      title: 'Kích thước',
      dataIndex: 'size',
      key: 'size',
      width: 120,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 150,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
            size="small"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDelete(record.id);
            }}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              size="small"
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleRowClick = (record: ProcessControlRecord) => {
    setSelectedRecord(record);
    setIsDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerVisible(false);
    setSelectedRecord(null);
    setIsDrawerEditing(false);
  };

  const handleDrawerEdit = () => {
    setIsDrawerEditing(true);
  };

  const handleDrawerSave = () => {
    if (selectedRecord) {
      setData(data.map(item =>
        item.id === selectedRecord.id ? selectedRecord : item
      ));
      setIsDrawerEditing(false);
      message.success('Cập nhật thành công!');
    }
  };

  const handleDrawerCancel = () => {
    setIsDrawerEditing(false);
    // Reset selectedRecord to original data
    const originalRecord = data.find(item => item.id === selectedRecord?.id);
    if (originalRecord) {
      setSelectedRecord(originalRecord);
    }
  };

  // Process Step handlers
  const handleAddProcessStep = () => {
    setEditingProcessStep(null);
    processStepForm.resetFields();
    setIsProcessStepModalVisible(true);
  };

  const handleEditProcessStep = (step: ProcessStep) => {
    setEditingProcessStep(step);
    processStepForm.setFieldsValue({
      ...step,
      startTime: step.startTime ? dayjs(step.startTime, 'HH:mm') : null,
      endTime: step.endTime ? dayjs(step.endTime, 'HH:mm') : null,
      inputDate: step.inputDate ? dayjs(step.inputDate, 'DD/MM/YYYY') : null,
      outputDate: step.outputDate ? dayjs(step.outputDate, 'DD/MM/YYYY') : null,
    });
    setIsProcessStepModalVisible(true);
  };

  const handleDeleteProcessStep = (stepId: string) => {
    if (selectedRecord) {
      const updatedSteps = selectedRecord.processSteps.filter(step => step.id !== stepId);
      setSelectedRecord({
        ...selectedRecord,
        processSteps: updatedSteps
      });
      message.success('Xóa công đoạn thành công!');
    } else if (editingRecord) {
      const updatedSteps = editingRecord.processSteps.filter(step => step.id !== stepId);
      setEditingRecord({
        ...editingRecord,
        processSteps: updatedSteps
      });
      message.success('Xóa công đoạn thành công!');
    }
  };

  const handleProcessStepModalOk = async () => {
    try {
      const values = await processStepForm.validateFields();
      const formattedStartTime = values.startTime ? values.startTime.format('HH:mm') : '';
      const formattedEndTime = values.endTime ? values.endTime.format('HH:mm') : '';
      const formattedInputDate = values.inputDate ? values.inputDate.format('DD/MM/YYYY') : '';
      const formattedOutputDate = values.outputDate ? values.outputDate.format('DD/MM/YYYY') : '';

      if (selectedRecord) {
        if (editingProcessStep) {
          // Update existing step
          const updatedSteps = selectedRecord.processSteps.map(step =>
            step.id === editingProcessStep.id
              ? {
                  ...step,
                  ...values,
                  startTime: formattedStartTime,
                  endTime: formattedEndTime,
                  inputDate: formattedInputDate,
                  outputDate: formattedOutputDate
                }
              : step
          );
          setSelectedRecord({
            ...selectedRecord,
            processSteps: updatedSteps
          });
          message.success('Cập nhật công đoạn thành công!');
        } else {
          // Add new step
          const newStep: ProcessStep = {
            id: `${selectedRecord.id}-${Date.now()}`,
            ...values,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            inputDate: formattedInputDate,
            outputDate: formattedOutputDate,
          };
          setSelectedRecord({
            ...selectedRecord,
            processSteps: [...selectedRecord.processSteps, newStep]
          });
          message.success('Thêm công đoạn thành công!');
        }
      } else if (editingRecord) {
        // Handle case when editing from main modal
        if (editingProcessStep) {
          // Update existing step
          const updatedSteps = editingRecord.processSteps.map(step =>
            step.id === editingProcessStep.id
              ? {
                  ...step,
                  ...values,
                  startTime: formattedStartTime,
                  endTime: formattedEndTime,
                  inputDate: formattedInputDate,
                  outputDate: formattedOutputDate
                }
              : step
          );
          setEditingRecord({
            ...editingRecord,
            processSteps: updatedSteps
          });
          message.success('Cập nhật công đoạn thành công!');
        } else {
          // Add new step
          const newStep: ProcessStep = {
            id: `${editingRecord.id}-${Date.now()}`,
            ...values,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            inputDate: formattedInputDate,
            outputDate: formattedOutputDate,
          };
          setEditingRecord({
            ...editingRecord,
            processSteps: [...(editingRecord.processSteps || []), newStep]
          });
          message.success('Thêm công đoạn thành công!');
        }
      }

      setIsProcessStepModalVisible(false);
      processStepForm.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleProcessStepModalCancel = () => {
    setIsProcessStepModalVisible(false);
    processStepForm.resetFields();
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: ProcessControlRecord) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      date: record.date ? dayjs(record.date, 'DD/MM/YYYY') : null,
      warehouseExportDate: record.warehouseExportDate ? dayjs(record.warehouseExportDate, 'DD/MM/YYYY') : null,
      deliveryDate: record.deliveryDate ? dayjs(record.deliveryDate, 'DD/MM/YYYY') : null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id));
    message.success('Xóa thành công!');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const formattedDate = values.date ? values.date.format('DD/MM/YYYY') : '';
      const formattedWarehouseExportDate = values.warehouseExportDate ? values.warehouseExportDate.format('DD/MM/YYYY') : '';
      const formattedDeliveryDate = values.deliveryDate ? values.deliveryDate.format('DD/MM/YYYY') : '';

      if (editingRecord) {
        // Update existing record
        setData(data.map(item =>
          item.id === editingRecord.id
            ? {
                ...item,
                ...values,
                date: formattedDate,
                warehouseExportDate: formattedWarehouseExportDate,
                deliveryDate: formattedDeliveryDate,
                processSteps: editingRecord.processSteps // Keep existing process steps
              }
            : item
        ));
        message.success('Cập nhật thành công!');
      } else {
        // Add new record
        const newRecord: ProcessControlRecord = {
          id: Date.now().toString(),
          ...values,
          date: formattedDate,
          warehouseExportDate: formattedWarehouseExportDate,
          deliveryDate: formattedDeliveryDate,
          // Default values for fields not in form
          lotNumber: values.lotNumber || '',
          poNumber: values.poNumber || '',
          processingQuantity: values.processingQuantity || 0,
          passedQuantity: values.passedQuantity || 0,
          deliveryQuantity: values.deliveryQuantity || 0,
          rejectQuantity: values.rejectQuantity || 0,
          processSteps: [],
        };
        setData([...data, newRecord]);
        message.success('Thêm mới thành công!');
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingRecord(null);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
      {/* Header */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontSize: '18px' }}>Phiếu kiểm soát công đoạn (F-TN-01-01)</Title>
          <div style={{ fontSize: '11px', color: '#666', marginTop: 4 }}>
            Production - Quản lý phiếu kiểm soát công đoạn
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          size="small"
        >
          Thêm mới
        </Button>
      </div>

      {/* Filter Section */}
      <div style={{
        marginBottom: 16,
        padding: '12px',
        backgroundColor: '#fafafa',
        borderRadius: '6px',
        border: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Input
            placeholder="Tìm kiếm theo khách hàng, mã bản vẽ, số lô, số PO, vật liệu..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ flex: 1, minWidth: 300, maxWidth: 400 }}
            prefix={<FilterOutlined style={{ color: '#bfbfbf' }} />}
            allowClear
            size="small"
          />

          <Select
            placeholder="Khách hàng"
            value={customerFilter}
            onChange={setCustomerFilter}
            style={{ width: 200 }}
            allowClear
            size="small"
          >
            {uniqueCustomers.map(customer => (
              <Option key={customer} value={customer}>{customer}</Option>
            ))}
          </Select>

          <Select
            placeholder="Vật liệu"
            value={materialFilter}
            onChange={setMaterialFilter}
            style={{ width: 150 }}
            allowClear
            size="small"
          >
            {uniqueMaterials.map(material => (
              <Option key={material} value={material}>{material}</Option>
            ))}
          </Select>

          <Space>
            <Button
              type="primary"
              onClick={handleSearch}
              disabled={!searchText && !customerFilter && !materialFilter}
              size="small"
            >
              Tìm kiếm
            </Button>

            <Button
              onClick={handleResetSearch}
              disabled={!appliedSearchText && !appliedCustomerFilter && !appliedMaterialFilter}
              size="small"
            >
              Xóa bộ lọc
            </Button>

            {getFilterCount() > 0 && (
              <span style={{
                fontSize: '10px',
                color: '#666',
                backgroundColor: '#e6f7ff',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid #91d5ff'
              }}>
                {getFilterCount()} bộ lọc | {filteredData.length} kết quả
              </span>
            )}
          </Space>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        size="small"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
          size: 'small'
        }}
        scroll={{ x: 1000 }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer' },
        })}
      />

      <Modal
        title={editingRecord ? 'Chỉnh sửa phiếu kiểm soát công đoạn' : 'Thêm mới phiếu kiểm soát công đoạn'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={1400}
        okText={editingRecord ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        style={{ top: 20, fontSize: '11px' }}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          {/* Basic Information */}
          <Typography.Title level={5}>Thông tin cơ bản</Typography.Title>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="customer"
                label="Khách hàng"
                rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
              >
                <Input placeholder="Nhập tên khách hàng" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="drawingCode"
                label="Mã bản vẽ"
                rules={[{ required: true, message: 'Vui lòng nhập mã bản vẽ!' }]}
              >
                <Input placeholder="Nhập mã bản vẽ" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="rev"
                label="REV"
                rules={[{ required: true, message: 'Vui lòng nhập số REV!' }]}
              >
                <InputNumber
                  placeholder="Nhập số REV"
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
              >
                <DatePicker
                  placeholder="Chọn ngày"
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="material"
                label="Vật liệu"
                rules={[{ required: true, message: 'Vui lòng nhập vật liệu!' }]}
              >
                <Input placeholder="Nhập vật liệu" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="size"
                label="Kích thước"
                rules={[{ required: true, message: 'Vui lòng nhập kích thước!' }]}
              >
                <Input placeholder="Nhập kích thước" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="note"
            label="Ghi chú"
          >
            <Input.TextArea
              placeholder="Nhập ghi chú (tùy chọn)"
              rows={2}
            />
          </Form.Item>

          {/* Additional Information */}
          <Typography.Title level={5} style={{ marginTop: 24 }}>Thông tin bổ sung</Typography.Title>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="lotNumber" label="Số lô">
                <Input placeholder="Nhập số lô" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="poNumber" label="Số PO">
                <Input placeholder="Nhập số PO" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="processingQuantity" label="Số lượng gia công">
                <InputNumber placeholder="0" style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="passedQuantity" label="Số lượng Passed">
                <InputNumber placeholder="0" style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="deliveryQuantity" label="Số lượng giao hàng">
                <InputNumber placeholder="0" style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="rejectQuantity" label="Số lượng Reject">
                <InputNumber placeholder="0" style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="warehouseExportDate" label="Ngày xuất kho">
                <DatePicker
                  placeholder="Chọn ngày"
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="deliveryDate" label="Ngày giao hàng">
                <DatePicker
                  placeholder="Chọn ngày"
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Process Steps Table */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Typography.Title level={5} style={{ margin: 0 }}>Chi tiết công đoạn</Typography.Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddProcessStep}
                size="small"
              >
                Thêm công đoạn
              </Button>
            </div>

            <Table
              dataSource={editingRecord?.processSteps || []}
              rowKey="id"
              pagination={false}
              scroll={{ x: 1200 }}
              size="small"
              bordered
              onRow={(record) => ({
                onClick: () => handleEditProcessStep(record),
                style: { cursor: 'pointer' },
              })}
              columns={[
                {
                  title: 'Tên công đoạn',
                  dataIndex: 'processName',
                  key: 'processName',
                  width: 120,
                },
                {
                  title: 'Thời gian',
                  children: [
                    {
                      title: 'Bắt đầu',
                      dataIndex: 'startTime',
                      key: 'startTime',
                      width: 80,
                    },
                    {
                      title: 'Kết thúc',
                      dataIndex: 'endTime',
                      key: 'endTime',
                      width: 80,
                    },
                  ],
                },
                {
                  title: 'Đầu vào',
                  children: [
                    {
                      title: 'SL',
                      dataIndex: 'inputQuantity',
                      key: 'inputQuantity',
                      width: 60,
                      align: 'center',
                    },
                    {
                      title: 'Ngày',
                      dataIndex: 'inputDate',
                      key: 'inputDate',
                      width: 90,
                    },
                  ],
                },
                {
                  title: 'Đầu ra',
                  children: [
                    {
                      title: 'SL',
                      dataIndex: 'outputQuantity',
                      key: 'outputQuantity',
                      width: 60,
                      align: 'center',
                    },
                    {
                      title: 'Ngày',
                      dataIndex: 'outputDate',
                      key: 'outputDate',
                      width: 90,
                    },
                  ],
                },
                {
                  title: 'Nhân viên',
                  dataIndex: 'employeeName',
                  key: 'employeeName',
                  width: 100,
                },
                {
                  title: 'Lỗi',
                  children: [
                    {
                      title: 'Sửa',
                      dataIndex: 'repairQuantity',
                      key: 'repairQuantity',
                      width: 50,
                      align: 'center',
                    },
                    {
                      title: 'Loại',
                      dataIndex: 'rejectQuantity',
                      key: 'rejectQuantity',
                      width: 50,
                      align: 'center',
                    },
                  ],
                },
                {
                  title: 'Good',
                  dataIndex: 'goodPartQuantity',
                  key: 'goodPartQuantity',
                  width: 60,
                  align: 'center',
                },
                {
                  title: 'QL',
                  dataIndex: 'qlConfirm',
                  key: 'qlConfirm',
                  width: 50,
                  align: 'center',
                  render: (value: boolean) => value ? '✓' : '✗',
                },
                {
                  title: 'QC',
                  dataIndex: 'qcConfirm',
                  key: 'qcConfirm',
                  width: 50,
                  align: 'center',
                  render: (value: boolean) => value ? '✓' : '✗',
                },
                {
                  title: 'Thao tác',
                  key: 'action',
                  width: 80,
                  align: 'center',
                  render: (_, record) => (
                    <Space size="small">
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProcessStep(record);
                        }}
                        size="small"
                      />
                      <Popconfirm
                        title="Xóa công đoạn?"
                        onConfirm={(e) => {
                          e?.stopPropagation();
                          handleDeleteProcessStep(record.id);
                        }}
                        okText="Có"
                        cancelText="Không"
                      >
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          danger
                          size="small"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Popconfirm>
                    </Space>
                  ),
                },
              ]}
            />

            {(!editingRecord?.processSteps || editingRecord.processSteps.length === 0) && (
              <div style={{ textAlign: 'center', padding: '20px', color: '#999', border: '1px dashed #d9d9d9' }}>
                Chưa có công đoạn nào. Click "Thêm công đoạn" để bắt đầu.
              </div>
            )}
          </div>
        </Form>
      </Modal>

      {/* Process Step Modal */}
      <Modal
        title={editingProcessStep ? 'Chỉnh sửa công đoạn' : 'Thêm công đoạn mới'}
        open={isProcessStepModalVisible}
        onOk={handleProcessStepModalOk}
        onCancel={handleProcessStepModalCancel}
        width={800}
        okText={editingProcessStep ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        style={{ fontSize: '11px' }}
      >
        <Form
          form={processStepForm}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="processName"
                label="Tên công đoạn"
                rules={[{ required: true, message: 'Vui lòng nhập tên công đoạn!' }]}
              >
                <Input placeholder="Nhập tên công đoạn" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="employeeName"
                label="Tên nhân viên"
                rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
              >
                <Input placeholder="Nhập tên nhân viên" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startTime"
                label="Thời gian bắt đầu"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian bắt đầu!' }]}
              >
                <TimePicker
                  placeholder="Chọn thời gian"
                  style={{ width: '100%' }}
                  format="HH:mm"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endTime"
                label="Thời gian kết thúc"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian kết thúc!' }]}
              >
                <TimePicker
                  placeholder="Chọn thời gian"
                  style={{ width: '100%' }}
                  format="HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="inputQuantity"
                label="Số lượng đầu vào"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
              >
                <InputNumber
                  placeholder="0"
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="inputDate"
                label="Ngày đầu vào"
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
              >
                <DatePicker
                  placeholder="Chọn ngày"
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="outputQuantity"
                label="Số lượng đầu ra"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
              >
                <InputNumber
                  placeholder="0"
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="outputDate"
                label="Ngày đầu ra"
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
              >
                <DatePicker
                  placeholder="Chọn ngày"
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="repairQuantity"
                label="Số lượng sửa chữa"
              >
                <InputNumber
                  placeholder="0"
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="rejectQuantity"
                label="Số lượng loại bỏ"
              >
                <InputNumber
                  placeholder="0"
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="goodPartQuantity"
                label="Số lượng part good"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
              >
                <InputNumber
                  placeholder="0"
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="qlConfirm"
                label="QL xác nhận"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="qcConfirm"
                label="QC xác nhận"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="stepNote"
            label="Ghi chú"
          >
            <Input.TextArea
              placeholder="Nhập ghi chú (tùy chọn)"
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Thông tin chi tiết - Phiếu kiểm soát công đoạn</span>
            {!isDrawerEditing && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleDrawerEdit}
                size="small"
              >
                Chỉnh sửa
              </Button>
            )}
            {isDrawerEditing && (
              <Space>
                <Button onClick={handleDrawerCancel} size="small">
                  Hủy
                </Button>
                <Button type="primary" onClick={handleDrawerSave} size="small">
                  Lưu
                </Button>
              </Space>
            )}
          </div>
        }
        placement="right"
        onClose={handleDrawerClose}
        open={isDrawerVisible}
        width="50%"
        style={{ fontSize: '11px' }}
      >
        {selectedRecord && (
          <div>
            {!isDrawerEditing ? (
              // View Mode
              <div>
                {/* Basic Information */}
                <Typography.Title level={5}>Thông tin cơ bản</Typography.Title>
                <Descriptions column={2} bordered style={{ marginBottom: 24 }}>
                  <Descriptions.Item label="Khách hàng">
                    {selectedRecord.customer}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mã bản vẽ">
                    {selectedRecord.drawingCode}
                  </Descriptions.Item>
                  <Descriptions.Item label="REV">
                    {selectedRecord.rev}
                  </Descriptions.Item>
                  <Descriptions.Item label="Date">
                    {selectedRecord.date}
                  </Descriptions.Item>
                  <Descriptions.Item label="Vật liệu">
                    {selectedRecord.material}
                  </Descriptions.Item>
                  <Descriptions.Item label="Kích thước">
                    {selectedRecord.size}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ghi chú" span={2}>
                    {selectedRecord.note || 'Không có ghi chú'}
                  </Descriptions.Item>
                </Descriptions>

                {/* Additional Information */}
                <Typography.Title level={5}>Thông tin bổ sung</Typography.Title>
                <Descriptions column={2} bordered style={{ marginBottom: 24 }}>
                  <Descriptions.Item label="Số lô">
                    {selectedRecord.lotNumber || 'Chưa cập nhật'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số PO">
                    {selectedRecord.poNumber || 'Chưa cập nhật'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số lượng gia công">
                    {selectedRecord.processingQuantity || 0}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số lượng Passed">
                    {selectedRecord.passedQuantity || 0}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số lượng giao hàng">
                    {selectedRecord.deliveryQuantity || 0}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số lượng Reject">
                    {selectedRecord.rejectQuantity || 0}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày xuất kho">
                    {selectedRecord.warehouseExportDate || 'Chưa cập nhật'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày giao hàng">
                    {selectedRecord.deliveryDate || 'Chưa cập nhật'}
                  </Descriptions.Item>
                </Descriptions>

                {/* Process Steps Table */}
                <Typography.Title level={5}>Chi tiết công đoạn</Typography.Title>
                <Table
                  dataSource={selectedRecord.processSteps || []}
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: 1200 }}
                  size="small"
                  bordered
                  onRow={(record) => ({
                    onClick: () => handleEditProcessStep(record),
                    style: { cursor: 'pointer' },
                  })}
                  columns={[
                    {
                      title: 'Tên công đoạn',
                      dataIndex: 'processName',
                      key: 'processName',
                      width: 100,
                    },
                    {
                      title: 'Thời gian',
                      children: [
                        {
                          title: 'Bắt đầu',
                          dataIndex: 'startTime',
                          key: 'startTime',
                          width: 70,
                        },
                        {
                          title: 'Kết thúc',
                          dataIndex: 'endTime',
                          key: 'endTime',
                          width: 70,
                        },
                      ],
                    },
                    {
                      title: 'Đầu vào',
                      children: [
                        {
                          title: 'SL',
                          dataIndex: 'inputQuantity',
                          key: 'inputQuantity',
                          width: 50,
                          align: 'center',
                        },
                        {
                          title: 'Ngày',
                          dataIndex: 'inputDate',
                          key: 'inputDate',
                          width: 80,
                        },
                      ],
                    },
                    {
                      title: 'Đầu ra',
                      children: [
                        {
                          title: 'SL',
                          dataIndex: 'outputQuantity',
                          key: 'outputQuantity',
                          width: 50,
                          align: 'center',
                        },
                        {
                          title: 'Ngày',
                          dataIndex: 'outputDate',
                          key: 'outputDate',
                          width: 80,
                        },
                      ],
                    },
                    {
                      title: 'Nhân viên',
                      dataIndex: 'employeeName',
                      key: 'employeeName',
                      width: 90,
                    },
                    {
                      title: 'Lỗi',
                      children: [
                        {
                          title: 'Sửa',
                          dataIndex: 'repairQuantity',
                          key: 'repairQuantity',
                          width: 40,
                          align: 'center',
                        },
                        {
                          title: 'Loại',
                          dataIndex: 'rejectQuantity',
                          key: 'rejectQuantity',
                          width: 40,
                          align: 'center',
                        },
                      ],
                    },
                    {
                      title: 'Good',
                      dataIndex: 'goodPartQuantity',
                      key: 'goodPartQuantity',
                      width: 50,
                      align: 'center',
                    },
                    {
                      title: 'QL',
                      dataIndex: 'qlConfirm',
                      key: 'qlConfirm',
                      width: 40,
                      align: 'center',
                      render: (value: boolean) => value ? '✓' : '✗',
                    },
                    {
                      title: 'QC',
                      dataIndex: 'qcConfirm',
                      key: 'qcConfirm',
                      width: 40,
                      align: 'center',
                      render: (value: boolean) => value ? '✓' : '✗',
                    },
                    ...(isDrawerEditing ? [{
                      title: 'Thao tác',
                      key: 'action',
                      width: 80,
                      align: 'center' as const,
                      render: (_: any, record: ProcessStep) => (
                        <Space size="small">
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProcessStep(record);
                            }}
                            size="small"
                          />
                          <Popconfirm
                            title="Xóa công đoạn?"
                            onConfirm={(e) => {
                              e?.stopPropagation();
                              handleDeleteProcessStep(record.id);
                            }}
                            okText="Có"
                            cancelText="Không"
                          >
                            <Button
                              type="text"
                              icon={<DeleteOutlined />}
                              danger
                              size="small"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Popconfirm>
                        </Space>
                      ),
                    }] : []),
                  ]}
                />

                {selectedRecord.processSteps?.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                    Chưa có dữ liệu công đoạn
                  </div>
                )}
              </div>
            ) : (
              // Edit Mode
              <div>
                <Typography.Title level={5}>Chỉnh sửa thông tin</Typography.Title>
                <Form layout="vertical">
                  {/* Basic Information */}
                  <Typography.Title level={5}>Thông tin cơ bản</Typography.Title>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Khách hàng">
                        <Input
                          value={selectedRecord.customer}
                          onChange={(e) => setSelectedRecord({...selectedRecord, customer: e.target.value})}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Mã bản vẽ">
                        <Input
                          value={selectedRecord.drawingCode}
                          onChange={(e) => setSelectedRecord({...selectedRecord, drawingCode: e.target.value})}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="REV">
                        <InputNumber
                          value={selectedRecord.rev}
                          onChange={(value) => setSelectedRecord({...selectedRecord, rev: value || 0})}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="Vật liệu">
                        <Input
                          value={selectedRecord.material}
                          onChange={(e) => setSelectedRecord({...selectedRecord, material: e.target.value})}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="Kích thước">
                        <Input
                          value={selectedRecord.size}
                          onChange={(e) => setSelectedRecord({...selectedRecord, size: e.target.value})}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Additional Information */}
                  <Typography.Title level={5} style={{ marginTop: 24 }}>Thông tin bổ sung</Typography.Title>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Số lô">
                        <Input
                          value={selectedRecord.lotNumber}
                          onChange={(e) => setSelectedRecord({...selectedRecord, lotNumber: e.target.value})}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Số PO">
                        <Input
                          value={selectedRecord.poNumber}
                          onChange={(e) => setSelectedRecord({...selectedRecord, poNumber: e.target.value})}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Số lượng gia công">
                        <InputNumber
                          value={selectedRecord.processingQuantity}
                          onChange={(value) => setSelectedRecord({...selectedRecord, processingQuantity: value || 0})}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Số lượng Passed">
                        <InputNumber
                          value={selectedRecord.passedQuantity}
                          onChange={(value) => setSelectedRecord({...selectedRecord, passedQuantity: value || 0})}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Số lượng giao hàng">
                        <InputNumber
                          value={selectedRecord.deliveryQuantity}
                          onChange={(value) => setSelectedRecord({...selectedRecord, deliveryQuantity: value || 0})}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Số lượng Reject">
                        <InputNumber
                          value={selectedRecord.rejectQuantity}
                          onChange={(value) => setSelectedRecord({...selectedRecord, rejectQuantity: value || 0})}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Process Steps Table with Add button */}
                  <div style={{ marginTop: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <Typography.Title level={5} style={{ margin: 0 }}>Chi tiết công đoạn</Typography.Title>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddProcessStep}
                        size="small"
                      >
                        Thêm công đoạn
                      </Button>
                    </div>

                    <Table
                      dataSource={selectedRecord.processSteps || []}
                      rowKey="id"
                      pagination={false}
                      scroll={{ x: 1200 }}
                      size="small"
                      bordered
                      onRow={(record) => ({
                        onClick: () => handleEditProcessStep(record),
                        style: { cursor: 'pointer' },
                      })}
                      columns={[
                        {
                          title: 'Tên công đoạn',
                          dataIndex: 'processName',
                          key: 'processName',
                          width: 100,
                        },
                        {
                          title: 'Thời gian',
                          children: [
                            {
                              title: 'Bắt đầu',
                              dataIndex: 'startTime',
                              key: 'startTime',
                              width: 70,
                            },
                            {
                              title: 'Kết thúc',
                              dataIndex: 'endTime',
                              key: 'endTime',
                              width: 70,
                            },
                          ],
                        },
                        {
                          title: 'Đầu vào',
                          children: [
                            {
                              title: 'SL',
                              dataIndex: 'inputQuantity',
                              key: 'inputQuantity',
                              width: 50,
                              align: 'center',
                            },
                            {
                              title: 'Ngày',
                              dataIndex: 'inputDate',
                              key: 'inputDate',
                              width: 80,
                            },
                          ],
                        },
                        {
                          title: 'Đầu ra',
                          children: [
                            {
                              title: 'SL',
                              dataIndex: 'outputQuantity',
                              key: 'outputQuantity',
                              width: 50,
                              align: 'center',
                            },
                            {
                              title: 'Ngày',
                              dataIndex: 'outputDate',
                              key: 'outputDate',
                              width: 80,
                            },
                          ],
                        },
                        {
                          title: 'Nhân viên',
                          dataIndex: 'employeeName',
                          key: 'employeeName',
                          width: 90,
                        },
                        {
                          title: 'Lỗi',
                          children: [
                            {
                              title: 'Sửa',
                              dataIndex: 'repairQuantity',
                              key: 'repairQuantity',
                              width: 40,
                              align: 'center',
                            },
                            {
                              title: 'Loại',
                              dataIndex: 'rejectQuantity',
                              key: 'rejectQuantity',
                              width: 40,
                              align: 'center',
                            },
                          ],
                        },
                        {
                          title: 'Good',
                          dataIndex: 'goodPartQuantity',
                          key: 'goodPartQuantity',
                          width: 50,
                          align: 'center',
                        },
                        {
                          title: 'QL',
                          dataIndex: 'qlConfirm',
                          key: 'qlConfirm',
                          width: 40,
                          align: 'center',
                          render: (value: boolean) => value ? '✓' : '✗',
                        },
                        {
                          title: 'QC',
                          dataIndex: 'qcConfirm',
                          key: 'qcConfirm',
                          width: 40,
                          align: 'center',
                          render: (value: boolean) => value ? '✓' : '✗',
                        },
                        {
                          title: 'Thao tác',
                          key: 'action',
                          width: 80,
                          align: 'center' as const,
                          render: (_: any, record: ProcessStep) => (
                            <Space size="small">
                              <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditProcessStep(record);
                                }}
                                size="small"
                              />
                              <Popconfirm
                                title="Xóa công đoạn?"
                                onConfirm={(e) => {
                                  e?.stopPropagation();
                                  handleDeleteProcessStep(record.id);
                                }}
                                okText="Có"
                                cancelText="Không"
                              >
                                <Button
                                  type="text"
                                  icon={<DeleteOutlined />}
                                  danger
                                  size="small"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </Popconfirm>
                            </Space>
                          ),
                        },
                      ]}
                    />

                    {selectedRecord.processSteps?.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '20px', color: '#999', border: '1px dashed #d9d9d9' }}>
                        Chưa có công đoạn nào. Click "Thêm công đoạn" để bắt đầu.
                      </div>
                    )}
                  </div>
                </Form>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ProcessControl;