// hooks
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

// components
import ColumnsContainer from "../components/ColumnsSection/Index";
import Header from "../components/Header";
import SideBar from "../components/SideBar/Index";

// functions
import { getTheme } from '../features/sidebar/sidebarSlice';
import { GetBoardItems } from "@/features/board/boardSlice";

//types

import type { AppDispatch } from "../types/types";
import { Toaster } from "@/components/ui/sonner";
 
export default function MainLayout() {

  const dispatch = useDispatch<AppDispatch>();

  const theme = useSelector(getTheme);
 
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  useEffect(() => {
    dispatch(GetBoardItems());
  }, []);

  
  return (<>
       <Header />
          <div
            id="main-layout-root"
            className="flex bg-white w-full justify-between h-[700px] not-lg:h-[900px] ">
            <SideBar />
      <ColumnsContainer />
      <Toaster position="bottom-right" 
        toastOptions={{
          unstyled: true,
          classNames: {
            success: "text-green-500  bg-[#f4f7fd] dark:bg-[#2b2c37] rounded-sm min-w-[300px] flex justify-start align-middle py-4 pointer-events-none border border-green-500 px-1",  
             error: "text-[#ea5555] bg-[#f4f7fd] dark:bg-[#2b2c37] rounded-sm min-w-[300px] flex justify-start align-middle py-4 pointer-events-none border border-[#ea5555] px-1",
            title:'ml-2 '
          
          }
           
        }}/>
    </div>
  </>)
 
}
