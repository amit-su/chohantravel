import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  AdvanceToStaffEntry: null,
  cityList: [],
  error: "",
  loading: false,
  total: 0,
};

export const loadAdvanceToStaffEntryPaginated = createAsyncThunk(
  "advanceToStaffEntry/loadAdvanceToStaffEntryPaginated",
  // async (arg) => {
  //   try {
  //     const query = queryGenerator(arg);
  //     const { data } = await axios.get(`advanceToStaffEntry?${query}`);
  //     return successHandler(data);
  //   } catch (error) {
  //     return errorHandler(error);
  //   }
  // }
  async (dateString) => {
    // Change the argument name to dateString
    try {
      const { data } = await axios.get(`advanceToStaffEntry/${dateString}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const addSingleAdvanceToStaffEntry = createAsyncThunk(
  "advanceToStaffEntry/addAdvanceToStaffEntry",
  async ({ values, dispatch }) => {
    try {
      const { data } = await axios({
        method: "post",
        url: `advanceToStaffEntry/`,
        data: values,
      });
      dispatch(
        loadAdvanceToStaffEntryPaginated({ status: true, page: 1, count: 1000 })
      );
      return successHandler(data, "Entry added successfully");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const updateAdvanceToStaffEntry = createAsyncThunk(
  "advanceToStaffEntry/updateAdvanceToStaffEntry",
  async ({ id, values, dispatch }) => {
    try {
      const { data } = await axios({
        method: "patch",
        url: `advanceToStaffEntry/${id}`,
        data: values,
      });
      dispatch(
        loadAdvanceToStaffEntryPaginated({ status: true, page: 1, count: 1000 })
      );
      return successHandler(data, "Entry added successfully");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const deleteAdvanceToStaffEntry = createAsyncThunk(
  "advanceToStaffEntry/deleteAdvanceToStaffEntry",
  async (id) => {
    try {
      const { data } = await axios({
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `advanceToStaffEntry/${id}`,
        data: {
          status: "false",
        },
      });

      return successHandler(
        data,
        "AdvanceToStaffEntry deleted successfully",
        "warning"
      );
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

const advanceToStaffEntrySlice = createSlice({
  name: "AdvanceToStaffEntry",
  initialState,
  reducers: {
    clearAdvanceToStaffEntry: (state) => {
      state.AdvanceToStaffEntry = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAdvanceToStaffEntryPaginated ======

    builder.addCase(loadAdvanceToStaffEntryPaginated.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      loadAdvanceToStaffEntryPaginated.fulfilled,
      (state, action) => {
        state.loading = false;
        state.list = action.payload?.data?.data;
        // state.cityList = action.payload?.data.CityData;
        state.total = action.payload?.data?.count;
      }
    );

    builder.addCase(
      loadAdvanceToStaffEntryPaginated.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      }
    );

    // 2) ====== builders for addSingleAdvanceToStaffEntry ======

    builder.addCase(addSingleAdvanceToStaffEntry.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addSingleAdvanceToStaffEntry.fulfilled, (state, action) => {
      state.loading = false;

      if (action.payload?.data?.status === 1) {
        if (!Array.isArray(state.list)) {
          state.list = [];
        }
        const list = [...state.list];
        list.unshift(action.payload?.data?.data[0]);
        state.list = list;
      } else {
        // Handle the case where status is not 1 (error status)
        state.error = action.payload?.data?.message;
      }
    });

    builder.addCase(addSingleAdvanceToStaffEntry.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 3) ====== builders for loadSingleMenu ======

    // builder.addCase(loadSingleMenu.pending, (state) => {
    //   state.loading = true;
    // });

    // builder.addCase(loadSingleMenu.fulfilled, (state, action) => {
    //   state.loading = false;
    //   console.log("Payload", action.payload);
    //   state.color = action.payload?.data;
    // });

    // builder.addCase(loadSingleMenu.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload.message;
    // });

    // 4) ====== builders for updateColor ======

    // builder.addCase(updateMenu.pending, (state) => {
    //   state.loading = true;
    // });

    // builder.addCase(updateMenu.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.color = action.payload?.data;
    // });

    // builder.addCase(updateMenu.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload.message;
    // });
    // 4) ====== builders for deleteMenu ====== changed Vtax

    builder.addCase(deleteAdvanceToStaffEntry.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteAdvanceToStaffEntry.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteAdvanceToStaffEntry.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export default advanceToStaffEntrySlice.reducer;
export const { clearAdvanceToStaffEntry } = advanceToStaffEntrySlice.actions;
