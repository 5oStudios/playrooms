'use client';
import { Create, useForm, useSelect } from '@refinedev/antd';
import { Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { account } from '@providers/data-provider';
import { HttpError } from '@refinedev/core';
import { Models, Permission, Role } from '@refinedev/appwrite';

export default function BlogPostCreate() {
  const [identity, setIdentity] =
    useState<Models.Account<Models.Preferences> | null>(null);
  useEffect(() => {
    (async () => {
      await account.get().then((user) => setIdentity(user));
    })();
  }, []);
  const { saveButtonProps, formProps, form } = useForm<HttpError>({
    meta: {
      readPermissions: identity && [Permission.read(Role.user(identity.$id))],
      writePermissions: identity && [Permission.write(Role.user(identity.$id))],
    },
  });

  const { selectProps: categorySelectProps } = useSelect({
    resource: '65f866e73151b891a190',
    meta: {
      label: 'Questions',
    },
  });

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
