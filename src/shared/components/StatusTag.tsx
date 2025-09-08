import React from 'react';
import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';

interface StatusTagProps {
  status: string;
  type?: 'production' | 'quality' | 'approval' | 'delivery' | 'general' | 'machine';
}

const StatusTag: React.FC<StatusTagProps> = ({ status, type = 'general' }) => {
  const getStatusConfig = () => {
    const lowerStatus = status.toLowerCase();
    
    // Production statuses
    if (type === 'production') {
      switch (lowerStatus) {
        case 'pending':
        case 'chờ xử lý':
          return { color: 'default', icon: <ClockCircleOutlined />, text: 'Chờ xử lý' };
        case 'in_progress':
        case 'đang xử lý':
          return { color: 'processing', icon: <SyncOutlined spin />, text: 'Đang xử lý' };
        case 'completed':
        case 'hoàn thành':
          return { color: 'success', icon: <CheckCircleOutlined />, text: 'Hoàn thành' };
        case 'cancelled':
        case 'đã hủy':
          return { color: 'error', icon: <CloseCircleOutlined />, text: 'Đã hủy' };
        case 'on_hold':
        case 'tạm dừng':
          return { color: 'warning', icon: <ExclamationCircleOutlined />, text: 'Tạm dừng' };
        default:
          return { color: 'default', icon: null, text: status };
      }
    }
    
    // Quality statuses
    if (type === 'quality') {
      switch (lowerStatus) {
        case 'pass':
        case 'đạt':
          return { color: 'success', icon: <CheckCircleOutlined />, text: 'Đạt' };
        case 'fail':
        case 'không đạt':
          return { color: 'error', icon: <CloseCircleOutlined />, text: 'Không đạt' };
        case 'conditional':
        case 'có điều kiện':
          return { color: 'warning', icon: <ExclamationCircleOutlined />, text: 'Có điều kiện' };
        case 'pending':
        case 'chờ kiểm tra':
          return { color: 'default', icon: <ClockCircleOutlined />, text: 'Chờ kiểm tra' };
        default:
          return { color: 'default', icon: null, text: status };
      }
    }
    
    // Approval statuses
    if (type === 'approval') {
      switch (lowerStatus) {
        case 'pending':
        case 'chờ duyệt':
          return { color: 'default', icon: <ClockCircleOutlined />, text: 'Chờ duyệt' };
        case 'approved':
        case 'đã duyệt':
          return { color: 'success', icon: <CheckCircleOutlined />, text: 'Đã duyệt' };
        case 'rejected':
        case 'từ chối':
          return { color: 'error', icon: <CloseCircleOutlined />, text: 'Từ chối' };
        default:
          return { color: 'default', icon: null, text: status };
      }
    }
    
    // Delivery statuses
    if (type === 'delivery') {
      switch (lowerStatus) {
        case 'pending':
        case 'chờ giao':
          return { color: 'default', icon: <ClockCircleOutlined />, text: 'Chờ giao' };
        case 'in_transit':
        case 'đang giao':
          return { color: 'processing', icon: <SyncOutlined spin />, text: 'Đang giao' };
        case 'delivered':
        case 'đã giao':
          return { color: 'success', icon: <CheckCircleOutlined />, text: 'Đã giao' };
        case 'returned':
        case 'trả lại':
          return { color: 'warning', icon: <ExclamationCircleOutlined />, text: 'Trả lại' };
        default:
          return { color: 'default', icon: null, text: status };
      }
    }
    
    // Machine statuses
    if (type === 'machine') {
      switch (lowerStatus) {
        case 'active':
        case 'running':
        case 'hoạt động':
          return { color: 'success', icon: <CheckCircleOutlined />, text: 'Hoạt động' };
        case 'maintenance':
        case 'bảo trì':
          return { color: 'warning', icon: <ExclamationCircleOutlined />, text: 'Bảo trì' };
        case 'breakdown':
        case 'hỏng hóc':
          return { color: 'error', icon: <CloseCircleOutlined />, text: 'Hỏng hóc' };
        case 'idle':
        case 'nghỉ':
          return { color: 'default', icon: <MinusCircleOutlined />, text: 'Nghỉ' };
        case 'inactive':
        case 'không hoạt động':
          return { color: 'default', icon: <MinusCircleOutlined />, text: 'Không hoạt động' };
        default:
          return { color: 'default', icon: null, text: status };
      }
    }
    
    // General statuses
    switch (lowerStatus) {
      case 'active':
      case 'hoạt động':
        return { color: 'success', icon: <CheckCircleOutlined />, text: 'Hoạt động' };
      case 'inactive':
      case 'không hoạt động':
        return { color: 'default', icon: <MinusCircleOutlined />, text: 'Không hoạt động' };
      case 'draft':
      case 'bản nháp':
        return { color: 'default', icon: <ClockCircleOutlined />, text: 'Bản nháp' };
      case 'high':
      case 'cao':
        return { color: 'error', icon: <ExclamationCircleOutlined />, text: 'Cao' };
      case 'medium':
      case 'trung bình':
        return { color: 'warning', icon: <ExclamationCircleOutlined />, text: 'Trung bình' };
      case 'low':
      case 'thấp':
        return { color: 'default', icon: null, text: 'Thấp' };
      case 'urgent':
      case 'khẩn cấp':
        return { color: 'error', icon: <ExclamationCircleOutlined />, text: 'Khẩn cấp' };
      default:
        return { color: 'default', icon: null, text: status };
    }
  };

  const config = getStatusConfig();

  return (
    <Tag color={config.color} icon={config.icon}>
      {config.text}
    </Tag>
  );
};

export default StatusTag;
