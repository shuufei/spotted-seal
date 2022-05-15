import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type State = {
  ui: {
    shouldShowSecurityCheckView: boolean;
  };
};

const initialState: State = {
  ui: {
    shouldShowSecurityCheckView: false,
  },
};

const vsSlice = createSlice({
  name: 'vs',
  initialState,
  reducers: {
    setShouldShowSecurityCheckView: (
      state,
      action: PayloadAction<Pick<State['ui'], 'shouldShowSecurityCheckView'>>
    ) => {
      state.ui.shouldShowSecurityCheckView =
        action.payload.shouldShowSecurityCheckView;
      return state;
    },
  },
});

export const actions = vsSlice.actions;

export const reducers = vsSlice.reducer;

export const name = vsSlice.name;

const selectSelf = (state: { [name]: State }) => state[name];
const uiStateSelector = createSelector(selectSelf, (state) => state.ui);
export const selectors = {
  selectSelf,
  uiStateSelector,
};
