import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "../features/sidebar/sidebarSlice";
import boardReducer from "../features/board/boardSlice";
import taskReducer from "../features/tasks/tasksSlice";
import columnReducer from "../features/columns/columnSlice";

export const store = configureStore({
  reducer: {
    column: columnReducer,
    sidebar: sidebarReducer,
    board: boardReducer,
    task: taskReducer,
  },
});
