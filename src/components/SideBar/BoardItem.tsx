//hooks
import { useDispatch } from "react-redux";

//functions
import { selectBoard } from "../../features/board/boardSlice";

//icons
import { Table2 } from "lucide-react";
export default function BoardItem({
  id,
  name,
  selected,
}: {
  name: string;
  id: number;
  selected: boolean;
}) {
  let dispatch = useDispatch();

  return (
    <div
      className={` py-4  flex justify-between rounded-r-full cursor-pointer text-sm w-[95%]
        active:bg-[#635FC7] active:text-white duration-200
          lg:py-4
          md:py-3
          sm:py-3
          not-sm:py-2 
        
   ${
     selected
       ? "bg-[#635FC7] text-white"
       : "text-[#828Fa3]  hover:bg-[#e4ebfa] hover:text-[#635FC7]"
   }   `}
      onClick={() => {
        dispatch(
          selectBoard({
            id: id,
            name: name,
          })
        );
      }}>
      <div className="w-[18%] flex justify-center">
        <Table2 size={22} strokeWidth={1} />
      </div>
      <p className="w-[82%] font-bold "> {name}</p>
    </div>
  );
}
