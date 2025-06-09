

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


// tasks

export const CreateTask: string = "/tasks/create-task/";

export const GetAllTasksByColumnId: string = "/tasks/get-all-tasks-by-column-id/";

export const GetAllTasksByBoardIdURL : string = "/tasks/get-all-tasks-by-board-id/"

export const IncreaseNumberOfColumnTasks : string = "/tasks/increase-number-of-column-tasks/"

export const DecreaseNumberOfColumnTasks : String = "/tasks/decrease-number-of-column-tasks/";

export const UpdateTaskByTaskId : String = "/tasks/update-task/";

export const DeleteTaskByTaskId : String = "/tasks/delete-task/";

// subtasks

export const IncreaseNumberOfTaskSubtasks: string = "/subtasks/increase-number-of-task-subtasks/";

export const CreateSubtask: string = "/subtasks/create-subtask/";

export const GetAllSubtasksByTaskId: string = "/subtasks/get-all-subtasks-by-task-id/";

export const DeleteSubTaskById: string = "/subtasks/delete-subtask/";

export const increaseNumberOfTaskSubtasks: string = "/subtasks/increase-number-of-task-subtasks/";

export const decreaseNumberOfTaskSubtasks: string = "/subtasks/increase-number-of-task-subtasks/";

export const increaseNumberOfTaskCompletedSubtasks: string = "/subtasks/increase-number-of-task-completed-subtasks/";

export const decreaseNumberOfTaskCompletedSubtasks: string = "/subtasks/decrease-number-of-task-completed-subtasks/";

export const UpdateSubtaskById: string = "/subtasks/update-subtask/";