'use client';

import React from 'react';

import { NumberField, Show, TextField } from '@refinedev/antd';
import { useShow } from '@refinedev/core';
import { Typography } from 'antd';

const { Title } = Typography;

export default function CategoryShow() {
  const { queryResult } = useShow({
    resource: '65f8244710c16e4e4322',
    meta: {
      label: 'Categories',
    },
  });
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{'ID'}</Title>
      <NumberField value={record?.id ?? ''} />
      <Title level={5}>{'Title'}</Title>
      <TextField value={record?.title} />
    </Show>
  );
}
