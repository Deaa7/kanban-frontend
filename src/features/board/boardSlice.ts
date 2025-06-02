import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  BaseURL,
  GetAllBoards,
  GetAllColumnsByBoardIdURL,
} from "../../API/Apis";
import axios from "axios";
import type { StoreState } from "../../app/store";

type boardItemType = {
  id: number;
  name: string;
};

type columnType = {
  name: string;
  id: number;
  board_id: number;
  number_of_tasks: number;
};
type initialStateType = {
  theme: string;
  numberOfBoardItems: number;
  boardItems: boardItemType[];
  selectedBoardId: number;
  showSidebar: boolean;
  columns: columnType[];
};

let CurrentTheme = localStorage.getItem("theme");

if (!CurrentTheme) {
  CurrentTheme = window.matchMedia("(prefers-color-scheme:dark)").matches
    ? "dark"
    : "light";
  localStorage.setItem("theme", CurrentTheme);
}

let temp: string | null = localStorage.getItem("showSidebar");

let CurrentSidebarState: boolean = true;

if (!temp) {
  CurrentSidebarState = true;
  localStorage.setItem("showSidebar", "true");
} else {
  CurrentSidebarState = temp === "true";
}

const initialState: initialStateType = {
  theme: CurrentTheme,
  numberOfBoardItems: 0,
  selectedBoardId: -1,
  showSidebar: CurrentSidebarState,
  boardItems: [
    {
      id: 1,
      name: "default board",
    },
  ],
  columns: [
    { name: "FrontEnd", id: 1, board_id: 1, number_of_tasks: 3 },
    { name: "Backend", id: 2, board_id: 1, number_of_tasks: 2 },
    { name: "Testing", id: 2, board_id: 1, number_of_tasks: 1 },
  ],
};

export const GetBoardItems = createAsyncThunk(
  "boards/get-all-boards",
  async () => {
    let url: string = BaseURL + GetAllBoards;

    const response = await axios.get(url);

    return response.data;
  }
);

// get all columns for the selected board and store them in store state and cache
export const GetAllColumnsByBoardId = createAsyncThunk(
  "columns/get-all-columns-by-board-id",
  async () => {
    if (initialState.selectedBoardId < 0) {
      return Promise.reject("there is no board");
    }

    let url: string =
      BaseURL + GetAllColumnsByBoardIdURL + initialState.selectedBoardId + "/";
    let res = await axios.get(url);
    return res.data;
  }
);

const BoardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    selectBoard: (state, action) => {
      state.selectedBoardId = action.payload;
    },
    addBoard: (state, action) => {
      state.boardItems.push(action.payload);
      state.numberOfBoardItems += 1;
    },
    editBoard: (state, action) => {
      state.boardItems = state.boardItems.map((board) =>
        board.id === action.payload.id
          ? { ...board, name: action.payload.name }
          : board
      );
    },
    deleteBoard: (state, action) => {
      state.boardItems = state.boardItems.filter(
        (board) => board.id !== action.payload.id
      );
      state.numberOfBoardItems -= 1;
      state.selectedBoardId = state.boardItems[0].id ?? -1;
    },

    addColumn: (state, action) => {
      state.columns.push(action.payload)
    },
    removeColumn: (state, action) => {
      state.columns = state.columns.filter(col => col.id !== action.payload);
    },
     editColumn: (state, action) => {
     state.columns = state.columns.map((col) =>
        col.id === action.payload.id
          ? { ...col, name: action.payload.name }
          : col
      );
    },

    toggleTheme: (state) => {
      let oldTheme = state.theme;
      state.theme = oldTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
    },
    changeSidebarState: (state) => {
      state.showSidebar = !state.showSidebar;

      localStorage.setItem("showSidebar", state.showSidebar.toString());
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetBoardItems.fulfilled, (state, action) => {
        let res = action.payload;
        if (!res) return;
        state.boardItems = res;
        state.numberOfBoardItems = res.length;
        state.selectedBoardId = res[0].id ?? -1;
      })
      .addCase(GetAllColumnsByBoardId.fulfilled, (state, action) => {
        let res = action.payload;

        state.columns = res;
      });
  },
});

export default BoardSlice.reducer;

export const {
  selectBoard,
  toggleTheme,
  changeSidebarState,
  addBoard,
  deleteBoard,
  editBoard,
  addColumn,
  editColumn,
  removeColumn,
} = BoardSlice.actions;

export const getBoardItems = (state: StoreState) => state.board.boardItems;
export const getNumberOfBoardItems = (state: StoreState) =>
  state.board.numberOfBoardItems;
export const getSelectedBoardId = (state: StoreState) =>
  state.board.selectedBoardId;

export const getSelectedBoardInfo = (state: StoreState) => {
  let selectedBoardId = state.board.selectedBoardId;
  let info: boardItemType | undefined;
  info = state.board.boardItems.find((board) => board.id === selectedBoardId);

  return info;
};
export const getTheme = (state: StoreState) => state.board.theme;

export const getSidebarState = (state: StoreState) => state.board.showSidebar;

export const getAllColumnsData = (state: StoreState) => state.board.columns;
