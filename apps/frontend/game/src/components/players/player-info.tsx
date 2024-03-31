import React, { useEffect, useMemo } from 'react';

import { Input } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import { Controller, useForm } from 'react-hook-form';
import { genConfig } from 'react-nice-avatar';

import { useAppDispatch, useAppSelector } from '../../hooks/use-redux-typed';
import {
  selectAvatarUrl,
  selectUser,
  setUsername,
} from '../../lib/features/accountSlice';

export const NoSSRAvatar = dynamic(() => import('react-nice-avatar'), {
  ssr: false,
});
export const PlayerInfo = () => {
  const user = useAppSelector(selectUser);
  const avatarUrl = useAppSelector(selectAvatarUrl);
  const dispatch = useAppDispatch();
  const avatarConfig = useMemo(() => genConfig(avatarUrl), [avatarUrl]);

  const { control, watch, setError, trigger, formState, getFieldState } =
    useForm();

  useEffect(() => {
    const username = watch('username');
    if (username?.length < 3 || username?.length > 20) return; // TODO: find a better way

    if (username) dispatch(setUsername(username));
  }, [watch('username')]);

  if (user)
    return (
      <>
        <NoSSRAvatar className={'w-44 h-44'} {...avatarConfig} />
        <Controller
          name="username"
          control={control}
          rules={{
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username is too short',
            },
            maxLength: {
              value: 20,
              message: 'Username is too long',
            },
            onChange: () => trigger('username'),
          }}
          defaultValue={user.username}
          render={({ field, fieldState, formState }) => (
            <Input
              {...field}
              errorMessage={fieldState.error?.message}
              autoComplete={'false'}
            />
          )}
        />
      </>
    );
  else return <>loading...</>;
};
