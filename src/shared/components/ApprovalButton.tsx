import React, { useState } from 'react';
import { Button, Modal, Input, Space, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { ApprovalStatus } from '../../types';

const { TextArea } = Input;

interface ApprovalButtonProps {
  currentStatus: ApprovalStatus;
  onApprove?: (comments?: string) => Promise<void>;
  onReject?: (comments?: string) => Promise<void>;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
}

const ApprovalButton: React.FC<ApprovalButtonProps> = ({
  currentStatus,
  onApprove,
  onReject,
  disabled = false,
  size = 'small',
}) => {
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!onApprove) return;
    
    try {
      setLoading(true);
      await onApprove(comments);
      message.success('Đã phê duyệt thành công');
      setApprovalModalVisible(false);
      setComments('');
    } catch (error) {
      message.error('Có lỗi xảy ra khi phê duyệt');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;
    
    try {
      setLoading(true);
      await onReject(comments);
      message.success('Đã từ chối thành công');
      setRejectionModalVisible(false);
      setComments('');
    } catch (error) {
      message.error('Có lỗi xảy ra khi từ chối');
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus === 'approved') {
    return (
      <Button
        type="primary"
        icon={<CheckOutlined />}
        size={size}
        disabled
      >
        Đã duyệt
      </Button>
    );
  }

  if (currentStatus === 'rejected') {
    return (
      <Button
        danger
        icon={<CloseOutlined />}
        size={size}
        disabled
      >
        Đã từ chối
      </Button>
    );
  }

  return (
    <>
      <Space size="small">
        <Button
          type="primary"
          icon={<CheckOutlined />}
          size={size}
          disabled={disabled}
          onClick={() => setApprovalModalVisible(true)}
        >
          Phê duyệt
        </Button>
        <Button
          danger
          icon={<CloseOutlined />}
          size={size}
          disabled={disabled}
          onClick={() => setRejectionModalVisible(true)}
        >
          Từ chối
        </Button>
      </Space>

      {/* Approval Modal */}
      <Modal
        title="Xác nhận phê duyệt"
        open={approvalModalVisible}
        onOk={handleApprove}
        onCancel={() => {
          setApprovalModalVisible(false);
          setComments('');
        }}
        confirmLoading={loading}
        okText="Phê duyệt"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn phê duyệt mục này không?</p>
        <TextArea
          placeholder="Nhập ghi chú (không bắt buộc)"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={3}
          style={{ marginTop: 16 }}
        />
      </Modal>

      {/* Rejection Modal */}
      <Modal
        title="Xác nhận từ chối"
        open={rejectionModalVisible}
        onOk={handleReject}
        onCancel={() => {
          setRejectionModalVisible(false);
          setComments('');
        }}
        confirmLoading={loading}
        okText="Từ chối"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn từ chối mục này không?</p>
        <TextArea
          placeholder="Nhập lý do từ chối (bắt buộc)"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={3}
          style={{ marginTop: 16 }}
          required
        />
      </Modal>
    </>
  );
};

export default ApprovalButton;