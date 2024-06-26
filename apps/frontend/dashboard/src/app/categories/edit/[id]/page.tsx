'use client';

import React from 'react';

import { Edit, useForm } from '@refinedev/antd';
import { Form, Input } from 'antd';

export default function CategoryEdit() {
  const { formProps, saveButtonProps } = useForm({
    resource: '65f8244710c16e4e4322',
    meta: {
      label: 'Categories',
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={'Title'}
          name={['title']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
}
