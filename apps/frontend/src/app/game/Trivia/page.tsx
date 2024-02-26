'use client';
import React from 'react';
import Party from '../../../components/modals/party';

export default function Index() {
  // const session = useAppSelector((state) => state.session);
  // const account = useAppSelector((state) => state.user);
  // // useEffect(() => {
  // //   if (!session) return;
  // //   (async () => {
  // //     await gameSocket.connect(session, true);
  // //     await gameSocket.joinParty('test');
  // //   })();
  // // }, [session]);

  return <Party />;
}
