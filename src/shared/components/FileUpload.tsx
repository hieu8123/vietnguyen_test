import React, { useState } from 'react';
import { Upload, Button, message, Modal } from 'antd';
import { UploadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload';

interface FileUploadProps {
  value?: UploadFile[];
  onChange?: (files: UploadFile[]) => void;
  maxCount?: number;
  accept?: string;
  listType?: 'text' | 'picture' | 'picture-card';
  disabled?: boolean;
  showPreview?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  value = [],
  onChange,
  maxCount = 5,
  accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png',
  listType = 'text',
  disabled = false,
  showPreview = true,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    const processedFileList = newFileList.map((file) => {
      if (file.response) {
        // File uploaded successfully
        file.url = file.response.url;
      }
      return file;
    });

    onChange?.(processedFileList);
  };

  const beforeUpload = (file: File) => {
    const isValidType = accept.split(',').some(type => 
      file.type.includes(type.replace('.', '').replace('*', '')) || 
      file.name.toLowerCase().endsWith(type.toLowerCase())
    );
    
    if (!isValidType) {
      message.error(`Chỉ cho phép upload file: ${accept}`);
      return false;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('File phải nhỏ hơn 10MB!');
      return false;
    }

    return true;
  };

  const uploadProps: UploadProps = {
    name: 'file',
    action: '/api/upload', // Replace with your upload endpoint
    fileList: value,
    onChange: handleChange,
    beforeUpload,
    onPreview: showPreview ? handlePreview : undefined,
    disabled,
    accept,
    listType,
    maxCount,
    multiple: maxCount > 1,
  };

  return (
    <>
      <Upload {...uploadProps}>
        {value.length < maxCount && (
          <Button icon={<UploadOutlined />} disabled={disabled}>
            Chọn file
          </Button>
        )}
      </Upload>

      {showPreview && (
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={() => setPreviewOpen(false)}
          width="80%"
          style={{ maxWidth: 800 }}
        >
          <img alt="preview" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      )}
    </>
  );
};

export default FileUpload;
