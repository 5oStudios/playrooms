import { useAppDispatch, useAppSelector } from './use-redux-typed';
import { authenticateDevice } from '../store/features/playerSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();

  return {
    isAuth: useAppSelector((state) => !!state.player.session.token),
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
