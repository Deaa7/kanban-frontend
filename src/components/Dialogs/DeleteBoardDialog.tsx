//hooks
import { useDispatch, useSelector } from "react-redux";

//components
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

//functions
import { deleteBoard, getSelectedBoardInfo } from "@/features/board/boardSlice";
import { toast } from "sonner";

//apis
import axios from "axios";
import { BaseURL, DeleteBoard } from "@/API/Apis";

export default function DeleteBoardDialog({
  children,
}: {
  children: React.ReactNode;
  }) {
  
  let selectedBoardInfo = useSelector(getSelectedBoardInfo);

  let dispatch = useDispatch();

  let board_name = selectedBoardInfo?.name;

  let DeleteBoardHandler = async () => {
   
    let url = BaseURL + DeleteBoard + selectedBoardInfo?.id + "/";

    await axios.delete(url); // delete board from the backend

    dispatch(deleteBoard({ id: selectedBoardInfo?.id })); //delete the board from store state
  
    toast.success('Board deleted successfully');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="rounded-[5px] not-sm:text-sm dark:bg-[#2b2c37]">
        <DialogHeader>
          <DialogTitle className="font-semibold text-start text-[#ea5555]">
            Delete this board ?
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete the '{board_name}' board? this action
          will remove all columns and tasks and cannot be reversed
        </DialogDescription>

        <DialogFooter className="flex justify-between flex-row flex-wrap w-fit mx-auto my-5">
          <DialogClose
            onClick={DeleteBoardHandler}
            className="py-3 px-20 not-sm:px-22 cursor-pointer font-bold rounded-full bg-[#ea5555] text-white hover:bg-[#ff9898]">
            Delete
          </DialogClose>
          <DialogClose className="py-3 px-20 not-sm:px-22 cursor-pointer font-bold rounded-full text-[#635FC7] bg-[#f0effa] hover:bg-[#d8d7f1]">
            Cancel
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
