import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  bus: null,
  error: "",
  loading: false,
};

export const addBus = createAsyncThunk(
  "bus/addBus",
  async ({ values, dispatch }) => {
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `bus/`,
        data: {
          ...values,
        },
      });

      dispatch(loadAllBus({ status: true, page: 1, count: 1000 }));
      return data.status === 1
        ? successHandler(data, "Bus added successfully")
        : data.status === 2627
        ? toast.warn("Bus number already exists, cannot enter same bus number")
        : toast.warn("Something went wrong...");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const deleteBus = createAsyncThunk("bus/deleteBus", async (id) => {
  try {
    const { data } = await axios({
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `bus/${id}`,
      data: {
        status: "false",
      },
    });

    return successHandler(data, "Bus deleted successfully");
  } catch (error) {
    return errorHandler(error, true);
  }
});

export const loadAllBus = createAsyncThunk("bus/loadAllBus", async (arg) => {
  try {
    const query = queryGenerator(arg);
    const { data } = await axios.get(`bus?${query}`);
    return successHandler(data);
  } catch (error) {
    return errorHandler(error);
  }
});

export const updateBus = createAsyncThunk(
  "bus/updateBus",
  async ({ id, values }, { dispatch }) => {
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/bus/${id}`,
        data: {
          ...values,
        },
      });

      return data.status === 1
        ? successHandler(data, "Bus updated successfully")
        : data.status === 2627
        ? toast.warn("Bus number already exists, cannot enter same bus number")
        : toast.warn("Something went wrong...");
    } catch (error) {
      return errorHandler(error);
    }
  }
);
const busSlice = createSlice({
  name: "Bus",
  initialState,
  reducers: {
    clearBus: (state) => {
      state.bus = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllBus ======

    builder.addCase(loadAllBus.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllBus.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.data?.data;
      state.total = action?.payload?.data?.count;
    });

    builder.addCase(loadAllBus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addBus======

    builder.addCase(addBus.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addBus.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload.data.data[0]);
      state.list = list;
    });

    builder.addCase(addBus.rejected, (state, action) => {
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

    // 4) ====== builders for deleteBus ======

    builder.addCase(deleteBus.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteBus.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteBus.rejected, (state, action) => {
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

export default busSlice.reducer;
export const { clearBus } = busSlice.actions;
