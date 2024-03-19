'use client';
import React from 'react';
import { Create, useForm } from '@refinedev/antd';
import { Flex, Form, Input, Select } from 'antd';
import { HttpError } from '@refinedev/core';
import {
  CollectionStatus,
  CollectionType,
  useCollections,
} from '@hooks/useCollections';

type FormValues = {
  label: string;
  collectionType: CollectionType;
  status: CollectionStatus;
};

export default function BlogPostCreate() {
  const { permissions, onCollectionTypeChange } = useCollections();
  const { saveButtonProps, formProps, form, onFinish } = useForm<
    {
      id: string;
    } & FormValues,
    HttpError,
    FormValues
  >({
    meta: permissions,
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" form={form}>
        <Form.Item
          label={'Label'}
          name={['label']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Flex gap={16}>
          <Form.Item
            label={'Collection Type'}
            name={['collectionType']}
            initialValue={CollectionType.PUBLIC}
          >
            <Select
              style={{ width: 120 }}
              onChange={onCollectionTypeChange}
              options={[
                { label: 'Public', value: CollectionType.PUBLIC },
                { label: 'Private', value: CollectionType.PRIVATE },
              ]}
            />
          </Form.Item>
          <Form.Item
            label={'Status'}
            name={['status']}
            initialValue={CollectionStatus.ACTIVE}
          >
            <Select
              options={[
                { label: 'Active', value: CollectionStatus.ACTIVE },
                { label: 'Disabled', value: CollectionStatus.DISABLED },
              ]}
              style={{ width: 120 }}
            />
          </Form.Item>
        </Flex>
      </Form>
    </Create>
  );
}
