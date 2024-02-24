import { gameSdk } from './game-client';

describe('gameSdk', () => {
  it('should work', () => {
    expect(gameSdk()).toEqual('game-client');
  });
});
