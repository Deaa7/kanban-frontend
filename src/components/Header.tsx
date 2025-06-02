
//hooks 
import { useSelector } from "react-redux";

//icons

import { ChevronDown, EllipsisVertical } from "lucide-react";

// components :

import Logo from "./Logo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import AddTaskDialog from "./Dialogs/AddTaskDialog";
import DeleteBoardDialog from "./Dialogs/DeleteBoardDialog";
import EditBoardDialog from "./Dialogs/EditBoardDialog";
import SidebarDialog from "./Dialogs/SidebarDialog";

//functions
import { getSidebarState } from "@/features/board/boardSlice";

export default function Header() {
  
  let currentStateOfSidebar = useSelector(getSidebarState);
  
  return (
    <>
      <header
        className="w-full flex justify-between bg-white dark:bg-[#2b2c37]
      h-[75px]
      not-sm:h-[60px]">
        <div
          className={`font-black text-3xl w-[20%] min-w-[253px] h-full flex flex-col justify-center 
          lg:text-3xl
          md:text-2xl md:w-[15%] md:min-w-[220px]
          sm:text-2xl sm:w-[12%] sm:min-w-[210px]
          not-sm:text-xs not-sm:w-[10%] not-sm:min-w-0  not-sm:pl-1
      ${
        !currentStateOfSidebar
          ? "border-b border-b-[#e4ebfa] dark:border-b-[#3e3f4e]"
          : "not-sm:border-b not-sm:border-b-[#e4ebfa] not-sm:dark:border-b-[#3e3f4e]"
      }`}>
          <div className="flex justify-center">
            <Logo />
            <h1 className="not-sm:hidden px-2"> Kanban</h1>
          </div>
        </div>

        <div className="w-full h-full flex flex-wrap justify-between border-b border-b-[#e4ebfa] dark:border-b-[#3e3f4e]">
          <h1
            className="text-2xl font-black indent-4 h-full flex flex-col justify-center  border-l border-l-[#e4ebfa] dark:border-l-[#3e3f4e] 
          lg:text-2xl
          md:text-lg
          sm:text-lg
          not-sm:text-lg not-sm:border-l-0
          ">

            <span className="not-sm:hidden">
            Platform Launch 
              </span>

            <span className="hidden not-sm:block ">
              <SidebarDialog>
                <div className="flex justify-between cursor-pointer">
               Platform Launch 
              <ChevronDown color={"#635FC7"} className="my-auto size-4"/>
                </div>
            </SidebarDialog>
            </span>
          </h1>

          <div className="w-[180px] h-full flex flex-wrap justify-between   
          not-sm:w-[80px]">
            <AddTaskDialog>
              <button className="text-white bg-[#635FC7] opacity-50 hover:opacity-100 text-sm font-bold rounded-full px-4 py-3 h-fit cursor-pointer my-auto
              
              not-sm:py-2 not-sm:px-5 ">
                
                <span className="not-sm:hidden" >+ Add New Task</span>
                <div className=" hidden not-sm:block "> 
                 <i className="fa-solid fa-plus"></i>
                </div>
              </button>
            </AddTaskDialog>

            <Popover>
              <PopoverTrigger asChild>
                <button className="cursor-pointer">
                  <EllipsisVertical size={30} color={"#828Fa3"} className="not-sm:size-6" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-40 mr-5 dark:bg-[#2b2c37]">
                <div>
                  <EditBoardDialog>
                    <button className="text-[#828Fa3] cursor-pointer">
                      Edit Board
                    </button>
                  </EditBoardDialog>
                  <DeleteBoardDialog>
                    <button className="text-[#ea5555] mt-4 cursor-pointer">
                      Delete Board
                    </button>
                  </DeleteBoardDialog>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>
    </>
  );
}
