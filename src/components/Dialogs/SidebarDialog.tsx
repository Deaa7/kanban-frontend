//hooks
import { useState } from "react";

//components
import BoardItemsList from "../SideBar/BoardItemsList";
import DarkLightThemeSwitch from "../SideBar/DarkLightThemeSwitch";
import AddBoardButton from "../SideBar/AddBoardButton";


export default function SidebarDialog({
  children,
}: 
{
  children: React.ReactNode;
}) {
  

  let [sidebarOpenBox, setSidebarOpenBox] = useState(false);

  let is_hidden = sidebarOpenBox ? "" : "hidden";
  return (
    <>
      <div onClick={() => setSidebarOpenBox(true)}>{children} </div>

      <div
        className={`bg-black/50  absolute top-0 left-0 w-full h-full ${is_hidden}`}
        onClick={() => setSidebarOpenBox(false)}></div>

      <div
        className={`w-60 h-fit rounded-[10px] absolute z-10 bg-white dark:bg-[#2b2c37] ${is_hidden}`}>
        <BoardItemsList />

        <div onClick={() => setSidebarOpenBox(false)}>
          <AddBoardButton />
        </div>

        <DarkLightThemeSwitch />
      </div>
    </>
  );
 
}
