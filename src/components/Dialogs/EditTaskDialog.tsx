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
import { toast } from "sonner";

//icons
import { XIcon } from "lucide-react";

//type
import type { columnType, subtaskType, taskType } from "@/types/types";

//api
import axios from "axios";
import {
  BaseURL,
  CreateSubtask,
  DecreaseNumberOfColumnTasks,
  decreaseNumberOfTaskCompletedSubtasks,
  decreaseNumberOfTaskSubtasks,
  DeleteSubTaskById,
  GetAllSubtasksByTaskId,
  IncreaseNumberOfColumnTasks,
  UpdateSubtaskById,
  UpdateTaskByTaskId,
} from "@/API/Apis";

//functions
import { editTask } from "@/features/tasks/tasksSlice";
import { fixingNumberOfColumnTasks } from "@/features/columns/columnSlice";

type EditTaskStateType = {
  name: string;
  description: string;
  status: string;
};

export default function EditTaskDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [[columnsData, subtasksData, deletedSubtasks], setEditTaskDialogState] =
    useState<[columnType[], subtaskType[], subtaskType[]]>([[], [], []]);

  let [{ name, description, status }, setEditTaskState] =
    useState<EditTaskStateType>({
      name: "",
      description: "",
      status: "",
    });

  let taskId = localStorage.getItem("selected-task-id");
  let boardId = localStorage.getItem("selected-board");
  let columnId = localStorage.getItem("selected-column");

  let dispatch = useDispatch();

  let editTaskDialogOpenChangeHandler = async (e: boolean) => {
    if (e) {
      // current state is open
      setEditTaskState({
        name: localStorage.getItem("selected-task-name") ?? "",
        description: localStorage.getItem("selected-task-description") ?? "",
        status: localStorage.getItem("selected-column") ?? "",
      });

      let columns: columnType[] = JSON.parse(
        localStorage.getItem("columns") ?? "[]"
      );

      let url = BaseURL + GetAllSubtasksByTaskId + taskId + "/";

      let res = await axios.get(url);

      setEditTaskDialogState([columns, res.data, []]);
    }
  };

  let getColumnNameById = (id: number): string =>
    columnsData.find((col) => col.id === id)?.name ?? "";

  let editTaskDialogSaveChangesHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    //  increase / decrease number of column's tasks in backend & frontend

    e.preventDefault();

    let current_column = localStorage.getItem("selected-column") ?? "0";
    let old_column = localStorage.getItem("old-selected-column") ?? "0";

    let url = BaseURL + IncreaseNumberOfColumnTasks + current_column + "/";
    await axios.post(url);

    let url2 = BaseURL + DecreaseNumberOfColumnTasks + old_column + "/";
    await axios.post(url2);

    let oldId: number = parseInt(
      localStorage.getItem("old-selected-column") ?? "0"
    );

    if (oldId > 0 && oldId != parseInt(current_column) ) {
      let obj = {
        oldId: oldId,
        newId: parseInt(current_column),
      };

      dispatch(fixingNumberOfColumnTasks(obj));
    }
    /////////////////////////////

    ///  task changes (frontend & backend)

    let newTaskObject: taskType = {
      column_id: parseInt(current_column),
      id: parseInt(taskId ?? "0"),
      description: description,
      name: name,
      number_of_completed_subtasks: 0,
      number_of_subtasks: 0,
      board_id: parseInt(boardId ?? "0"),
      status: getColumnNameById(parseInt(current_column)),
    };

    for (let i = 0; i < subtasksData.length; i++) {
     
      newTaskObject.number_of_subtasks++;
      if (subtasksData[i].is_done) newTaskObject.number_of_completed_subtasks++;
    
    }

    let url3 = BaseURL + UpdateTaskByTaskId + taskId + "/";

    await axios.put(url3, newTaskObject);

    dispatch(editTask(newTaskObject));

    /////////////////////////////////////

    //deleted subtasks section handler (only backend) :

    for (let i = 0; i < deletedSubtasks.length; i++) {
      let subtask = deletedSubtasks[i];
      if (subtask.id > 0) {
        // delete subtask & decrease number of subtasks in the selected task
        let url = BaseURL + DeleteSubTaskById + subtask.id.toString() + "/";

        await axios.delete(url);

        let url2 = BaseURL + decreaseNumberOfTaskSubtasks + taskId + "/";

        if (subtask.is_done)
          url2 = BaseURL + decreaseNumberOfTaskCompletedSubtasks + taskId + "/";

        await axios.post(url2);
      }
    }

    /////////////////////////////////////////////

    // update / add subtasks (only backend)

    for (let i = 0; i < subtasksData.length; i++) {
      let subtask = subtasksData[i];
      if (subtask.id > 0) {
        // existed subtask , needs to update
        let url = BaseURL + UpdateSubtaskById + subtask.id.toString() + "/";
        await axios.put(url, subtask);
      } else {

        // newly added subtask
        let url = BaseURL + CreateSubtask;
        await axios.post(url, subtask);

      }
    }

    toast.success('Changes saved successfully');
  };

  let editTaskDialogSelectChangeHandler = async (e: string) => {
    localStorage.setItem("old-selected-column", columnId?.toString() ?? "");
    localStorage.setItem("selected-column", e);

    setEditTaskState((prev) => {
      return { ...prev, status: e };
    });
  };

  let SubtasksInputFieldsContainer = subtasksData.map((e, index) => {
    return (
      <div className="flex justify-between my-3" key={'edit-task-subtask-input-field-'+index}>
        <input
          type="text"
          name={`subtask-input-field${index}`}
          id={`subtask-input-field${index}`}
          value={e.name}
          className="py-2 px-3 dark:placeholder:opacity-50 w-full rounded-[5px]  border border-[#828Fa3] placeholder:text-[#bfbfc3]"
          placeholder={
            index % 2 == 0 ? "e.g. Make Coffee" : "e.g. Drink coffee & smile"
          }
          onChange={(e) => {
            let temp = subtasksData;
            temp[index].name = e.target.value;
            setEditTaskDialogState([columnsData, temp, deletedSubtasks]);
          }}
        />

        <div
          className="py-2 cursor-pointer pl-2"
          onClick={() => {
            let temp: subtaskType[] = [];
            let temp2: subtaskType[] = deletedSubtasks;
            subtasksData.forEach((item, i) => {
              if (i !== index) temp.push(item);
              else temp2.push(item);
            });
            setEditTaskDialogState([columnsData, temp, temp2]);
          }}>
          <XIcon size={26} strokeWidth={3} color="#828Fa3" />
        </div>
      </div>
    );
  });

  let editTaskDialogSelectColumnOptions = columnsData.map((col , index) => {
    return (
      <SelectItem
        key={'edit-task-column-select-'+index}
        value={col.id.toString()}
        className="font-bold mb-2 text-[#828Fa3]">
        {col.name}
      </SelectItem>
    );
  });
  return (
    <Dialog onOpenChange={(e) => editTaskDialogOpenChangeHandler(e)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="rounded-[5px] dark:bg-[#2b2c37]">
        <DialogHeader>
          <DialogTitle className="font-bold">Edit Task</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <form onSubmit={(e) => editTaskDialogSaveChangesHandler(e)}>
          <div id="edit-task-name-input-container">
            <label
              htmlFor="edit-task-name-input-field"
              className="block text-[#828Fa3] dark:text-white font-bold mb-1  text-sm">
              Title
            </label>
            <input
              type="text"
              name="edit-task-name-input-field"
              id="edit-task-name-input-field"
              className="py-2 px-3 w-full dark:placeholder:opacity-50 border rounded-[5px] border-[#828Fa3] placeholder:text-[#bfbfc3]"
              placeholder="e.g. Take coffee break"
              value={name}
              onChange={(e) =>
                setEditTaskState((prev) => {
                  return { ...prev, name: e.target.value };
                })
              }
            />
          </div>

          <div id="edit-task-description-input-container" className="mt-5">
            <label
              htmlFor="edit-task-description-input-field"
              className="block text-[#828Fa3] dark:text-white font-bold mb-1 text-sm">
              Description
            </label>
            <textarea
              name="edit-task-description-input-field"
              id="edit-task-description-input-field"
              placeholder="e.g. it's always good to take a break. This 15 minutes break will recharge the batteries a little"
              className=" resize-none border dark:placeholder:opacity-50 rounded-[5px] w-full h-[110px] p-2 border-[#828Fa3] placeholder:text-[#bfbfc3]"
              value={description}
              onChange={(e) =>
                setEditTaskState((prev) => {
                  return { ...prev, description: e.target.value };
                })
              }></textarea>
          </div>
          <div id="edit-task-subtasks-container" className="mt-5">
            <p className="text-[#828Fa3] font-bold dark:text-white text-sm">
              Subtasks
            </p>

            <div
              id="edit-task-subtasks-body"
              className="max-h-[140px] overflow-auto">
              {SubtasksInputFieldsContainer}
            </div>
            <div
              className="w-full rounded-full text-center bg-[#f0effa] text-[#635FC7] hover:bg-[#d8d7f1] py-3 font-bold cursor-pointer"
              onClick={() => {
                let temp = subtasksData;
                temp.push({
                  is_done: false,
                  name: "",
                  task_id: parseInt(taskId ?? "0"),
                  id: -1,
                });
                setEditTaskDialogState([columnsData, temp, deletedSubtasks]);
              }}>
              + Add New Subtask
            </div>
          </div>
          <div id="edit-task-status-container" className="mt-5">
            <p className="text-[#828Fa3] font-bold dark:text-white	 text-sm mb-2">
              Status
            </p>

            <Select
              defaultValue={status}
              onValueChange={(e) => editTaskDialogSelectChangeHandler(e)}>
              <SelectTrigger className="w-full py-5 dark:bg-[#2b2c37] rounded-sm  dark:hover:bg-[#2b2c37] data-[state=open]:border data-[state=open]:border-[#635FC7] font-bold">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#2b2c37]">
                {editTaskDialogSelectColumnOptions}
              </SelectContent>
            </Select>
          </div>

          <input
            type="submit"
            value="Save Changes"
            className="w-full bg-[#635FC7] rounded-full py-2 mt-7 text-white hover:bg-[#a8a4ff] font-bold cursor-pointer"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
