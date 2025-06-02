
import { changeSidebarState } from "@/features/board/boardSlice";
import { useDispatch } from "react-redux";

 
import DarkLightThemeSwitch from "./DarkLightThemeSwitch";
export default function SideBarBottomSection() {
  let dispatch = useDispatch();

  return (
    <>
      <div className="w-full absolute bottom-0 bg-white dark:bg-[#2b2c37] flex center flex-wrap flex-col">
        
         <DarkLightThemeSwitch/>
        <div
          className=" mb-10 py-3 text-xl text-[#828Fa3] cursor-pointer w-[95%] flex justify-between flex-wrap
            duration-150 rounded-r-full
            hover:bg-[#f0effa] hover:text-[#635FC7]
            not-lg:text-sm"
              onClick={ ()=> dispatch( changeSidebarState() )  }>
          <div className="w-[18%] text-center">
            <i className="fa-solid fa-eye-slash  px-2"> </i>
          </div>

          <p className="w-[82%] font-bold "> Hide Sidebar</p>
        </div>
      </div>
    </>
  );
}
