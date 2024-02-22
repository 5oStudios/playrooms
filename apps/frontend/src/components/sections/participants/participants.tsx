import { AnimatedTooltip } from '../../ui/animated-tooltip';
import React from 'react';
import { PLAYER_SCORE_KEY } from '../../game';
import { myPlayer, usePlayersState } from 'playroomkit';

export const STARTING_PLAYER_SCORE = 0;

export default function CurrentPlayers() {
  const playersScore = usePlayersState(PLAYER_SCORE_KEY);

  return (
    <div className="flex gap-8">
      <AnimatedTooltip
        items={playersScore.map(({ player }) => ({
          id: player.id,
          name: player.getProfile().name,
          designation: `Score: ${player.getState(PLAYER_SCORE_KEY)}`,
          image: player.getProfile().photo,
        }))}
      />
    </div>
  );
}

export function increaseMyScore() {
  myPlayer().setState(
    PLAYER_SCORE_KEY,
    myPlayer().getState(PLAYER_SCORE_KEY) + 1
  );
}
