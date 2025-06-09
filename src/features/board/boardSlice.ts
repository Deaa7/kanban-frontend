import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BaseURL, GetAllBoards } from "../../API/Apis";
import axios from "axios";
import type { boardItemType, StoreState } from "@/types/types";

type initialStateType = {
  boardItems: boardItemType[];
  selectedBoardId: number;
};

const initialState: initialStateType = {
  selectedBoardId: -1,
  boardItems: [],
};

export const GetBoardItems = createAsyncThunk(
  "boards/get-all-boards",
  async () => {
    const url: string = BaseURL + GetAllBoards;
    const response = await axios.get(url);
    return response.data;
  }
);

const BoardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoards: (state, action) => {
      state.boardItems = action.payload;
      state.selectedBoardId = state.boardItems[0].id;
      localStorage.setItem("selected-board", action.payload[0].id);
       localStorage.setItem("selected-board-name", action.payload[0].name);
    },
    selectBoard: (state, action) => {
      state.selectedBoardId = action.payload.id;
      localStorage.setItem("selected-board", action.payload.id);
      localStorage.setItem("selected-board-name",   action.payload.name);
    },
    addBoard: (state, action) => {
      state.boardItems.push(action.payload);
    },
    editBoard: (state, action) => {
      localStorage.setItem("selected-board-name", action.payload.name);
      state.boardItems = state.boardItems.map((board) => {
        if (board.id === action.payload.id) {
          return { ...board, name: action.payload.name };
        } else return board;
      });
    },
    deleteBoard: (state, action) => {
      state.boardItems = state.boardItems.filter(
        (board) => board.id !== action.payload.id
      );
      state.selectedBoardId = state.boardItems[0].id ?? -1;
      localStorage.setItem("selected-board", state.boardItems[0].id.toString());
      localStorage.setItem("selected-board-name", state.boardItems[0].name);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(GetBoardItems.fulfilled, (state, action) => {
      const res = action.payload;
      if (!res) return;
      state.boardItems = res;
      state.selectedBoardId = res[0].id ?? 0;
      if (res[0].id) {
        localStorage.setItem("selected-board", res[0].id);
        localStorage.setItem("selected-board-name", res[0].name);
      }
    });
  },
});

export default BoardSlice.reducer;

export const { setBoards, selectBoard, addBoard, deleteBoard, editBoard } =
  BoardSlice.actions;

export const getBoardItems = (state: StoreState) => state.board.boardItems;
export const getNumberOfBoardItems = (state: StoreState) =>
  state.board.boardItems.length;

export const getSelectedBoardId = (state: StoreState): number =>
  state.board.selectedBoardId;

export const getSelectedBoardInfo = (state: StoreState) => {
  const selectedBoardId = state.board.selectedBoardId;
  let info: boardItemType | undefined;

  info = state.board.boardItems.find((board) => board.id === selectedBoardId);

  return info;
};
