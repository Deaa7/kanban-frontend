// hooks
import { useDispatch, useSelector } from "react-redux";

// components
import BoardItemsList from "./BoardItemsList";
import SideBarBottomSection from "./SideBarBottomSection";
import AddBoardButton from "./AddBoardButton";

//functions
import { changeSidebarState, getSidebarState } from "@/features/board/boardSlice";

//icons
import { Eye } from "lucide-react";

export default function SideBar() {

  let showSidebar = useSelector(getSidebarState); // get the current state of sidebar (shown-true / hidden-false)

  let dispatch = useDispatch();
  
  return (
    <>
      {showSidebar &&
        <div className="text-lg bg-white dark:bg-[#2b2c37] border-r border-r-[#e4ebfa] dark:border-r-[#3e3f4e] relative min-w-[253px] w-[253px]
          lg:text-lg
          md:text-lg md:w-[15%] md:min-w-[220px]
          sm:text-lg sm:w-[12%] sm:min-w-[210px]
          not-sm:hidden  
            ">
          <BoardItemsList />
           <AddBoardButton/>
        <SideBarBottomSection />
        </div>}
   
      {/* the button to show the sidebar */}
      
      {!showSidebar &&
        <button className="flex justify-center w-[65px] h-fit bg-[#635FC7] hover:bg-[#a8a4ff] py-4 absolute left-0 bottom-5 rounded-r-full cursor-pointer
         lg:bottom-5 
         md:bottom-4 
         sm:bottom-2 
         not-sm:hidden 
         "
        onClick={ ()=> dispatch(changeSidebarState())   }>
          <Eye size={25} color="white" strokeWidth={3} absoluteStrokeWidth />
      </button>
      }
    </>
  );
}
