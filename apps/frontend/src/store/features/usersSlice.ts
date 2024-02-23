import { createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { Client, Session, User } from '@heroiclabs/nakama-js';
import { RootState } from '../store';

// Define the state type
interface UsersState {
  currentUser: User | null;
  users: User[] | null;
  error: string | null;
}

const initialState: UsersState = {
  currentUser: null,
  users: null,
  error: null,
};

// Create a slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchCurrentUserSuccess(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      state.error = null;
    },
    fetchCurrentUserFailure(state, action: PayloadAction<string>) {
      state.currentUser = null;
      state.error = action.payload;
    },
    fetchUsersSuccess(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
      state.error = null;
    },
    fetchUsersFailure(state, action: PayloadAction<string>) {
      state.users = null;
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  fetchCurrentUserSuccess,
  fetchCurrentUserFailure,
  fetchUsersSuccess,
  fetchUsersFailure,
  clearError,
} = usersSlice.actions;

export default usersSlice.reducer;

// Thunks for async actions
export const fetchCurrentUser =
  (): ThunkAction<void, RootState, Client, any> =>
  async (dispatch, getState, nakamaClient) => {
    try {
      const session: Session = getState().auth.session; // Assuming you have auth slice for storing session
      if (session) {
        const user: User = await nakamaClient.getAccount(session);
        dispatch(fetchCurrentUserSuccess(user));
      } else {
        dispatch(fetchCurrentUserFailure('No session found.'));
      }
    } catch (error) {
      dispatch(fetchCurrentUserFailure(error.message));
    }
  };

export const fetchUsers =
  (): ThunkAction<void, RootState, Client, any> =>
  async (dispatch, getState, nakamaClient) => {
    try {
      const users: User[] = await nakamaClient.getUsers();
      dispatch(fetchUsersSuccess(users));
    } catch (error) {
      dispatch(fetchUsersFailure(error.message));
    }
  };

// Add more thunks for other user-related actions (e.g., update profile)
