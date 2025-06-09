//components
import AddBoardDialog from "../Dialogs/AddBoardDialog";

//icons
import { Table2 } from "lucide-react";

export default function AddBoardButton() {
  return (
    <AddBoardDialog>
      <div className=" w-[95%] text-[#635FC7] text-sm flex justify-between my-5 cursor-pointer">
        <Table2
          size={22}
          strokeWidth={1}
          className="block w-[18%] text-center"
        />
        <button className="block w-[82%] text-start font-bold cursor-pointer ">
          + Create New Board
        </button>
      </div>
    </AddBoardDialog>
  );
}
