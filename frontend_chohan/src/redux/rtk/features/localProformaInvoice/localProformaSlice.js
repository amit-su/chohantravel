import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  list: [],
  total: 0,
  localProforma: null,
  error: "",
  loading: false,
};

const localProformaSlice = createSlice({
  name: "LocalProforma",
  initialState,
  reducers: {
    addLocalProforma: (state, action) => {
      const booking = action.payload;
      state.list.push(booking);
      state.total += 1;
    },

    deleteLocalProforma: (state, action) => {
      const SLNO = action.payload;
      console.log("action.payload", action.payload, state.list);

      // Remove the item with matching SLNO
      const newList = state.list.filter((item) => item.SLNO !== SLNO);
      console.log("new list", newList);

      return {
        ...state,
        list: newList,
        total: Math.max(state.total - 1, 0), // Optional safety
      };
    },

    updateLocalProforma: (state, action) => {
      const { id, values } = action.payload;
      console.log(" action.payload", action.payload);
      const index = state.list.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...values };
      }
    },
    clearLocalProforma: (state) => {
      state.list = []; // Reset the list array to an empty array
      state.total = 0;
    },
  },
});

export const {
  addLocalProforma,
  deleteLocalProforma,
  updateLocalProforma,
  clearLocalProforma,
} = localProformaSlice.actions;

export default localProformaSlice.reducer;
