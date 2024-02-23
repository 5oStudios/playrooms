'use client';
import { Nakama } from '../../../components/nakama';
import {
  useTypedDispatch,
  useTypedSelector,
} from '../../../hooks/use-redux-typed';

export default function Index() {
  const session = useTypedSelector((state) => state.auth.session);
  const dispatch = useTypedDispatch();
  // dispatch(
  //   authenticateDevice({
  //     deviceId: nanoid(),
  //     create: true,
  //     username: 'testuser',
  //     vars: { score: '1' },
  //   })
  // );

  console.log(session);
  return (
    <div className="flex justify-center items-center">
      <Nakama />
    </div>
  );
}
