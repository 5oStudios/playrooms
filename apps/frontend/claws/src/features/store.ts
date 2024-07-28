import { configureStore } from '@reduxjs/toolkit';

import { clawsRoomReducer } from './claws/slice';

export default configureStore({
  reducer: {
    clawsRoom: clawsRoomReducer,
  },
});
