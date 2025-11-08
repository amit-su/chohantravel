import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  list: [],
  total: 0,
  localBooking: null,
  error: "",
  loading: false,
};

const localBookingSlice = createSlice({
  name: "LocalBooking",
  initialState,
  reducers: {
    addLocalBooking: (state, action) => {
      const booking = action.payload;
      state.list.push(booking);
      state.total += 1;
    },
    deleteLocalBooking: (state, action) => {
      const SLNO = action.payload;
      // Use filter to create a new array excluding the item to be deleted
      const newList = state.list.filter((item) => item.ID !== SLNO);

      return {
        ...state,
        list: newList,
        total: state.total - 1,
      };
    },
    updateLocalBooking: (state, action) => {
      const { id, values } = action.payload;
      console.log(" action.payload", action.payload);
      const index = state.list.findIndex((item) => item.ID === id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...values };
      }
    },
    clearLocalBooking: (state) => {
      state.list = []; // Reset the list array to an empty array
      state.total = 0;
    },
  },
});

export const {
  addLocalBooking,
  deleteLocalBooking,
  updateLocalBooking,
  clearLocalBooking,
} = localBookingSlice.actions;

export default localBookingSlice.reducer;
