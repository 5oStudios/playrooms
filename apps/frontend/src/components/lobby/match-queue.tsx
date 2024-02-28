import { gameSocket } from '@core/game-client';
import { useRouter } from 'next/navigation';

export default function MatchQueue() {
  const router = useRouter();
  gameSocket.onmatchmakermatched = (matched) => {
    console.info('Received MatchmakerMatched message: ', matched);
    console.info('Matched opponents: ', matched.users);

    router.push(
      `/game/trivia/match?ticket=${matched.ticket}&token=${matched.token}`
    );
    // dispatch(setMatchFoundData(matched));
  };
  return (
    <div className="flex justify-center items-center">
      <div>MatchQueue</div>
    </div>
  );
}
