import { GameClient } from './game-client';

describe('gameSdk', () => {
  it('should work', () => {
    expect(new GameClient()).toEqual('game-client');
  });
});
