import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
    list: null,
    total: 0,
    invoiceEntry: null,
    error: "",
    loading: false,
};

export const loadAllInvoiceEntry = createAsyncThunk(
    "invoiceEntry/loadAllInvoiceEntry",
    async (arg) => {
        try {
            const query = queryGenerator(arg);
            const { data } = await axios.get(`/invoiceentry?${query}`);
            return successHandler(data);
        } catch (error) {
            return errorHandler(error);
        }
    }
);

const invoiceEntrySlice = createSlice({
    name: "invoiceEntry",
    initialState,
    reducers: {
        clearInvoiceEntry: (state) => {
            state.invoiceEntry = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadAllInvoiceEntry.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(loadAllInvoiceEntry.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action?.payload?.data?.data;
            state.total = action?.payload?.data?.count;
        });

        builder.addCase(loadAllInvoiceEntry.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });
    },
});

export default invoiceEntrySlice.reducer;
export const { clearInvoiceEntry } = invoiceEntrySlice.actions;
