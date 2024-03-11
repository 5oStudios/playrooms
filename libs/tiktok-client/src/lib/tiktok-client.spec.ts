import { tiktokClient } from './tiktok-client';

describe('tiktokClient', () => {
  it('should work', () => {
    expect(tiktokClient()).toEqual('tiktok-client');
  });
});
