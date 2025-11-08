import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  staffAttendance: null,
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

export const loadAllStaffAttendance = createAsyncThunk(
  "staffAttendance/loadAllStaffAttendance",
  async ({ requestArgs, selectedMonth }) => {
    try {
      const query = queryGenerator(requestArgs);
      const { data } = await axios.get(`staffatten?${query}`, {
        params: { selectedMonth },
      });
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const updateStaffAttendance = createAsyncThunk(
  "staffAttendance/updateStaffAttendance",
  async ({ id, values }, { dispatch }) => {
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/staffatten/${id}`,
        data: {
          ...values,
        },
      });
      // dispatch(loadAllDriverHelperAttendance());
      // return successHandler(data, data.message);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

const staffAttendanceSlice = createSlice({
  name: "StaffAttendance",
  initialState,
  reducers: {
    clearStaffAttendance: (state) => {
      state.staffAttendance = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllDriverHelperAttendance ======

    builder.addCase(loadAllStaffAttendance.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllStaffAttendance.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.data?.data;
      state.total = action?.payload?.data?.count;
    });

    builder.addCase(loadAllStaffAttendance.rejected, (state, action) => {
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

export default staffAttendanceSlice.reducer;
export const { clearStaffAttendance } = staffAttendanceSlice.actions;
