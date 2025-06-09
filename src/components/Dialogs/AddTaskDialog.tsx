//hooks
import { useState } from "react";
import { useDispatch } from "react-redux";

//components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

//icons
import { XIcon } from "lucide-react";

//api
import axios from "axios";
import { BaseURL, CreateSubtask, CreateTask, IncreaseNumberOfColumnTasks } from "@/API/Apis";

//functions
import { addTask } from "@/features/tasks/tasksSlice";
import { toast } from "sonner";

//types
import type { columnType, taskType } from "@/types/types";
import { editColumn } from "@/features/columns/columnSlice";

type AddTaskStateType = {
  title: string;
  description: string;
  subTasks: string[];
  status: number;
  board_id: number;
};

 
export default function AddTaskDialog({
  children,
}: {
  children: React.ReactNode;
  }) {
  
  
  let currentBoardId: number = JSON.parse(
    localStorage.getItem("selected-board") ?? "0"
  );
  let columnsArray: columnType[] = JSON.parse(
    localStorage.getItem("columns") ?? "[]"
  );

  let dispatch = useDispatch();

  let [{ title, description, subTasks, status }, setAddTasksState] =
    useState<AddTaskStateType>({
      title: "New Task",
      description: "",
      subTasks: ["Subtask 1", "Subtask 2"], // array of strings
      status: 0,
      board_id: currentBoardId,
    });

  let [columnsInfo, setColumnsInfo] = useState<columnType[]>([]); // to build column status select

  let initializeData = async (e: boolean) => {
    // function runs when dialog state changes from close (false) to open (true)

    if (!e) {
      // close state

      setColumnsInfo([]);

      setAddTasksState({
        title: "New Task",
        description: "",
        subTasks: ["Subtask 1", "Subtask 2"], // array of strings
        status: 0,
        board_id: currentBoardId,
      });

      return;
    }
    currentBoardId = JSON.parse(localStorage.getItem("selected-board") ?? "0");

    columnsArray = JSON.parse(localStorage.getItem("columns") ?? "[]");

    setColumnsInfo(columnsArray);
    setAddTasksState((prev) => {
      return { ...prev, status: columnsArray[0].id ?? 0 };
    });
  };

  let getColumnNameByColumnId = (id: number) =>
    columnsInfo.find((e) => e.id == id)?.name;

  let AddTaskFormSubmitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    let empty = false;
    
    if (title.length <= 0) empty = true;
 
    subTasks.forEach(e => {
      if (e.length <= 0) empty = true;
    });

    if (empty)
    {
      toast.error("Can't create a task , there are errors");
      return;
    }

    let url = BaseURL + CreateTask;

    let newTaskObject: taskType = {
      name: title,
      description: description,
      status: getColumnNameByColumnId(status) ?? "",
      column_id: status,
      board_id: currentBoardId,
      number_of_completed_subtasks: 0,
      number_of_subtasks: subTasks.length,
    };

    try {

      let res = await axios.post(url, newTaskObject); //creates a new task

      dispatch(addTask(res.data));

      let url2 = BaseURL + IncreaseNumberOfColumnTasks + status + "/";
      await axios.post(url2);
      
      let currentColumnInfo = columnsInfo.find(e => e.id == status);
      
      if (currentColumnInfo)
      {
        currentColumnInfo.number_of_tasks++;
        dispatch(editColumn(currentColumnInfo));
      }

      let url3 = BaseURL + CreateSubtask;

      let task_id = res.data.id;

      for (let i = 0; i < subTasks.length; i++) {
        let newSubtaskObject = {
          name: subTasks[i],
          is_done: false,
          task_id: task_id,
        };

        await axios.post(url3, newSubtaskObject); // creates a subtask for the new created task
      
      }
      toast.success('Task added successfully');
    } catch (e) {
      console.log("add task error ", e);
    }
  };

  let SubtasksInputFieldsContainer = subTasks.map((e, index) => {
    return (
      <div className="flex justify-between my-3 relative" key={`subtask-input-field-`+index}>
        <input
          type="text"
          name={`subtask-input-field${index}`}
          id={`subtask-input-field${index}`}
          maxLength={200}
          value={e}
          className={`py-2 px-3 w-full dark:focus:border-[#635FC7] outline-0 rounded-[5px] dark:placeholder:opacity-50 border border-[#828Fa3] placeholder:text-[#bfbfc3]
            ${ e.length <= 0 ? "border-[#ea5555] dark:border-[#ea5555] dark:focus:border-[#ea5555]" : ""}`}
          placeholder={
            index % 2 == 0 ? "e.g. Make Coffee" : "e.g. Drink coffee & smile"
          }
          onChange={(e) => {
            let temp = subTasks;
            temp[index] = e.target.value;
            setAddTasksState((previous) => {
              return { ...previous, subTasks: temp };
            });
          }}
        />
                  {
          e.length <= 0 &&
          <span className="text-[#ea5555] absolute top-2 not-sm:text-xs not-sm:top-3 right-10">Can't be empty</span>
        }
        <div
          className="py-2 cursor-pointer pl-2"
          onClick={() => {
            let temp: string[] = [];
            subTasks.forEach((item, i) => {
              if (i !== index) temp.push(item);
            });

            setAddTasksState((prev) => {
              return { ...prev, subTasks: temp };
            });
          }}>
          <XIcon size={26} strokeWidth={3} color="#828Fa3" />
        </div>
      </div>
    );
  });

  let SelectStatus = columnsInfo.map((e: columnType) => {
    return (
      <SelectItem
        key={`select-status${e.id}`}
        value={e.id.toString()}
        className="font-bold mb-2 text-[#828Fa3]">
        {e.name}
      </SelectItem>
    );
  });

  return (
    <Dialog onOpenChange={(e) => initializeData(e)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="rounded-[5px] dark:bg-[#2b2c37]">
        <DialogHeader>
          <DialogTitle className="font-bold">Add New Task</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <form
          onSubmit={(e) => AddTaskFormSubmitHandler(e)}
          className="not-sm:text-sm">
          <div id="new-task-title-input-container" className="relative">
            <label
              htmlFor="new-task-title-input-field"
              className="block text-[#828Fa3] dark:text-white font-semibold mb-1  text-sm">
              Title
            </label>
            <input
              type="text"
              name="new-task-title-input-field"
              value ={title}
              id="new-task-title-input-field"
              className={`py-2 px-3 w-full dark:focus:border-[#635FC7] outline-0 border rounded-[5px] border-[#828Fa3] placeholder:text-[#bfbfc3] dark:placeholder:opacity-50 
                ${title.length <= 0 ? "border-[#ea5555] dark:border-[#ea5555] dark:focus:border-[#ea5555]" : ""}`}
              placeholder="e.g. Take coffee break"
              maxLength={200}
              onChange={(e) =>
                setAddTasksState((prev) => {
                  return { ...prev, title: e.target.value };
                })
              }
            />
                      {
          title.length <= 0 &&
          <span className="text-[#ea5555] absolute top-8 not-sm:text-xs not-sm:top-9 right-1">Can't be empty</span>
               }
          </div>

          <div id="new-task-description-input-container" className="mt-5">
            <label
              htmlFor="new-task-description-input-field"
              className="block text-[#828Fa3] dark:text-white font-semibold mb-1 text-sm">
              Description
            </label>
            <textarea
              name="new-task-description-input-field"
              id="new-task-description-input-field"
              maxLength={1200}
              placeholder="Task Description"
              className=" resize-none border dark:focus:border-[#635FC7] outline-0 rounded-[5px] w-full h-[110px]  p-2 border-[#828Fa3] placeholder:text-[#bfbfc3] dark:placeholder:opacity-50
              "
              onChange={(e) =>
                setAddTasksState((prev) => {
                  return { ...prev, description: e.target.value };
                })
              }></textarea>
          </div>
          <div id="new-task-subtasks-container" className="mt-5">
            <p className="text-[#828Fa3] font-semibold dark:text-white  text-sm">
              Subtasks
            </p>

            <div
              id="new-task-subtasks-body"
              className="max-h-[140px] overflow-auto">
              {SubtasksInputFieldsContainer}
            </div>
            <div
              className="w-full rounded-full text-center bg-[#f0effa] text-[#635FC7] hover:bg-[#d8d7f1] py-3 font-bold cursor-pointer"
              onClick={() => {
                let temp = subTasks;
                temp.push("Subtask "+(temp.length + 1).toString());
                setAddTasksState((prev) => {
                  return { ...prev, subTasks: temp };
                });
              }}>
              + Add New Subtask
            </div>
          </div>
          <div id="new-task-status-container" className="mt-5">
            <p className="text-[#828Fa3] font-semibold  text-sm dark:text-white mb-2">
              Status :
            </p>
            <Select
              onValueChange={(e) =>
                setAddTasksState((prev) => {
                  return { ...prev, status: parseInt(e) };
                })
              }>
              <SelectTrigger className="w-full py-5 dark:bg-[#2b2c37] rounded-sm  dark:hover:bg-[#2b2c37] data-[state=open]:border data-[state=open]:border-[#635FC7] font-bold">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#2b2c37]">
                {SelectStatus}
              </SelectContent>
            </Select>
          </div>
          <input
            type="submit"
            value="Create Task"
            className="w-full bg-[#635FC7] rounded-full py-2 mt-7 text-white hover:bg-[#a8a4ff] font-bold cursor-pointer"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
