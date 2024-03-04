import React from 'react';
import { usePlayersList } from 'playroomkit';
import { Button } from '@nextui-org/react';
import { cn } from '../../../../utils/cn';
import Image from 'next/image';

export interface Answer {
  option: string;
  isCorrect: boolean;
}

export const Answer: React.FC<{
  index: number;
  answer: Answer;
  onClick: (answer: Answer) => void;
  disabled?: boolean;
}> = ({ answer, onClick, index, disabled }) => {
  const [isSelected, setIsSelected] = React.useState(false);
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
    setIsSelected(true);
    onClick(answer);
  };
  return (
    <div>
      <Button
        size="lg"
        disableRipple={true}
        disabled={disabled}
        className={cn(
          `w-full relative rounded-lg text-lg font-bold flex text-center items-center justify-center overflow-hidden shadow-md`,
          `dark:bg-neutral-950/40 dark:focus:ring-offset-default-100/20`,
          `transition duration-300 ease-in-out transform`,
          `hover:scale-[101%] hover:dark:bg-neutral-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-neutral-950/90`,
          answer.isCorrect && isSelected
            ? 'bg-green-500'
            : !answer.isCorrect && isSelected && 'bg-rose-500',
          disabled && 'opacity-50 cursor-not-allowed',
          isSelected && 'text-white opacity-100'
        )}
        style={{ backdropFilter: 'blur(4px)' }}
        onClick={() => handleAnswer(answer)}
      >
        <span className="text-2xl font-bold left-4 absolute top-1.5 text-center bg-gradient-to-r from-emerald-500 to-sky-500 text-transparent bg-clip-text">
          {abbreviation}
        </span>
        <span className="text-lg font-semibold">{answer.option}</span>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent w-px" />
      </Button>
      {/*<PlayersChooseThis*/}
      {/*  playersChooseThis={playersChooseThis}*/}
      {/*  answer={answer}*/}
      {/*/>*/}
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
