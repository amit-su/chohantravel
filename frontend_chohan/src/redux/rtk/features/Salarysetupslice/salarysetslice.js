import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  salarysetup: null,
  // cityList: [],
  error: "",
  loading: false,
  total: 0,
};

export const loadsalarysetupPaginated = createAsyncThunk(
  "salarysetup/loadsalarysetupPaginated",
  // async (param) => {
  //   try {
  //     const query = queryGenerator(param);
  //     const { data } = await axios.get(`advanceToStaffEntry?${query}`);
  //     return successHandler(data);
  //   } catch (error) {
  //     return errorHandler(error, true);
  //   }
  // }
  async (dateString) => {
    // Change the argument name to dateString
    try {
      const { data } = await axios.get(`salarysetup/${dateString}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const addSingleAdvanceToStaffEntry = createAsyncThunk(
  "salarysetup/addAdvanceToStaffEntry",
  async ({ values, dispatch }) => {
    try {
      const { data } = await axios({
        method: "post",
        url: `salarysetup/`,
        data: values,
      });
      dispatch(
        loadsalarysetupPaginated({ status: true, page: 1, count: 1000 })
      );
      return successHandler(data, "Entry added successfully");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const updateSalarysetup = createAsyncThunk(
  "salarysetup/updateSalarysetup",
  async ({ key, values, dispatch }) => {
    try {
      const { data } = await axios({
        method: "patch",
        url: `salarysetup/${key}`,
        data: values,
      });
      dispatch(loadsalarysetupPaginated(values.empType));
      return successHandler(data, "Entry added successfully");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const deleteSalarySetup = createAsyncThunk(
  "salarysetup/deleteSalarySetup",
  async (id) => {
    try {
      const { data } = await axios({
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `salarysetup/${id}`,
        data: {
          status: "false",
        },
      });

      return successHandler(data, "Salary setup deleted successfully");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

const SalarysetupEntrySlice = createSlice({
  name: "salarysetup",
  initialState,
  reducers: {
    clearAdvanceToStaffEntry: (state) => {
      state.salarysetup = [];
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAdvanceToStaffEntryPaginated ======

    builder.addCase(loadsalarysetupPaginated.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadsalarysetupPaginated.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload?.data?.data;
      console.log("statelist");
      // state.cityList = action.payload?.data.CityData;
      state.total = action.payload?.data?.count;
    });

    builder.addCase(loadsalarysetupPaginated.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

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

    builder.addCase(deleteSalarySetup.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteSalarySetup.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteSalarySetup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export default SalarysetupEntrySlice.reducer;
export const { clearAdvanceToStaffEntry } = SalarysetupEntrySlice.actions;
