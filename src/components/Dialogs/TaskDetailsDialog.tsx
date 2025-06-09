//hooks
import { useState } from "react";
import { useDispatch } from "react-redux";

//components
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import DeleteTaskDialog from "./DeleteTaskDialog";
import EditTaskDialog from "./EditTaskDialog";

//icons
import { EllipsisVertical } from "lucide-react";

//types
import {
  type subtaskType,
  type columnType,
  type taskType,
} from "@/types/types";
import type { ReactNode } from "react";

//api
import axios from "axios";
import {
  BaseURL,
  DecreaseNumberOfColumnTasks,
  decreaseNumberOfTaskCompletedSubtasks,
  GetAllSubtasksByTaskId,
  IncreaseNumberOfColumnTasks,
  increaseNumberOfTaskCompletedSubtasks,
  UpdateSubtaskById,
  UpdateTaskByTaskId,
} from "@/API/Apis";

//functions
import { fixingNumberOfColumnTasks } from "../../features/columns/columnSlice";
import { DecreaseNumberOfSubtasksInTask, editTask, IncreaseNumberOfSubtasksInTask } from "@/features/tasks/tasksSlice";

export default function TaskDetailsDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [[openDialog, columnsData, subtasksData], setTaskDetailsDialogState] =
    useState<[boolean, columnType[], subtaskType[]]>([false, [], []]);

  let is_hidden = openDialog ? "" : " hidden";

  let columnId = localStorage.getItem("selected-column");
  let taskId = localStorage.getItem("selected-task-id");

  let dispatch = useDispatch();

  let title = localStorage.getItem("selected-task-name");

  let description = localStorage.getItem("selected-task-description");

  let number_of_subtasks = parseInt(
    localStorage.getItem("selected-task-number-subtasks") ?? "0"
  );

  let number_of_completed_subtasks = parseInt(
    localStorage.getItem("selected-task-number-completed-subtasks") ?? "0"
  );

  // on open details dialog handler
  let openTaskDetailsDialogHandler = async (e: boolean) => {
    if (!e) {
      let columns: columnType[] = JSON.parse(
        localStorage.getItem("columns") ?? "[]"
      );

      let taskId = localStorage.getItem("selected-task-id");

      let url = BaseURL + GetAllSubtasksByTaskId + taskId + "/";

      try {
        let res = await axios.get(url);

        setTaskDetailsDialogState([true, columns, res.data]);
      } catch (e) {
        console.log("error in openTaskDetailsDialogHandler initialization ", e);
      }
    } else {
      
      setTaskDetailsDialogState([openDialog, columnsData, subtasksData]);
      
      localStorage.removeItem("selected-task-id");
      localStorage.removeItem("selected-task-name");
      localStorage.removeItem("selected-task-description");
      localStorage.removeItem("selected-task-number-subtasks");
      localStorage.removeItem("selected-task-number-completed-subtasks");
      localStorage.removeItem("selected-column");
    }
  };

  let getColumnNameById = (id: number): string =>
    columnsData.find((col) => col.id === id)?.name ?? "";

  let changeTaskColumnHandler = async (val: string) => {
    localStorage.setItem("old-selected-column", (columnId ?? 0).toString());
    let oldColumnId = parseInt(columnId ?? "0");

    let url = BaseURL + IncreaseNumberOfColumnTasks + val + "/";
    await axios.post(url);

    let url2 = BaseURL + DecreaseNumberOfColumnTasks + (columnId ?? "0") + "/";
    await axios.post(url2);

    // update cached column data in old column id :
    localStorage.setItem("selected-column", val);

    let newTaskObject: Partial<taskType> = {
      column_id: parseInt(val),
      id: parseInt(taskId ?? "0"),
      status: getColumnNameById(parseInt(val)),
    };

    let url3 = BaseURL + UpdateTaskByTaskId + taskId + "/";

    await axios.put(url3, newTaskObject);

    dispatch(editTask(newTaskObject));

    if (oldColumnId > 0) {
      let obj = {
        oldId: oldColumnId,
        newId: parseInt(localStorage.getItem("selected-column") ?? "0"),
      };

      dispatch(fixingNumberOfColumnTasks(obj));
    }
  };

  let subtaskCheckboxChangeHandler = async (
    subtaskObject: subtaskType,
    currentState: string,
    nextLabel: Element | null
  ) => {
    subtaskObject.is_done = !subtaskObject.is_done;

    if (currentState == "unchecked") {
      
      if (nextLabel) {
        nextLabel.classList.add("text-[#828Fa3]");
        nextLabel.classList.add("line-through");
      }

      let url =
        BaseURL +
        increaseNumberOfTaskCompletedSubtasks +
        subtaskObject.task_id +
        "/";
      await axios.post(url);

      dispatch(IncreaseNumberOfSubtasksInTask(subtaskObject.task_id));

    }
    else if (currentState == "checked") {

      if (nextLabel) {
        nextLabel.classList.remove("text-[#828Fa3]");
        nextLabel.classList.remove("line-through");
      }

      let url =
        BaseURL +
        decreaseNumberOfTaskCompletedSubtasks +
        subtaskObject.task_id +
        "/";
      await axios.post(url);

      dispatch(DecreaseNumberOfSubtasksInTask(subtaskObject.task_id));

    }

    let url = BaseURL + UpdateSubtaskById + subtaskObject.id + "/";

    await axios.put(url, subtaskObject);

    let temp = subtasksData.map((e) => {
      if (e.id == subtaskObject.id) return subtaskObject;
      else return e;
    });

    setTaskDetailsDialogState([openDialog, columnsData, temp]);
  };

  let subtasksContent: ReactNode;

  subtasksContent = subtasksData.map((e: subtaskType, index) => {
    let temp = e;
    return (
      <div
        key={index}
        className="w-full bg-[#f4f7fd] dark:bg-[#20212c]  dark:hover:bg-[#39395b] hover:bg-[#d8d7f1] group rounded-[5px] flex mb-2 py-3 px-3 cursor-pointer">
        <Checkbox
          onClick={(e) => {
            subtaskCheckboxChangeHandler(
              temp,
              e.currentTarget.getAttribute("data-state") ?? " don't work ",
              e.currentTarget.nextElementSibling
            );
          }}
          className="w-5 h-5 group-hover:bg-white  my-auto cursor-pointer data-[state=checked]:bg-[#635FC7] data-[state=checked]:border-0
          data-[state=checked]:font-black "
          id={`subtask-checkbox${index}`}
          name={`subtask-checkbox${index}`}
          defaultChecked={e.is_done}
        />

        <label
          htmlFor={`subtask-checkbox${index}`}
          className={`font-semibold not-sm:text-xs pl-4 w-full cursor-pointer ${
            e.is_done ? "text-[#828Fa3] line-through" : ""
          }`}>
          {e.name}
        </label>
      </div>
    );
  });

  let StatusSelect = columnsData.map((column, index) => {
    return (
      <SelectItem
        key={`columns-select-${index}`}
        value={column.id.toString()}
        className="font-bold dark:font-normal mb-2 text-[#828Fa3]">
        {column.name}
      </SelectItem>
    );
  });

  return (
    <>
      <div onClick={() => openTaskDetailsDialogHandler(openDialog)}>
        {children}
      </div>
      <div
        className={`bg-black/50 z-10 w-full h-full fixed top-0 left-0 ${is_hidden}`}
        onClick={() =>
          setTaskDetailsDialogState([false, columnsData, subtasksData])
        }></div>

      <div
        className={`w-120 max-h-150  bg-white dark:bg-[#2b2c37] rounded-[8px] p-8 left-4/12 absolute top-[10%] z-20 ${is_hidden}
         lg:left-4/12
         md:left-1/4
         sm:left-1/8
         not-sm:left-1/22 not-sm:w-65 not-sm:h-170 not-sm:text-sm not-sm:p-4 
      `}>
        <div
          id="custom-dialog-header"
          className="flex justify-between  w-full ">
          <h1 className="font-semibold w-fit">{title}</h1>
          <Popover>
            <PopoverTrigger asChild>
              <button className="cursor-pointer">
                <EllipsisVertical size={30} color={"#828Fa3"} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className={` dark:bg-[#22242e] absolute top-[-40px] not-sm:top-[-80px] right-0 w-45 ${
                openDialog ? "" : " hidden"
              }`}>
              <EditTaskDialog>
                <button
                  onClick={() =>
                    setTaskDetailsDialogState([
                      false,
                      columnsData,
                      subtasksData,
                    ])
                  }
                  className=" text-[#828Fa3] cursor-pointer">
                  Edit Task
                </button>
              </EditTaskDialog>
              <DeleteTaskDialog>
                <button
                  onClick={() =>
                    setTaskDetailsDialogState([
                      false,
                      columnsData,
                      subtasksData,
                    ])
                  }
                  className="text-[#ea5555] mt-4 cursor-pointer">
                  Delete Task
                </button>
              </DeleteTaskDialog>
            </PopoverContent>
          </Popover>
        </div>

        <div
          id="custom-dialog-description"
          className="text-sm  not-sm:text-xs text-[#828Fa3] mt-5">
          <p>{description}</p>
        </div>
        <p className="text-sm not-sm:text-xs  text-[#828Fa3] font-bold mt-3">
          Subtasks ({number_of_completed_subtasks} of {number_of_subtasks})
        </p>

        <div
          id="task-details-subtasks-list"
          className="max-h-[250px] overflow-auto mt-3">
          {subtasksContent}
        </div>
        <div id="task-details-state-container">
          <p className="text-sm text-[#828Fa3] font-bold mt-3">
            Current Status
          </p>
          <Select
            defaultValue={columnId?.toString() ?? undefined}
            onValueChange={(val) => {
              changeTaskColumnHandler(val);
            }}>
            <SelectTrigger className="w-full py-5 rounded-[4px] dark:bg-[#2b2c37] text-white mt-2 data-[state=open]:border dark:data-[state=open]:border-2  data-[state=open]:border-[#635FC7] font-bold dark:font-normal">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className=" dark:bg-[#22242e]  ">
              {StatusSelect}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
