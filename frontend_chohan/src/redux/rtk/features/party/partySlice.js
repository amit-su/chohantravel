import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";
import { message } from "antd";
import { toast } from "react-toastify";

const initialState = {
  list: null,
  Party: null,
  cityList: [],
  error: "",
  loading: false,
  total: 0,
};

export const loadPartyPaginated = createAsyncThunk(
  "party/loadPartyPaginated",
  async (arg) => {
    try {
      const query = queryGenerator(arg);
      //  const { data } = await axios.get(`party?${query}`);
      const { data } = await axios({
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `party?${query}`,
      });
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const addSingleParty = createAsyncThunk(
  "party/addParty",
  async (values) => {
    try {
      const { data, status } = await axios({
        method: "post",
        url: `party/`,
        data: values,
      });
      return data.status === 1
        ? successHandler(data, "Party added successfully")
        : data.status === 2627
        ? toast.warn("Party name already exists, cannot enter same Party name")
        : toast.warn("Something went wrong...");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const updateParty = createAsyncThunk(
  "party/updateParty",
  async ({ id, values, dispatch }) => {
    try {
      const { data } = await axios({
        method: "patch",
        url: `party/${id}`,
        data: values,
      });
      dispatch(loadPartyPaginated({ status: true, page: 1, count: 1000 }));
      return data.status === 1
        ? successHandler(data, "Party added successfully")
        : data.status === 2627
        ? toast.warn("Party name already exists, cannot enter same Party name")
        : toast.warn("Something went wrong...");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const deleteParty = createAsyncThunk("party/deleteParty", async (id) => {
  try {
    const { data } = await axios({
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `party/${id}`,
      data: {
        status: "false",
      },
    });

    return successHandler(data, "Party deleted successfully", "warning");
  } catch (error) {
    return errorHandler(error, true);
  }
});

const partySlice = createSlice({
  name: "Party",
  initialState,
  reducers: {
    clearParty: (state) => {
      state.Party = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadPartyPaginated ======

    builder.addCase(loadPartyPaginated.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadPartyPaginated.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload?.data?.data;

      if (action.payload?.data && action.payload?.data.CityData) {
        state.cityList = action.payload?.data.CityData;
      }
      state.total = action.payload?.data?.count;
    });

    builder.addCase(loadPartyPaginated.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addSingleParty ======

    builder.addCase(addSingleParty.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addSingleParty.fulfilled, (state, action) => {
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

    builder.addCase(addSingleParty.rejected, (state, action) => {
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

    builder.addCase(deleteParty.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteParty.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteParty.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export default partySlice.reducer;
export const { clearParty } = partySlice.actions;
