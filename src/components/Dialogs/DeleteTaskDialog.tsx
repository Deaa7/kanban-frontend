import { useState } from "react";
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

export default function DeleteTaskDialog({
  children,
}: {
    children: React.ReactNode,
  // setOpen : React.Dispatch<React.SetStateAction<boolean>>,
}) {
  /**
   * I should get the task name and task id from session storage
   * then delete the task using task's id and decrease number of tasks in its column
   */
  let task_name = "task's Name";

  return (
    <Dialog  >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent showCloseButton={false} className="rounded-[5px] dark:bg-[#2b2c37]">
        <DialogHeader>
          <DialogTitle className="font-bold text-[#ea5555]">
            Delete this task ?
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
                  Are you sure you want to delete the '{task_name}' task? and its subtasks?
           this action cannot be reversed        
        </DialogDescription>

        <DialogFooter className="flex flex-row flex-wrap justify-between w-fit mx-auto my-5 not-sm:my-2">
          <DialogClose   className="py-3 px-20 cursor-pointer font-bold rounded-full bg-[#ea5555] text-white hover:bg-[#ff9898]" >Delete</DialogClose>
          <DialogClose className="py-3 px-20 cursor-pointer font-bold rounded-full text-[#635FC7] bg-[#f0effa] hover:bg-[#d8d7f1]">Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
