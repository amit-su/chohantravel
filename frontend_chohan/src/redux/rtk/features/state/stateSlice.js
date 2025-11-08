import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  stateList: null,
  error: "",
  loading: false,
};

export const addState = createAsyncThunk("state/addState", async (values) => {
  try {
    const { data } = await axios({
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `state/`,
      data: {
        ...values,
      },
    });

    return successHandler(data, "State added successfully");
  } catch (error) {
    return errorHandler(error, true);
  }
});

export const deleteState = createAsyncThunk("state/deleteState", async (id) => {
  try {
    const { data } = await axios({
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `state/${id}`,
      data: {
        status: "false",
      },
    });

    return successHandler(data, "State deleted successfully", "warning");
  } catch (error) {
    return errorHandler(error, true);
  }
});

export const loadAllState = createAsyncThunk(
  "state/loadAllState",
  async (arg) => {
    try {
      const query = queryGenerator(arg);
      const { data } = await axios.get(`state?${query}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const updateState = createAsyncThunk(
  "state/updateState",
  async ({ id, values }, { dispatch }) => {
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/state/${id}`,
        data: {
          ...values,
        },
      });
      // dispatch(loadAllState());
      return successHandler(data, data.message);
    } catch (error) {
      return errorHandler(error);
    }
  }
);
const stateSlice = createSlice({
  name: "StateNames",
  initialState,
  reducers: {
    clearState: (state) => {
      state.stateList = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllState ======

    builder.addCase(loadAllState.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllState.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.data?.data;
      state.total = action?.payload?.data?.count;
    });

    builder.addCase(loadAllState.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addState======

    builder.addCase(addState.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addState.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload.data.data[0]);
      state.list = list;
    });

    builder.addCase(addState.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 4) ====== builders for deleteState ======

    builder.addCase(deleteState.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteState.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteState.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export default stateSlice.reducer;
export const { clearState } = stateSlice.actions;
