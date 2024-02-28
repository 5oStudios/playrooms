'use client';
import { useSearchParams } from 'next/navigation';
import { gameSocket } from '@core/game-client';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../hooks/use-redux-typed';
import { setCurrentMatch } from '../../../../store/features/matchSlice';

export default function Page() {
  const searchParams = useSearchParams();
  const ticket = searchParams.get('ticket');
  const token = searchParams.get('token');

  const dispatch = useAppDispatch();
  const isHost = useAppSelector((state) => state.match.isHostForCurrentMatch);

  gameSocket.joinMatch(ticket, token).then((match) => {
    dispatch(setCurrentMatch(match));

    console.log('Joined match: ', match);
    console.log('Is host: ', isHost);
  });

  // determine the host of the match
  gameSocket.onmatchdata = (matchData) => {
    console.log('Received match data: ', matchData);
  };

  gameSocket.onmatchpresence = (matchPresence) => {
    console.log('Received match presence: ', matchPresence);

    matchPresence.leaves && console.log('Leaves: ', matchPresence.leaves);
    matchPresence.joins && console.log('Joins: ', matchPresence.joins);
  };

  return (
    <div className="flex justify-center items-center">
      {/*<MCQQuestionsNakama questions={MockedMCQQuestions} />*/}
    </div>
  );
}
