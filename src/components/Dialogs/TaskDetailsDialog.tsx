import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { EllipsisVertical } from "lucide-react";
import DeleteTaskDialog from "./DeleteTaskDialog";
import { Checkbox } from "../ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import EditTaskDialog from "./EditTaskDialog";

export default function TaskDetailsDialog({ children }: { children: React.ReactNode }) {
  /*
   we get all the info about this task using task_id from sessionStorage ,
   also we get all its subtasks info
  */

  let [openMybox, setOpenMyBox] = useState(false);
  let is_hidden = openMybox ? "" : " hidden";

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
        className="w-full bg-[#f4f7fd] dark:bg-[#20212c]  dark:hover:bg-[#39395b] hover:bg-[#d8d7f1] group rounded-[5px] flex mb-2 py-3 px-3 cursor-pointer">
        <Checkbox
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

  return (
    <>
      <div onClick={() => setOpenMyBox(true)}>{children}</div>
      <div
        className={`bg-black/50 z-10 w-full h-full fixed top-0 left-0 ${is_hidden}`}
        onClick={() => setOpenMyBox(false)}></div>
      
      <div
        className={`w-120 h-150 bg-white dark:bg-[#2b2c37] rounded-[8px] p-8 left-4/12 absolute top-[10%] z-20 ${is_hidden}
         lg:left-4/12
         md:left-1/4
         sm:left-1/8
         not-sm:left-1/22 not-sm:w-65 not-sm:h-170 not-sm:text-sm not-sm:p-4 
      `}>
       
          <div id="custom-dialog-header" className="flex justify-between  w-full ">

            <h1 className="font-semibold w-fit">
              {title}
            </h1>
            <Popover>
              <PopoverTrigger asChild >
                <button className="cursor-pointer">
                  <EllipsisVertical size={30} color={"#828Fa3"} />
                </button>
              </PopoverTrigger>
              <PopoverContent className={` dark:bg-[#22242e] absolute top-[-40px] not-sm:top-[-80px] right-0 w-45 ${openMybox ? "" : " hidden"}`}>
                
              <EditTaskDialog>
                <button onClick={() => setOpenMyBox(false)}
                  className=" text-[#828Fa3] cursor-pointer"
                >Edit Task</button>
              </EditTaskDialog>
                <DeleteTaskDialog>
                  <button
                    onClick={() => setOpenMyBox(false)}
                    className="text-[#ea5555] mt-4 cursor-pointer">
                    Delete Task
                  </button>
                </DeleteTaskDialog>
              </PopoverContent>
            </Popover>
          </div>

          <div id="custom-dialog-description" className="text-sm  not-sm:text-xs text-[#828Fa3] mt-5">
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
          <Select>
            <SelectTrigger className="w-full py-5 rounded-[4px] dark:bg-[#2b2c37] text-white mt-2 data-[state=open]:border dark:data-[state=open]:border-2  data-[state=open]:border-[#635FC7] font-bold dark:font-normal">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className=" dark:bg-[#22242e]  ">
              <SelectItem
                value="light"
                className="font-bold dark:font-normal mb-2 text-[#828Fa3]">
                Light
              </SelectItem>
              <SelectItem
                value="dark"
                className="font-bold dark:font-normal mb-2 text-[#828Fa3]">
                Dark
              </SelectItem>
              <SelectItem
                value="system"
                className="font-bold dark:font-normal mb-2 text-[#828Fa3]">
                System
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        </div>
    </>
  );
}
