'use client';
import { Edit, useForm } from '@refinedev/antd';
import { Flex, Form, Input, Select } from 'antd';
import React from 'react';

export default function CollectionsEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({
    action: 'edit',
  });
  console.log('queryResult', queryResult);
  console.log('formProps', formProps);

  // const { selectProps } = useSelect({
  //   resource: '65f8244710c16e4e4322',
  //   meta: {
  //     label: 'Categories',
  //   },
  // });

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
          <Form.Item
            label={'Collection Type'}
            name={['collectionType']}
            initialValue={'PUBLIC'}
          >
            <Select
              defaultValue={'PUBLIC'}
              options={[
                { label: 'Public', value: 'PUBLIC' },
                { label: 'Private', value: 'PRIVATE' },
              ]}
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item label={'Status'} name={['status']} initialValue={'ACTIVE'}>
            <Select
              defaultValue={'ACTIVE'}
              options={[
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Disabled', value: 'DISABLED' },
              ]}
              style={{ width: 120 }}
            />
          </Form.Item>
        </Flex>
      </Form>
    </Edit>
  );
}
