'use client';
import { Create, useForm } from '@refinedev/antd';
import { Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { Permission, Role } from '@refinedev/appwrite';
import { account } from '@providers/data-provider';

export default function CategoryCreate() {
  const [ownerId, setOwnerId] = useState('');
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: '65f8244710c16e4e4322',
    meta: {
      label: 'Categories',
      // only category owners can edit and delete
      // writePermissions: [Permission.read(Role.member(ownerId))],

      writePermissions: [Permission.read(Role.guests())],
      readPermissions: [Permission.read(Role.any())],
    },
  });
  useEffect(() => {
    account.get().then((user) => setOwnerId(user.$id));
  }, []);

  return (
    <Create saveButtonProps={saveButtonProps}>
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
    </Create>
  );
}
