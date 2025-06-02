import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { XIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type AddTaskStateType = {
  title: string;
  description: string;
  subTasks: string[];
  status: string;
};

export default function EditTaskDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  // first we get the task id from the session storage ,
  // then we get the info of selected task to get its data (tile , description , subTasks and status)

  let [{ title, description, subTasks, status }, setEditTaskState] =
    useState<AddTaskStateType>({
      title: "loaded title",
      description: "loaded description",
      subTasks: ["here is task1 ", "here is task2 ", "here is task3 "], // array of strings
      status: "Done",
    });

  let SubtasksInputFieldsContainer = subTasks.map((e, index) => {
    return (
      <div className="flex justify-between my-3" key={index}>
        <input
          type="text"
          name={`subtask-input-field${index}`}
          id={`subtask-input-field${index}`}
          value={e}
          className="py-2 px-3 dark:placeholder:opacity-50 w-full rounded-[5px]  border border-[#828Fa3] placeholder:text-[#bfbfc3]"
          placeholder={
            index % 2 == 0 ? "e.g. Make Coffee" : "e.g. Drink coffee & smile"
          }
          onChange={(e) => {
            let temp = subTasks;
            temp[index] = e.target.value;

            setEditTaskState((previous) => {
              return { ...previous, subTasks: temp };
            });
          }}
        />

        <div
          className="py-2 cursor-pointer pl-2"
          onClick={() => {
            let temp: string[] = [];
            subTasks.forEach((item, i) => {
              if (i !== index) temp.push(item);
            });

            setEditTaskState((prev) => {
              return { ...prev, subTasks: temp };
            });
          }}>
          <XIcon size={26} strokeWidth={3} color="#828Fa3" />
        </div>
      </div>
    );
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent showCloseButton={false} className="rounded-[5px] dark:bg-[#2b2c37]">
        <DialogHeader>
          <DialogTitle className="font-bold">Edit Task</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <form action="">
          <div id="edit-task-title-input-container">
            <label
              htmlFor="edit-task-title-input-field"
              className="block text-[#828Fa3] dark:text-white font-bold mb-1  text-sm">
              Title
            </label>
            <input
              type="text"
              name="edit-task-title-input-field"
              id="edit-task-title-input-field"
              className="py-2 px-3 w-full dark:placeholder:opacity-50 border rounded-[5px] border-[#828Fa3] placeholder:text-[#bfbfc3]"
              placeholder="e.g. Take coffee break"
              value={title}
              onChange={(e) =>
                setEditTaskState((prev) => {
                  return { ...prev, title: e.target.value };
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
            <p className="text-[#828Fa3] font-bold dark:text-white text-sm">Subtasks </p>

            <div
              id="edit-task-subtasks-body"
              className="max-h-[140px] overflow-auto">
              {SubtasksInputFieldsContainer}
            </div>
            <div
              className="w-full rounded-full text-center bg-[#f0effa] text-[#635FC7] hover:bg-[#d8d7f1] py-3 font-bold cursor-pointer"
              onClick={() => {
                let temp = subTasks;
                temp.push("");
                setEditTaskState((prev) => {
                  return { ...prev, subTasks: temp };
                });
              }}>
              + Add New Subtask
            </div>
          </div>
          <div id="edit-task-status-container" className="mt-5">
            <p className="text-[#828Fa3] font-bold dark:text-white	 text-sm mb-2">Status  </p>
       
                        <Select
                          onValueChange={(e) => {
                            setEditTaskState((prev) => {
                              return { ...prev, status: e };
                            });
                          }}>
                          <SelectTrigger className="w-full py-5 dark:bg-[#2b2c37] rounded-sm  dark:hover:bg-[#2b2c37] data-[state=open]:border data-[state=open]:border-[#635FC7] font-bold">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-[#2b2c37]">
                            <SelectItem
                              value="Todo"
                              className="font-bold mb-2 text-[#828Fa3]">
                              Todo
                            </SelectItem>
                            <SelectItem
                              value="Done"
                              className="font-bold mb-2 text-[#828Fa3]">
                              Done
                            </SelectItem>
                    
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
