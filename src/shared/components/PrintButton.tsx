import React from 'react';
import { Button, message } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';

interface PrintButtonProps {
  data?: any;
  templateType?: 'production_order' | 'machine_report' | 'qc_inspection' | 'delivery_note' | 'setup_sheet';
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  type?: 'default' | 'primary' | 'text';
  children?: React.ReactNode;
}

const PrintButton: React.FC<PrintButtonProps> = ({
  data,
  templateType,
  disabled = false,
  size = 'small',
  type = 'default',
  children,
}) => {
  const handlePrint = async () => {
    try {
      if (!data) {
        message.error('Không có dữ liệu để in');
        return;
      }

      // Generate print content based on template type
      const printContent = generatePrintContent(data, templateType);
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        message.error('Không thể mở cửa sổ in. Vui lòng kiểm tra trình duyệt.');
        return;
      }

      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
      
      message.success('Đã gửi lệnh in');
    } catch (error) {
      message.error('Có lỗi xảy ra khi in');
      console.error('Print error:', error);
    }
  };

  const generatePrintContent = (data: any, templateType?: string): string => {
    const commonStyles = `
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .company-name { font-size: 20px; font-weight: bold; }
        .document-title { font-size: 16px; font-weight: bold; margin: 10px 0; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .info-table td { padding: 8px; border: 1px solid #ccc; }
        .info-table .label { font-weight: bold; background-color: #f5f5f5; width: 150px; }
        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .data-table th, .data-table td { padding: 8px; border: 1px solid #ccc; text-align: left; }
        .data-table th { background-color: #f5f5f5; font-weight: bold; }
        .signature-section { display: flex; justify-content: space-between; margin-top: 40px; }
        .signature-box { text-align: center; width: 200px; }
        .signature-line { border-top: 1px solid #000; margin-top: 50px; padding-top: 5px; }
        @media print { 
          body { margin: 0; } 
          .no-print { display: none; }
        }
      </style>
    `;

    const header = `
      <div class="header">
        <div class="company-name">VIET NGUYEN PRECISION</div>
        <div>Địa chỉ: [Địa chỉ công ty]</div>
        <div>Điện thoại: [Số điện thoại] | Email: [Email]</div>
      </div>
    `;

    let content = '';
    
    switch (templateType) {
      case 'production_order':
        content = generateProductionOrderContent(data);
        break;
      case 'machine_report':
        content = generateMachineReportContent(data);
        break;
      case 'qc_inspection':
        content = generateQCInspectionContent(data);
        break;
      case 'delivery_note':
        content = generateDeliveryNoteContent(data);
        break;
      case 'setup_sheet':
        content = generateSetupSheetContent(data);
        break;
      default:
        content = `<div>Dữ liệu: ${JSON.stringify(data, null, 2)}</div>`;
    }

    const signatures = `
      <div class="signature-section">
        <div class="signature-box">
          <div>Người lập</div>
          <div class="signature-line">[Tên & Chữ ký]</div>
        </div>
        <div class="signature-box">
          <div>Người duyệt</div>
          <div class="signature-line">[Tên & Chữ ký]</div>
        </div>
      </div>
    `;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>In tài liệu</title>
        ${commonStyles}
      </head>
      <body>
        ${header}
        ${content}
        ${signatures}
      </body>
      </html>
    `;
  };

  const generateProductionOrderContent = (data: any): string => {
    return `
      <div class="document-title">LỆNH SẢN XUẤT - ${data.poNumber || 'N/A'}</div>
      <table class="info-table">
        <tr>
          <td class="label">Số PO:</td>
          <td>${data.poNumber || 'N/A'}</td>
          <td class="label">Ngày tạo:</td>
          <td>${data.createdAt ? new Date(data.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</td>
        </tr>
        <tr>
          <td class="label">Khách hàng:</td>
          <td>${data.customerName || 'N/A'}</td>
          <td class="label">Hạn chót:</td>
          <td>${data.dueDate ? new Date(data.dueDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
        </tr>
        <tr>
          <td class="label">Sản phẩm:</td>
          <td>${data.productName || 'N/A'}</td>
          <td class="label">Mã sản phẩm:</td>
          <td>${data.productCode || 'N/A'}</td>
        </tr>
        <tr>
          <td class="label">Số lượng:</td>
          <td>${data.quantity || 'N/A'} ${data.unit || ''}</td>
          <td class="label">Độ ưu tiên:</td>
          <td>${data.priority || 'N/A'}</td>
        </tr>
      </table>
      <div><strong>Ghi chú:</strong></div>
      <div style="border: 1px solid #ccc; padding: 10px; min-height: 100px;">
        ${data.notes || 'Không có ghi chú'}
      </div>
    `;
  };

  const generateMachineReportContent = (data: any): string => {
    return `
      <div class="document-title">BÁO CÁO MÁY - ${data.reportNumber || 'N/A'}</div>
      <table class="info-table">
        <tr>
          <td class="label">Số báo cáo:</td>
          <td>${data.reportNumber || 'N/A'}</td>
          <td class="label">Ngày:</td>
          <td>${data.date ? new Date(data.date).toLocaleDateString('vi-VN') : 'N/A'}</td>
        </tr>
        <tr>
          <td class="label">Máy:</td>
          <td>${data.machineName || 'N/A'}</td>
          <td class="label">Ca làm việc:</td>
          <td>${data.shift || 'N/A'}</td>
        </tr>
        <tr>
          <td class="label">Người vận hành:</td>
          <td>${data.operatorName || 'N/A'}</td>
          <td class="label">Lệnh sản xuất:</td>
          <td>${data.poId || 'N/A'}</td>
        </tr>
      </table>
      
      <div class="document-title">THÔNG TIN SẢN XUẤT</div>
      <table class="info-table">
        <tr>
          <td class="label">Thời gian setup:</td>
          <td>${data.setupTime || 0} phút</td>
          <td class="label">Thời gian chạy:</td>
          <td>${data.runTime || 0} phút</td>
        </tr>
        <tr>
          <td class="label">Sản lượng:</td>
          <td>${data.outputQuantity || 0} pcs</td>
          <td class="label">Phế phẩm:</td>
          <td>${data.scrapQuantity || 0} pcs</td>
        </tr>
        <tr>
          <td class="label">Lỗi:</td>
          <td>${data.defectQuantity || 0} pcs</td>
          <td class="label">Thời gian dừng:</td>
          <td>${data.downtime || 0} phút</td>
        </tr>
      </table>
    `;
  };

  const generateQCInspectionContent = (data: any): string => {
    return `
      <div class="document-title">PHIẾU KIỂM TRA CHẤT LƯỢNG - ${data.inspectionNumber || 'N/A'}</div>
      <table class="info-table">
        <tr>
          <td class="label">Số phiếu:</td>
          <td>${data.inspectionNumber || 'N/A'}</td>
          <td class="label">Ngày kiểm tra:</td>
          <td>${data.inspectionDate ? new Date(data.inspectionDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
        </tr>
        <tr>
          <td class="label">Loại kiểm tra:</td>
          <td>${data.type || 'N/A'}</td>
          <td class="label">Người kiểm tra:</td>
          <td>${data.inspectorName || 'N/A'}</td>
        </tr>
        <tr>
          <td class="label">Kích thước mẫu:</td>
          <td>${data.sampleSize || 0}</td>
          <td class="label">Kết quả:</td>
          <td>${data.overallResult || 'N/A'}</td>
        </tr>
      </table>
    `;
  };

  const generateDeliveryNoteContent = (data: any): string => {
    return `
      <div class="document-title">PHIẾU GIAO HÀNG - ${data.deliveryNumber || 'N/A'}</div>
      <table class="info-table">
        <tr>
          <td class="label">Số phiếu:</td>
          <td>${data.deliveryNumber || 'N/A'}</td>
          <td class="label">Ngày giao:</td>
          <td>${data.deliveryDate ? new Date(data.deliveryDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
        </tr>
        <tr>
          <td class="label">Khách hàng:</td>
          <td colspan="3">${data.customerName || 'N/A'}</td>
        </tr>
        <tr>
          <td class="label">Địa chỉ:</td>
          <td colspan="3">${data.customerAddress || 'N/A'}</td>
        </tr>
      </table>
    `;
  };

  const generateSetupSheetContent = (data: any): string => {
    return `
      <div class="document-title">SETUP SHEET - ${data.setupNumber || 'N/A'}</div>
      <table class="info-table">
        <tr>
          <td class="label">Số setup:</td>
          <td>${data.setupNumber || 'N/A'}</td>
          <td class="label">Ngày setup:</td>
          <td>${data.setupDate ? new Date(data.setupDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
        </tr>
        <tr>
          <td class="label">Máy:</td>
          <td>${data.machineName || 'N/A'}</td>
          <td class="label">Sản phẩm:</td>
          <td>${data.productName || 'N/A'}</td>
        </tr>
        <tr>
          <td class="label">Thời gian setup:</td>
          <td>${data.setupTime || 0} phút</td>
          <td class="label">Thời gian chu kỳ:</td>
          <td>${data.cycleTime || 0} giây</td>
        </tr>
      </table>
    `;
  };

  return (
    <Button
      icon={<PrinterOutlined />}
      onClick={handlePrint}
      disabled={disabled}
      size={size}
      type={type}
    >
      {children || 'In'}
    </Button>
  );
};

export default PrintButton;
