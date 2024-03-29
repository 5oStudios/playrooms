import { createSlice } from '@reduxjs/toolkit';

enum GameState {
  active = 'active',
  inactive = 'inactive',
}

const mockedGames = [
  {
    title: 'trivia',
    description: 'Test your knowledge',
    image: 'https://via.placeholder.com/150',
    state: GameState.active,
    chip: 'Nakama',
  },
  {
    title: 'Kingo',
    description: 'Play with a friend',
    image: 'https://via.placeholder.com/150',
    state: GameState.inactive,
    chip: 'Kingo',
  },
];

const platformSlice = createSlice({
  name: 'platform',
  initialState: {
    games: mockedGames,
  },
  reducers: {},
});

export default platformSlice.reducer;
