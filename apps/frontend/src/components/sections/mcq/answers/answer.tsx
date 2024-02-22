import React, { useEffect } from 'react';
import { myPlayer, useMultiplayerState, usePlayersList } from 'playroomkit';
import { Button } from '@nextui-org/react';
import { cn } from '../../../../utils/cn';
import Image from 'next/image';
import { QuestionState } from '../questions/question';

export interface Answer {
  option: string;
  isCorrect: boolean;
}

export const Answer: React.FC<{
  index: number;
  answer: Answer;
  onClick: (answer: Answer) => void;
  currentQuestionState?: QuestionState;
}> = ({ answer, onClick, index, currentQuestionState }) => {
  const [playersChooseThis, setPlayersChooseThis] = useMultiplayerState(
    `playersChooseThis`,
    []
  );
  let abbreviation = '';
  switch (index) {
    case 0:
      abbreviation = 'A';
      break;
    case 1:
      abbreviation = 'B';
      break;
    case 2:
      abbreviation = 'C';
      break;
    case 3:
      abbreviation = 'D';
      break;
  }
  const handleAnswer = (answer: Answer) => {
    setPlayersChooseThis([
      ...playersChooseThis,
      {
        id: myPlayer().id,
        chosenAnswer: answer,
      },
    ]);
    onClick(answer);
  };
  useEffect(() => {
    setPlayersChooseThis([]);
  }, [currentQuestionState]);
  return (
    <div>
      <Button
        size="lg"
        disableRipple={true}
        disabled={playersChooseThis.some(
          (player) => player.id === myPlayer().id
        )}
        className={cn(
          `w-full relative rounded-lg bg-neutral-950/90 dark:bg-default-100/20 text-lg font-bold flex text-center items-center justify-center overflow-hidden shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-neutral-950/90 dark:focus:ring-offset-default-100/20`
          // answer.isCorrect
          // ? 'focus:ring-emerald-500 focus:ring-offset-emerald-500/90 dark:focus:ring-offset-emerald-500/20'
          // : 'focus:ring-rose-500 focus:ring-offset-rose-500/90 dark:focus:ring-offset-rose-500/20'
        )}
        style={{ backdropFilter: 'blur(4px)' }}
        onClick={() => handleAnswer(answer)}
      >
        <span className="text-2xl font-bold left-4 absolute top-1.5 text-center bg-gradient-to-r from-emerald-500 to-sky-500 text-transparent bg-clip-text">
          {abbreviation}
        </span>
        <span className="flex-1">{answer.option}</span>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent w-px" />
      </Button>
      <PlayersChooseThis
        playersChooseThis={playersChooseThis}
        answer={answer}
      />
    </div>
  );
};
function PlayersChooseThis({ playersChooseThis, answer }) {
  const players = usePlayersList();
  return (
    <div className={cn('flex gap-2 mt-2')}>
      {playersChooseThis.map((player, index) => {
        if (player.chosenAnswer.option !== answer.option) return null;
        const playerData = players.find(
          (currentPlayer) => currentPlayer.id === player.id
        );
        if (!playerData) return null;
        return (
          <Image
            key={player.id}
            width={32}
            height={32}
            src={playerData.getProfile().photo}
            alt="playerAvatar"
            className="h-8 w-8 rounded-full"
          />
        );
      })}
    </div>
  );
}
