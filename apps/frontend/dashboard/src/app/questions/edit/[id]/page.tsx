'use client';

import React from 'react';

import { Edit, useForm } from '@refinedev/antd';
import { Form, Input } from 'antd';

export default function BlogPostEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({});

  const blogPostsData = queryResult?.data?.data;

  // const { selectProps: categorySelectProps } = useSelect({
  //   resource: "categories",
  //   defaultValue: blogPostsData?.category?.id,
  // });

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
