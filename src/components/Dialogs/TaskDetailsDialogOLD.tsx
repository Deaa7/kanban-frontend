import { EllipsisVertical } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import DeleteTaskDialog from "./DeleteTaskDialog";
import { useState } from "react";

export default function TaskDetailsDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * we store the id of selected task in session storage ,
   * then we get the info of stored task , with all subtasks using the id and store them in the cache
   */
  let title = "some title";
  let description =
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi odit dolor pariatur cupiditate corrupti nulla laudantium, quasi iste eveniet, eos omnis blanditiis recusandae dicta iusto quibusdam aperiam qui officiis eaque?";
  title = description;
  let number_of_subtasks = 5;
  let number_of_completed_subtasks = 3;
  let subtasksData = [
    {
      name: "subtask 1",
      is_done: true,
    },
    {
      name: "subtask 2",
      is_done: false,
    },
    {
      name: "subtask 4 subtask 4 subtask 4 subtask 4 subtask 4 subtask 4subtask 4 subtask 4 ",
      is_done: false,
    },
  ];

  let subtasksContent = subtasksData.map((e, index) => {
    return (
      <div
        key={index}
        className="w-full bg-[#f4f7fd]  hover:bg-[#d8d7f1] group rounded-[5px] flex mb-2 py-3 px-3 cursor-pointer">
        <Checkbox
          className="w-5 h-5 group-hover:bg-white  my-auto cursor-pointer data-[state=checked]:bg-[#635FC7] data-[state=checked]:border-0
        data-[state=checked]:font-black "
          id={`subtask-checkbox${index}`}
          name={`subtask-checkbox${index}`}
          defaultChecked={e.is_done}
        />

        <label
          htmlFor={`subtask-checkbox${index}`}
          className={`font-bold pl-4 w-full cursor-pointer ${
            e.is_done ? "text-[#828Fa3] line-through" : ""
          }`}>
          {e.name}
        </label>
      </div>
    );
  });

  let [open, setOpen] = useState(false);
  let close = () => {
    if (open)
      setOpen(false);
    else setOpen(true);
  }
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent setOpen ={setOpen} showCloseButton={false} className="rounded-[5px]">
        <DialogHeader className=" flex flex-row  justify-between">
          <DialogTitle className="font-bold w-fit  leading-6">
            {title}
          </DialogTitle>
          <div className="w-fit my-auto">
            <Popover>
              <PopoverTrigger asChild className="">
                <button className="cursor-pointer">
                  <EllipsisVertical size={30} color={"#828Fa3"} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-45 ">
                <div>
                  <DialogClose className="text-[#828Fa3] cursor-pointer">
                    Edit Task
                  </DialogClose>
                  <DeleteTaskDialog >
                    <button   className="text-[#ea5555] mt-4 cursor-pointer">
                      Delete Task
                    </button>
                  </DeleteTaskDialog>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>
        <div id="task-details-subtasks-container">
          <p className="text-sm text-[#828Fa3] font-bold mt-3">
            Subtasks ({number_of_completed_subtasks} of {number_of_subtasks})
          </p>

          <div
            id="task-details-subtasks-list"
            className="max-h-[250px] overflow-auto mt-3">
            {subtasksContent}
          </div>
        </div>
        <div id="task-details-state-container">
          <p className="text-sm text-[#828Fa3] font-bold mt-3">
            Current Status
          </p>
          <Select>
            <SelectTrigger className="w-full py-5 rounded-[4px] mt-2 data-[state=open]:border data-[state=open]:border-[#635FC7] font-bold">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="light"
                className="font-bold mb-2 text-[#828Fa3]">
                Light
              </SelectItem>
              <SelectItem
                value="dark"
                className="font-bold mb-2 text-[#828Fa3]">
                Dark
              </SelectItem>
              <SelectItem
                value="system"
                className="font-bold mb-2 text-[#828Fa3]">
                System
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
}
