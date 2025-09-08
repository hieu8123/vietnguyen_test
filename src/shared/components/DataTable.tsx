import React from 'react';
import { Table, Space, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType, TableProps } from 'antd/es/table';

interface DataTableProps<T = any> extends TableProps<T> {
  showActions?: boolean;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  onView?: (record: T) => void;
  editDisabled?: (record: T) => boolean;
  deleteDisabled?: (record: T) => boolean;
  customActions?: (record: T) => React.ReactNode;
}

const DataTable = <T extends Record<string, any>>({
  columns = [],
  showActions = true,
  onEdit,
  onDelete,
  onView,
  editDisabled,
  deleteDisabled,
  customActions,
  ...tableProps
}: DataTableProps<T>) => {
  const actionColumn: ColumnsType<T>[0] = {
    title: 'Thao tác',
    key: 'actions',
    fixed: 'right',
    width: 120,
    render: (_, record) => (
      <Space size="small">
        {onView && (
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onView(record)}
            />
          </Tooltip>
        )}
        {onEdit && (
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              disabled={editDisabled?.(record)}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              disabled={deleteDisabled?.(record)}
              onClick={() => onDelete(record)}
            />
          </Tooltip>
        )}
        {customActions?.(record)}
      </Space>
    ),
  };

  const finalColumns = showActions ? [...columns, actionColumn] : columns;

  return (
    <Table
      {...tableProps}
      columns={finalColumns}
      scroll={{ x: 'max-content' }}
      size="small"
      bordered
    />
  );
};

export default DataTable;