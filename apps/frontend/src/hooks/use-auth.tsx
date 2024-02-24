import { useAppDispatch, useAppSelector } from './use-redux-typed';
import React from 'react';
import { usePlayer } from './use-player';
import { authenticateDevice } from '../store/features/playerSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { username, avatarConfig } = usePlayer();
  const parsedAvatarConfig = JSON.parse(avatarConfig);
  const isAuth = useAppSelector((state) => !!state.player.session.token);

  React.useEffect(() => {
    if (!isAuth) {
      dispatch(
        authenticateDevice({
          username,
          vars: {
            avatarConfig: JSON.stringify(parsedAvatarConfig),
          },
        })
      );
    }
  }, [dispatch, isAuth, parsedAvatarConfig, username]);
  return {
    isAuth,
    authenticateDevice: ({
      username,
      vars,
    }: {
      username: string;
      vars?: Record<string, string>;
    }) =>
      dispatch(
        authenticateDevice({
          username,
          vars: {
            avatarConfig: vars.avatarConfig,
          },
        })
      ),
  };
};
