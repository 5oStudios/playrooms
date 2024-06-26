'use client';

import React, { useState } from 'react';

import { IUser } from '@components/header';
import { Create, useForm } from '@refinedev/antd';
import { Models, Permission, Role } from '@refinedev/appwrite';
import { HttpError, useGetIdentity } from '@refinedev/core';
import { Form, Input } from 'antd';

export default function BlogPostCreate() {
  const [identity, setIdentity] =
    useState<Models.Account<Models.Preferences> | null>(null);

  const { data: user } = useGetIdentity<IUser>();
  const permissions = user && {
    readPermissions: [Permission.read(Role.user(user.$id))],
    writePermissions: [Permission.write(Role.user(user.$id))],
  };
  const { saveButtonProps, formProps, form } = useForm<HttpError>({
    meta: permissions,
  });

  // const { selectProps: categorySelectProps } = useSelect({
  //   resource: '65f866e73151b891a190',
  //   meta: {
  //     label: 'Questions',
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
      </Form>
    </Create>
  );
}
