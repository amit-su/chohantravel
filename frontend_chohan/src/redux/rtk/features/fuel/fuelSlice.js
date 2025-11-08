import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  fuel: null,
  error: "",
  loading: false,
};

export const addFuel = createAsyncThunk(
  "fuel/addFuel",
  async ({ values, dispatch }) => {
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `fuel/`,
        data: {
          ...values,
        },
      });
      dispatch(loadAllFuel({ page: 1, count: 1000, status: true }));
      return successHandler(data, "Fuel added successfully");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const deleteFuel = createAsyncThunk("fuel/deleteFuel", async (id) => {
  try {
    const { data } = await axios({
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `fuel/${id}`,
      data: {
        status: "false",
      },
    });

    return successHandler(data, "Fuel deleted successfully", "warning");
  } catch (error) {
    return errorHandler(error, true);
  }
});

export const loadAllFuel = createAsyncThunk("fuel/loadAllFuel", async (arg) => {
  try {
    const query = queryGenerator(arg);
    const { data } = await axios.get(`fuel?${query}`);
    return successHandler(data);
  } catch (error) {
    return errorHandler(error);
  }
});

export const updateFuel = createAsyncThunk(
  "fuel/updateFuel",
  async ({ id, values, dispatch }) => {
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/fuel/${id}`,
        data: {
          ...values,
        },
      });
      dispatch(loadAllFuel({ page: 1, count: 1000, status: true }));
      return successHandler(data, data.message);
    } catch (error) {
      return errorHandler(error);
    }
  }
);
const fuelSlice = createSlice({
  name: "Fuel",
  initialState,
  reducers: {
    clearFuel: (state) => {
      state.fuel = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllFuel ======

    builder.addCase(loadAllFuel.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllFuel.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.data?.data;
      state.total = action?.payload?.data?.count;
    });

    builder.addCase(loadAllFuel.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addFuel======

    builder.addCase(addFuel.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addFuel.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload.data.data[0]);
      state.list = list;
    });

    builder.addCase(addFuel.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 3) ====== builders for loadSingleProductBrand ======

    // builder.addCase(loadSingleProductBrand.pending, (state) => {
    //   state.loading = true;
    // });

    // builder.addCase(loadSingleProductBrand.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.brand = action.payload?.data;
    // });

    // builder.addCase(loadSingleProductBrand.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload.message;
    // });

    // 4) ====== builders for deleteFuel ======

    builder.addCase(deleteFuel.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteFuel.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteFuel.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    // 5) ========= builders for update product brand ======
    // builder.addCase(updateProductBrand.pending, (state) => {
    //   state.loading = true;
    // })
    // builder.addCase(updateProductBrand.fulfilled, (state) => {
    //   state.loading = false;
    // })
    // builder.addCase(loadAllProductBrand.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload?.error
    //  })
  },
});

export default fuelSlice.reducer;
export const { clearFuel } = fuelSlice.actions;
