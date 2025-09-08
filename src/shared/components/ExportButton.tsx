import React, { useState } from 'react';
import { Button, Dropdown, message } from 'antd';
import { ExportOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

interface ExportButtonProps {
  data: any[];
  filename?: string;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  type?: 'default' | 'primary' | 'text';
  formats?: ('excel' | 'pdf' | 'csv')[];
  columns?: { key: string; title: string }[];
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename = 'export',
  disabled = false,
  size = 'small',
  type = 'default',
  formats = ['excel', 'csv'],
  columns,
}) => {
  const [loading, setLoading] = useState(false);

  const exportToExcel = async () => {
    try {
      setLoading(true);
      
      // Create a simple CSV-like format that Excel can open
      const headers = columns?.map(col => col.title) || Object.keys(data[0] || {});
      const keys = columns?.map(col => col.key) || Object.keys(data[0] || {});
      
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          keys.map(key => {
            const value = row[key];
            // Handle values with commas, quotes, or line breaks
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
          }).join(',')
        )
      ].join('\n');

      // Add BOM for proper UTF-8 encoding in Excel
      const blob = new Blob(['\ufeff' + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      message.success('Đã xuất file Excel thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi xuất file Excel');
      console.error('Export Excel error:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async () => {
    try {
      setLoading(true);
      
      const headers = columns?.map(col => col.title) || Object.keys(data[0] || {});
      const keys = columns?.map(col => col.key) || Object.keys(data[0] || {});
      
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          keys.map(key => {
            const value = row[key];
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      message.success('Đã xuất file CSV thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi xuất file CSV');
      console.error('Export CSV error:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    try {
      setLoading(true);
      message.info('Chức năng xuất PDF đang được phát triển');
      // TODO: Implement PDF export using libraries like jsPDF or react-pdf
    } catch (error) {
      message.error('Có lỗi xảy ra khi xuất file PDF');
      console.error('Export PDF error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: string) => {
    if (!data || data.length === 0) {
      message.warning('Không có dữ liệu để xuất');
      return;
    }

    switch (format) {
      case 'excel':
        exportToExcel();
        break;
      case 'csv':
        exportToCSV();
        break;
      case 'pdf':
        exportToPDF();
        break;
      default:
        message.error('Định dạng không được hỗ trợ');
    }
  };

  const menuItems: MenuProps['items'] = [];
  
  if (formats.includes('excel')) {
    menuItems.push({
      key: 'excel',
      icon: <FileExcelOutlined />,
      label: 'Xuất Excel',
      onClick: () => handleExport('excel'),
    });
  }
  
  if (formats.includes('csv')) {
    menuItems.push({
      key: 'csv',
      icon: <FileExcelOutlined />,
      label: 'Xuất CSV',
      onClick: () => handleExport('csv'),
    });
  }
  
  if (formats.includes('pdf')) {
    menuItems.push({
      key: 'pdf',
      icon: <FilePdfOutlined />,
      label: 'Xuất PDF',
      onClick: () => handleExport('pdf'),
    });
  }

  if (menuItems.length === 1) {
    // Single format - direct button
    return (
      <Button
        icon={<ExportOutlined />}
        onClick={() => handleExport(menuItems[0].key as string)}
        disabled={disabled || !data || data.length === 0}
        loading={loading}
        size={size}
        type={type}
      >
        Xuất dữ liệu
      </Button>
    );
  }

  // Multiple formats - dropdown
  return (
    <Dropdown
      menu={{ items: menuItems }}
      disabled={disabled || !data || data.length === 0}
      placement="bottomRight"
    >
      <Button
        icon={<ExportOutlined />}
        loading={loading}
        size={size}
        type={type}
      >
        Xuất dữ liệu
      </Button>
    </Dropdown>
  );
};

export default ExportButton;