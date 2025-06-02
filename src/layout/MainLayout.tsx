
// hooks
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

// components
import ColumnsContainer from "../components/ColumnsSection/Index";
import Header from "../components/Header";
import SideBar from "../components/SideBar/Index";

// functions
import { GetBoardItems, getSelectedBoardId, getTheme } from "@/features/board/boardSlice";

//types
import type { AppDispatch } from "@/app/store";

export default function MainLayout() {

  let dispatch = useDispatch<AppDispatch>();
  
  let getBoardId = useSelector(getSelectedBoardId);
  let theme = useSelector(getTheme);
  
  useEffect(() => {
    dispatch(GetBoardItems());
  }, [])

  useEffect(() => {

    if (theme === "dark")
      document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  
  }, [theme]);

  return (
    <>
      <Header />
      <div
        id="main-layout-root"
        className="flex bg-white w-full justify-between h-[700px] not-lg:h-[900px] ">
        <SideBar />
        {
          getBoardId > 0 ?
            <ColumnsContainer /> :
            <h1>loading</h1>
        }
      </div>
    </>
  );
}


