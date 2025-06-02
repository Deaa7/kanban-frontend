

export const BaseURL: string = "http://127.0.0.1:8000";


/// boards 

export const GetAllBoards: string = "/board/create-board/";

export const CreateBoard: string = "/board/create-board/";

export const EditBoard: string = "/board/update-board/";

export const DeleteBoard: string = "/board/delete-board/";



/// columns 

export const CreateColumn: string = "/columns/create-column/";

export const EditColumn: string = "/columns/update-column/";

export const GetAllColumnsByBoardIdURL: string = "/columns/get-all-columns-by-board-id/";

export const DeleteColumn: String = '/columns/delete-column/';

export const IncreaseNumberOfColumnTasks : String = "/tasks/increase-number-of-column-tasks/";

// tasks

export const CreateTask: string = "/tasks/create-task/";

export const IncreaseNumberOfTaskSubtasks: string = "/subtasks/increase-number-of-task-subtasks/";

export const GetAllTasksByColumnId : string = "/tasks/get-all-tasks-by-column-id/"


// subtasks

export const CreateSubtask: string = "/subtasks/create-subtask/";