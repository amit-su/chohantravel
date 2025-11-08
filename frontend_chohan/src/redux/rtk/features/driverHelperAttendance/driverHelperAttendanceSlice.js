import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  driverHelperAttendance: null,
  error: "",
  loading: false,
};

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

export const loadAllDriverHelperAttendance = createAsyncThunk(
  "driverHelperAttendance/loadAllDriverHelperAttendance",
  async ({ requestArgs, selectedMonth }) => {
    try {
      const query = queryGenerator(requestArgs);
      const { data } = await axios.get(`driverHelperAttendance?${query}`, {
        params: { selectedMonth },
      });
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const updateDriverHelperAttendance = createAsyncThunk(
  "driverHelperAttendance/updateDriverHelperAttendance",
  async ({ id, values }, { dispatch }) => {
    console.log(id, values);
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/driverHelperAttendance/${id}`,
        data: {
          ...values,
        },
      });
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const createDriverHelperAttendance = createAsyncThunk(
  "driverHelperAttendance/createDriverHelperAttendance",
  async ({ id, values }, { dispatch }) => {
    try {
      const { data } = await axios({
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/driverHelperAttendance/create`,
        data: {
          attendance: values, // Wrap the array in an 'attendance' property
        },
      });
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

const driverHelperAttendanceSlice = createSlice({
  name: "DriverHelperAttendance",
  initialState,
  reducers: {
    clearDriverHelperAttendance: (state) => {
      state.driverHelperAttendance = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllDriverHelperAttendance ======

    builder.addCase(loadAllDriverHelperAttendance.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      loadAllDriverHelperAttendance.fulfilled,
      (state, action) => {
        state.loading = false;
        state.list = action?.payload?.data?.data;
        state.total = action?.payload?.data?.count;
      }
    );

    builder.addCase(loadAllDriverHelperAttendance.rejected, (state, action) => {
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
  },
});

export default driverHelperAttendanceSlice.reducer;
export const { clearDriverHelperAttendance } =
  driverHelperAttendanceSlice.actions;
