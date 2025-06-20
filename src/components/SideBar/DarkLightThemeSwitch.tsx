//hooks
import { useDispatch, useSelector } from "react-redux";

//icons
import { MoonStar, Sun } from "lucide-react";

//component
import { Switch } from "../ui/Switch";

//functions
import { getTheme, toggleTheme } from "@/features/sidebar/sidebarSlice";

export default function DarkLightThemeSwitch() {
  let theme = useSelector(getTheme);
  let dispatch = useDispatch();

  return (
    <div className="my-2 p-2 mx-auto text-[#828Fa3] bg-[#f4f7fd] w-[95%] dark:bg-[#20212c] rounded-sm flex justify-around ">
      <Sun strokeWidth={2} size={22} className="" />
      <Switch
        id="website-theme"
        defaultChecked={theme === "dark"}
        onClick={() => dispatch(toggleTheme())}
      />
      <MoonStar strokeWidth={2} size={22} />
    </div>
  );
}
