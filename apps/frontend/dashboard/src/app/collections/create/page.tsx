'use client';
import { Create, useForm } from '@refinedev/antd';
import { Flex, Form, Input, Select } from 'antd';
import React from 'react';
import { Permission, Role } from '@refinedev/appwrite';
import { HttpError, useGetIdentity } from '@refinedev/core';
import { IUser } from '@components/header';

export default function BlogPostCreate() {
  const { data: user } = useGetIdentity<IUser>();
  const permissions = user && {
    readPermissions: [Permission.read(Role.user(user.$id))],
    writePermissions: [Permission.write(Role.user(user.$id))],
  };
  const { saveButtonProps, formProps, form } = useForm<HttpError>({
    meta: permissions,
  });

  // const { selectProps: categorySelectProps } = useSelect({
  //   resource: '65f8244710c16e4e4322',
  //   meta: {
  //     label: 'Categories',
  //   },
  // });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
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
    </Create>
  );
}
