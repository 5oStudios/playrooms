'use client';
import { useSearchParams } from 'next/navigation';
import { gameSocket } from '@core/game-client';
import { Match } from '@heroiclabs/nakama-js';
import { useState } from 'react';

export default function Match() {
  const searchParams = useSearchParams();
  const ticket = searchParams.get('ticket');
  const token = searchParams.get('token');

  // const dispatch = useAppDispatch();
  const [match, setMatch] = useState<null | Match>(null);
  const [amIHost, setAmIHost] = useState(false);

  enum MatchOpCodes {
    MATCH_STATE = 100,
    HOST_STATE = 101,
  }

  enum MatchState {
    LOOKING_FOR_HOST = 'LOOKING_FOR_HOST',
    READY = 'READY',
    STARTED = 'STARTED',
    ENDED = 'ENDED',
  }
  // Move socket logic inside useEffect to ensure it runs after component mount
  !match &&
    gameSocket.joinMatch(ticket, token).then((match) => {
      // dispatch(setCurrentMatch(match));
      setMatch(match);
      gameSocket.sendMatchState(
        match.match_id,
        MatchOpCodes.MATCH_STATE,
        MatchState.LOOKING_FOR_HOST
      );
      const isFirstPlayer = !match.presences;
      isFirstPlayer &&
        gameSocket.sendMatchState(
          match.match_id,
          MatchOpCodes.HOST_STATE,
          match.self.user_id
        );
      setAmIHost(isFirstPlayer);
    });

  // determine the host of the match
  gameSocket.onmatchdata = (matchData) => {
    const decodedData = new TextDecoder().decode(matchData.data);
    if (matchData.op_code === MatchOpCodes.HOST_STATE) {
      setAmIHost(decodedData === match.self.user_id);
    }
  };

  gameSocket.onmatchpresence = (matchPresence) => {
    console.log('Received match presence: ', matchPresence);

    matchPresence.leaves && console.log('Leaves: ', matchPresence.leaves);
    matchPresence.joins && console.log('Joins: ', matchPresence.joins);
  };

  if (!match) return <div>Loading...</div>;
  if (amIHost) return <h1>HOST</h1>;

  return (
    <div className="flex justify-center items-center">
      {/*<MCQQuestionsNakama questions={MockedMCQQuestions} />*/}
      <h1>Player</h1>
    </div>
  );
}
