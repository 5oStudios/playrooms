'use client';

import React from 'react';

import {
  CollectionStatus,
  CollectionType,
  useCollections,
} from '@hooks/useCollections';
import { Edit, useForm } from '@refinedev/antd';
import { Flex, Form, Input, Select } from 'antd';

export default function CollectionsEdit() {
  const { onCollectionTypeChange, permissions } = useCollections();
  const { formProps, saveButtonProps, queryResult } = useForm({
    action: 'edit',
    meta: {
      permissions,
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={'Label'}
          name={['label']}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        {/*<Form.Item*/}
        {/*  label={'Category'}*/}
        {/*  name={['category']}*/}
        {/*  rules={[{ required: true }]}*/}
        {/*>*/}
        {/*  <Input {...selectProps} />*/}
        {/*</Form.Item>*/}
        <Flex gap={16}>
          <Form.Item label={'Collection Type'} name={'collectionType'}>
            <Select
              style={{ width: 120 }}
              onChange={onCollectionTypeChange}
              options={[
                { label: 'Public', value: CollectionType.PUBLIC },
                { label: 'Private', value: CollectionType.PRIVATE },
              ]}
            />
          </Form.Item>
          <Form.Item label={'Status'} name={'status'} initialValue={'ACTIVE'}>
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
    </Edit>
  );
}
