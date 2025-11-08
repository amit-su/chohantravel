import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";
import dayjs from "dayjs";

const initialState = {
  list: null,
  total: 0,
  dailyExecution: null,
  error: "",
  loading: false,
};

export const addDailyExecution = createAsyncThunk(
  "dailyExecution/addDailyExecution",
  async ({ values, dispatch }) => {
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `dailyExecution/`,
        data: {
          ...values,
        },
      });
      dispatch(
        loadAllDailyExecution({
          status: dayjs().format("YYYY-MM-DD"),
          page: 1,
          count: 1000,
        })
      );

      return successHandler(data, "DailyExecution added successfully");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const deleteDailyExecution = createAsyncThunk(
  "dailyExecution/deleteDailyExecution",
  async (id) => {
    try {
      const { data } = await axios({
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `dailyExecution/${id}`,
        data: {
          status: "false",
        },
      });

      return successHandler(
        data,
        "DailyExecution deleted successfully",
        "warning"
      );
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

// export const loadSingleProductBrand = createAsyncThunk(
//   "productBrand/loadSingleProductBrand",
//   async (id) => {
//     try {
//       const { data } = await axios.get(`product-brand/${id}`);
//       return successHandler(data);
//     } catch (error) {
//       return errorHandler(error);
//     }
//   }
// );

// export const loadAllDailyExecution = createAsyncThunk(
//   "dailyExecution/loadAllDailyExecution",
//   async (arg) => {
//     try {
//       const query = queryGenerator(arg);
//       const { data } = await axios.get(`dailyExecution?${query}`);
//       return successHandler(data);
//     } catch (error) {
//       return errorHandler(error);
//     }
//   }
// );
export const loadAllDailyExecution = createAsyncThunk(
  "dailyExecution/loadAllDailyExecution",
  async (dateString) => {
    // Change the argument name to dateString
    try {
      const { data } = await axios.get(`dailyExecution/${dateString}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const updateDailyExecution = createAsyncThunk(
  "dailyExecution/updateDailyExecution",
  async ({ id, values }) => {
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/dailyExecution/${id}`,
        data: {
          ...values,
        },
      });

      return successHandler(data, data.message);
    } catch (error) {
      return errorHandler(error);
    }
  }
);
const dailyExecutionSlice = createSlice({
  name: "DailyExecution",
  initialState,
  reducers: {
    clearDailyExecution: (state) => {
      state.dailyExecution = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllDailyExecution ======

    builder.addCase(loadAllDailyExecution.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllDailyExecution.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.data?.data;
      state.total = action?.payload?.data?.count;
    });

    builder.addCase(loadAllDailyExecution.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addDailyExecution======

    builder.addCase(addDailyExecution.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addDailyExecution.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload.data.data[0]);
      state.list = list;
    });

    builder.addCase(addDailyExecution.rejected, (state, action) => {
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

    // 4) ====== builders for deleteDailyExecution ======

    builder.addCase(deleteDailyExecution.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteDailyExecution.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteDailyExecution.rejected, (state, action) => {
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

export default dailyExecutionSlice.reducer;
export const { clearDailyExecution } = dailyExecutionSlice.actions;
