import { useAppDispatch, useAppSelector } from './use-redux-typed';
import { setUsername } from '../store/features/playerSlice';

export const usePlayer = () => {
  const dispatch = useAppDispatch();

  return {
    username: useAppSelector((state) => state.player.session.username),
    session: useAppSelector((state) => state.player.session),
    avatarConfig: useAppSelector(
      (state) => state.player.session.vars.avatarConfig
    ),
    setUsername: (username: string) => dispatch(setUsername(username)),
  };
};
