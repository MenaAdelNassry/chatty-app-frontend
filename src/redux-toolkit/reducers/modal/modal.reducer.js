import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  type: 'add', // 'add' | 'edit'
  data: null, // If we're editing, we'll put the post details here.
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.type = action.payload?.type || 'add';
      state.data = action.payload?.data || null;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.type = 'add';
      state.data = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
