//hooks
import { useDispatch } from "react-redux";

//components
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

//api
import axios from "axios";
import { BaseURL, DecreaseNumberOfColumnTasks, DeleteTaskByTaskId } from "@/API/Apis";

//functions
import { deleteTask } from "@/features/tasks/tasksSlice";
import { toast } from "sonner";
import type { columnType } from "@/types/types";
import { editColumn } from "@/features/columns/columnSlice";

export default function DeleteTaskDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  let task_name = localStorage.getItem("selected-task-name");
  let taskId = localStorage.getItem("selected-task-id");

  let dispatch = useDispatch();

  let deleteTaskHandler = async () => {
    let url = BaseURL + DeleteTaskByTaskId + taskId + "/";

    await axios.delete(url);

    let columnId = localStorage.getItem("selected-column") ?? "0";
    let url2 = BaseURL + DecreaseNumberOfColumnTasks + localStorage.getItem("selected-column") + "/";
    await axios.post(url2);

    let columns: columnType[] = JSON.parse(localStorage.getItem('columns') ?? "[]");
    
    let currentColumn = columns.find(e => e.id == parseInt(columnId));
    
    if( currentColumn?.number_of_tasks != undefined )
    currentColumn.number_of_tasks--;

    dispatch(editColumn(currentColumn));
    dispatch(deleteTask(parseInt(taskId ?? "0")));

    toast.success('task deleted successfully');
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="rounded-[5px] dark:bg-[#2b2c37]">
        <DialogHeader>
          <DialogTitle className="font-bold text-[#ea5555]">
            Delete this task ?
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete the '{task_name}' task? and its
          subtasks? this action cannot be reversed
        </DialogDescription>

        <DialogFooter className="flex flex-row flex-wrap justify-between w-fit mx-auto my-5 not-sm:my-2">
          <DialogClose
            onClick={deleteTaskHandler}
            className="py-3 px-20 cursor-pointer font-bold rounded-full bg-[#ea5555] text-white hover:bg-[#ff9898]">
            Delete
          </DialogClose>
          <DialogClose className="py-3 px-20 cursor-pointer font-bold rounded-full text-[#635FC7] bg-[#f0effa] hover:bg-[#d8d7f1]">
            Cancel
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
