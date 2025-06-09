import type { store } from "@/app/store";

export type StoreState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type boardItemType = {
  id: number;
  name: string;
};

export type columnType = {
  name: string;
  id: number;
  board_id: number;
  number_of_tasks: number;
};

export type taskType = {
  id?: number,
  name: string,
  description:string,
  column_id: number,
  board_id: number,
  number_of_subtasks: number,
  number_of_completed_subtasks: number,
  status : string ,
}

export type subtaskType = {
  name: string,
  task_id: number,
  is_done: boolean,
  id: number,
}
 
 