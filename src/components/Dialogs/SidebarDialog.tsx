import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import BoardItemsList from "../SideBar/BoardItemsList";
import DarkLightThemeSwitch from "../SideBar/DarkLightThemeSwitch";
import { useState } from "react";
import AddBoardButton from "../SideBar/AddBoardButton";

export default function SidebarDialog({
  children,
}: // setOpen
{
  children: React.ReactNode;
  // setOpen : React.Dispatch<React.SetStateAction<boolean>>,
}) {
  /**
   * I should get the task name and task id from session storage
   * then delete the task using task's id and decrease number of tasks in its column
   */

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
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="rounded-[5px] top-3/11  dark:bg-[#2b2c37] p-0 h-fit">
        <BoardItemsList />
        <DarkLightThemeSwitch />
      </DialogContent>
    </Dialog>
  );
}
