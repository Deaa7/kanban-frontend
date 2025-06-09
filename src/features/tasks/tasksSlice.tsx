import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BaseURL, GetAllTasksByBoardIdURL } from "../../API/Apis";
import axios from "axios";
import type { StoreState, taskType } from "@/types/types";

type initialStateType = {
  tasks: taskType[];
};

const initialState: initialStateType = {
  tasks: [],
};

export const GetAllTasksByBoardId = createAsyncThunk(
  "tasks/get-all-tasks",
  async () => {
    let url: string =
      BaseURL +
      GetAllTasksByBoardIdURL +
      localStorage.getItem("selected-board") +
      "/";
    const response = await axios.get(url);
    return response.data;
  }
);

const TasksSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    editTask: (state, action) => {
      state.tasks = state.tasks.map((task: taskType) => {
        let temp = task;
        if (task.id === action.payload.id) {
          (temp.column_id = action.payload?.column_id ?? temp.column_id),
            (temp.description =
              action.payload?.description ?? temp.description);
          temp.name = action.payload?.name ?? temp.name;
          temp.number_of_completed_subtasks =
            action.payload?.number_of_completed_subtasks ??
            temp.number_of_completed_subtasks;
          temp.number_of_subtasks =
            action.payload?.number_of_subtasks ?? temp.number_of_subtasks;
        }
        return temp;
      });
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(
        (task: taskType) => task.id !== action.payload
      );
    },
    IncreaseNumberOfSubtasksInTask: (state, action) => {
      state.tasks = state.tasks.map((task: taskType) => {
        let temp = task;
        if (task.id === action.payload) {
          temp.number_of_completed_subtasks++;
        }
        return temp;
      });
    },
    DecreaseNumberOfSubtasksInTask: (state, action) => {
      state.tasks = state.tasks.map((task: taskType) => {
        let temp = task;
        if (task.id === action.payload) {
          temp.number_of_completed_subtasks--;
        }
        return temp;
      });
    },
  },

  extraReducers: (builder) => {
    builder.addCase(GetAllTasksByBoardId.fulfilled, (state, action) => {
      const res = action.payload;
      if (!res) return;
      state.tasks = res;
    });
  },
});

export default TasksSlice.reducer;

export const { setTasks, addTask, deleteTask, editTask  , IncreaseNumberOfSubtasksInTask ,DecreaseNumberOfSubtasksInTask} = TasksSlice.actions;

export const getAllTasks = (state: StoreState) => state.task.tasks;

export const getAllTasksByColumnId = (state: StoreState, column_id: number) =>
  state.task.tasks.filter((task) => task.column_id == column_id);
