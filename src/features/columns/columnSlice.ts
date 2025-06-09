import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BaseURL, GetAllColumnsByBoardIdURL } from "../../API/Apis";
import axios from "axios";
import type { columnType, StoreState } from "@/types/types";

type initialStateType = {
  columns: columnType[];
};

const initialState: initialStateType = {
  columns: [],
};

export const GetAllColumnsByBoardId = createAsyncThunk(
  "columns/get-all-columns",
  async () => {
    const url: string =
      BaseURL +
      GetAllColumnsByBoardIdURL +
      localStorage.getItem('selected-board') +
      "/";
    const response = await axios.get(url);
    return response.data;
  }
);

const ColumnSlice = createSlice({
  name: "column",
  initialState,
  reducers: {
    editColumn: (state, action) => {
      state.columns = state.columns.map((col) => {
        if (col.id === action.payload.id) return action.payload;
        return col;
      });
      localStorage.setItem('columns', JSON.stringify(state.columns));
    },
    fixingNumberOfColumnTasks: (state, action) => {
      state.columns = state.columns.map((col) => {
        let temp = col;

        if (col.id === action.payload.newId) temp.number_of_tasks++;
        else if (col.id === action.payload.oldId) temp.number_of_tasks--;

        return temp;
      });
    localStorage.setItem('columns', JSON.stringify(state.columns));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(GetAllColumnsByBoardId.fulfilled, (state, action) => {
      let res = action.payload;
      if (!res) return;
      let columns = JSON.stringify(action.payload);
      state.columns = res;
      localStorage.setItem("columns", columns);
    });
  },
});

export default ColumnSlice.reducer;

export const { editColumn, fixingNumberOfColumnTasks } = ColumnSlice.actions;

export const getColumns = (state: StoreState): columnType[] =>
  state.column.columns;
