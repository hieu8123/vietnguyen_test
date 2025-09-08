import React from 'react';
import { Form, Input, Select, DatePicker, Button, Space, Card, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface SearchField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'dateRange' | 'date';
  options?: { value: string | number; label: string }[];
  placeholder?: string;
  span?: number;
}

interface SearchFormProps {
  fields: SearchField[];
  onSearch: (values: any) => void;
  onReset?: () => void;
  loading?: boolean;
  initialValues?: Record<string, any>;
}

const SearchForm: React.FC<SearchFormProps> = ({
  fields,
  onSearch,
  onReset,
  loading = false,
  initialValues,
}) => {
  const [form] = Form.useForm();

  const handleSearch = () => {
    form.validateFields().then((values) => {
      onSearch(values);
    });
  };

  const handleReset = () => {
    form.resetFields();
    if (onReset) {
      onReset();
    } else {
      onSearch({});
    }
  };

  const renderField = (field: SearchField) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            placeholder={field.placeholder || `Nhập ${field.label.toLowerCase()}`}
            allowClear
          />
        );
      
      case 'select':
        return (
          <Select
            placeholder={field.placeholder || `Chọn ${field.label.toLowerCase()}`}
            allowClear
            showSearch
            optionFilterProp="children"
          >
            {field.options?.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );
      
      case 'date':
        return (
          <DatePicker
            placeholder={field.placeholder || `Chọn ${field.label.toLowerCase()}`}
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
          />
        );
      
      case 'dateRange':
        return (
          <RangePicker
            placeholder={['Từ ngày', 'Đến ngày']}
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSearch}
      >
        <Row gutter={[16, 0]}>
          {fields.map((field) => (
            <Col
              key={field.name}
              xs={24}
              sm={12}
              md={field.span || 8}
              lg={field.span || 6}
            >
              <Form.Item
                name={field.name}
                label={field.label}
                style={{ marginBottom: 16 }}
              >
                {renderField(field)}
              </Form.Item>
            </Col>
          ))}
          
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item label=" " style={{ marginBottom: 16 }}>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                  loading={loading}
                >
                  Tìm kiếm
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                >
                  Làm mới
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default SearchForm;
