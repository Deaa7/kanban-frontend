//hooks
import { useState } from "react";
import { useDispatch } from "react-redux";

//components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

//icons
import { XIcon } from "lucide-react";

//apis
import axios from "axios";
import { BaseURL, CreateBoard, CreateColumn } from "@/API/Apis";

//functions
import { addBoard } from "@/features/board/boardSlice";
import { toast } from "sonner";

type AddBoardType = {
  name: string;
  columns: string[];
};

type SendColumnType = {
  name: string;
  board_id: number;
};

export default function AddBoardDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  let [{ name, columns }, setAddBoardFormState] = useState<AddBoardType>({
    name: "New Board",
    columns: ["Column 1", "Column 2"],
  });

  let dispatch = useDispatch();

  let AddBoardSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    // check if all inputs are not empty 
    let empty = false;

    if (name.length <= 0) empty = true;

    columns.forEach(e => {
      if (e.length <= 0) empty = true;
    });
    
    if (empty)
    {
      toast.error("Can't create a board , you have errors");
      return;
    }

    e.preventDefault();

    let url = BaseURL + CreateBoard; // url for creating board

    let resultBoardId = 1; // default value

    let CreateBoarderHandler = async () => {
      let boardSentObject = {
        name: name,
      };

      let boardResult = await axios.post(url, boardSentObject);

      resultBoardId = boardResult.data.id;

      dispatch(
        addBoard({
          name: name,
          id: resultBoardId,
        })
      );
    };

    await CreateBoarderHandler();

    let createColumnHandler = async (columnSentObject: SendColumnType) => {
      let url = BaseURL + CreateColumn;

      // create a column and update the cache
      await axios.post(url, columnSentObject);
    };

    for (let i = 0; i < columns.length; i++) {
      let columnSentObject: SendColumnType = {
        name: columns[i],
        board_id: resultBoardId,
      };
      await createColumnHandler(columnSentObject);
    }
  
    toast.success('Board created successfully');
  };

  let ColumnsInputFieldsContainer = columns?.map((e, index) => {
    return (
      <div className="flex justify-between my-3 relative" key={'columns-field-input-'+index}>
        <input
          type="text"
          value={e}
          name={`column-input-field${index}`}
          id={`column-input-field${index}`}
          maxLength={200}
          className={`py-2 px-3 w-full rounded-[5px] dark:placeholder:opacity-50 outline-0 dark:focus:border-[#635FC7] border border-[#828Fa3] placeholder:text-[#bfbfc3]
            ${ e.length <= 0 ? "border-[#ea5555] dark:border-[#ea5555] dark:focus:border-[#ea5555]" : ""}`}
          placeholder={index % 2 == 0 ? "Todo" : "Done"}
          onChange={(e) => {
            let temp = columns;
            temp[index] = e.target.value;
            setAddBoardFormState((previous) => {
              return { ...previous, columns: temp };
            });
          }}
        />
          {
          e.length <= 0 &&
          <span className="text-[#ea5555] absolute top-2 not-sm:text-xs not-sm:top-3 right-10">Can't be empty</span>
        }
        <div
          className="py-2 cursor-pointer pl-2"
          onClick={() => {
            
            if (columns.length <= 1)
            {
              toast.error('you need to have at least one column in your board');
              return;
               }
            let temp: string[] = [];
               
            columns.forEach((item, i) => {
              if (i !== index) temp.push(item);
            });

            setAddBoardFormState((prev) => {
              return { ...prev, columns: temp };
            });
          }}>
          <XIcon size={26} strokeWidth={3} color="#828Fa3" />
        </div>
      </div>
    );
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="rounded-[5px] dark:bg-[#2b2c37]">
        <DialogHeader>
          <DialogTitle className="font-bold">Add New Board</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <form onSubmit={(e) => AddBoardSubmitForm(e)}>
          <div id="new-board-name-input-container" className="relative">
            <label
              htmlFor="new-board-name-input-field"
              className="block text-[#828Fa3] font-bold mb-1 dark:text-white  text-sm">
              Board Name
            </label>
            <input
              type="text"
              name="new-board-name-input-field"
              value ={name}
              id="new-board-name-input-field"
              className={`py-2 px-3 w-full outline-0 dark:focus:border-[#635FC7] dark:placeholder:opacity-50  border rounded-[5px] border-[#828Fa3] placeholder:text-[#bfbfc3]
                   ${name.length <= 0 ? "border-[#ea5555] dark:border-[#ea5555] dark:focus:border-[#ea5555]" : ""}`}
              placeholder="e.g. Web Design"
              maxLength={200}
              autoFocus
              onChange={(e) =>
                setAddBoardFormState((prev) => {
                  return { ...prev, name: e.target.value };
                })
              }
            />
          {
          name.length <= 0 &&
          <span className="text-[#ea5555] absolute top-8 not-sm:text-xs not-sm:top-9 right-1">Can't be empty</span>
        }
          </div>

          <div id="new-board-columns-container" className="mt-5">
            <p className="text-[#828Fa3] font-bold dark:text-white text-sm">
              Columns
            </p>
            <div
              id="new-board-columns-body"
              className="max-h-[140px] overflow-auto">
              {ColumnsInputFieldsContainer}
            </div>

            <div
              id="new-board-add-column-button"
              className="w-full rounded-full text-center bg-[#f0effa] text-[#635FC7] hover:bg-[#d8d7f1] py-3 font-bold cursor-pointer"
              onClick={() => {
                let temp = columns;
                temp?.push("Column " + (temp.length +1).toString() );
                setAddBoardFormState((prev) => {
                  return { ...prev, columns: temp };
                });
              }}>
              + Add New Column
            </div>
          </div>
          <input
            type="submit"
            value="Create New Board"
            className="w-full bg-[#635FC7] rounded-full py-2 mt-7 text-white hover:bg-[#a8a4ff] font-bold cursor-pointer"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
