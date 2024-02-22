import React from 'react';
import { PLAYER_SCORE_KEY } from '../../game';
import { myPlayer, usePlayersState } from 'playroomkit';
import { AnimatedTooltip } from '../../ui/animated-tooltip';
import { GiTwoCoins } from 'react-icons/gi';

export const STARTING_PLAYER_SCORE = 0;

export default function CurrentPlayers() {
  const playersScore = usePlayersState(PLAYER_SCORE_KEY);

  return (
    <div className="flex gap-8">
      {playersScore.map(({ player }) => (
        <div key={player.id} className="flex gap-6 items-center">
          <AnimatedTooltip
            items={[
              {
                id: player.id,
                name: player.getProfile().name,
                designation: `Score: ${player.getState(PLAYER_SCORE_KEY)}`,
                image: player.getProfile().photo,
              },
            ]}
          />

          <div className="flex items-center gap-2">
            <span>Coins: {player.getState(PLAYER_SCORE_KEY)}</span>
            <div className="text-yellow-500">
              <GiTwoCoins />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function increaseMyScore() {
  myPlayer().setState(
    PLAYER_SCORE_KEY,
    myPlayer().getState(PLAYER_SCORE_KEY) + 1
  );
}
