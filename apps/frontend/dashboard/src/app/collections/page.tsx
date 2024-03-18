'use client';
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from '@refinedev/antd';
import { BaseRecord } from '@refinedev/core';
import { Space, Table, Tag } from 'antd';
import React from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

export default function BlogPostList() {
  const { tableProps, tableQueryResult } = useTable();

  // const { data: categoryData, isLoading: categoryIsLoading } = useMany({
  //   resource: '65f81db87bbfa98395be',
  //   meta: {
  //     label: 'Categories',
  //   },
  //   ids:
  //     tableProps?.dataSource
  //       ?.map((item) => item?.category?.id)
  //       .filter(Boolean) ?? [],
  //   queryOptions: {
  //     enabled: !!tableProps?.dataSource,
  //   },
  // });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="label" title={'Label'} />
        <Table.Column
          dataIndex="collectionType"
          render={(value: any) =>
            value === 'PUBLIC' ? (
              <Tag color="processing">Public</Tag>
            ) : (
              <Tag color="gold">Private</Tag>
            )
          }
          title={'Collection Type'}
        />

        <Table.Column dataIndex="questionsCount" title={'Questions Count'} />
        <Table.Column
          dataIndex={['status']}
          title={'Status'}
          render={(value: any) =>
            value === 'ACTIVE' ? (
              <Tag icon={<CheckCircleOutlined />} color="success">
                Active
              </Tag>
            ) : (
              <Tag icon={<CloseCircleOutlined />} color="error">
                Disabled
              </Tag>
            )
          }
        />
        <Table.Column
          dataIndex={['createdAt']}
          title={'Created at'}
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          title={'Actions'}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
