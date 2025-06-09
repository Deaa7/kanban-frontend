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
import {
  BaseURL,
  CreateColumn,
  DeleteColumn,
  EditBoard,
  EditColumn,
} from "@/API/Apis";

//functions
import { editBoard } from "@/features/board/boardSlice";
import { GetAllColumnsByBoardId } from "@/features/columns/columnSlice";
import { toast } from "sonner";

//type
import { type AppDispatch, type columnType } from "@/types/types";

type ColumnType = {
  name: string;
  id: number;
  board_id: number;
};

type EditBoardType = {
  name: string;
  currentColumns: ColumnType[];
  deletedColumns: ColumnType[];
};

export default function EditBoardDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  let selectedBoardInfo = {
    name: localStorage.getItem("selected-board-name") ?? "",
    id: parseInt(localStorage.getItem("selected-board") ?? "0"),
  }; // gets info of selected board

  let columnsData: columnType[] = JSON.parse(
    localStorage.getItem("columns") ?? "[]"
  );

  let [{ name, currentColumns, deletedColumns }, setEditBoardState] =
    useState<EditBoardType>({
      name: selectedBoardInfo?.name ?? "",
      currentColumns: columnsData, // added columns or edited columns
      deletedColumns: [], // deleted columns
    });

  let dispatch = useDispatch<AppDispatch>();

  // form submit handler
  let EditBoardSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //check all input fields .
    let empty = false;

    if (name.length <= 0) empty = true;

    currentColumns.forEach((e) => {
      if (e.name.length <= 0) empty = true;
    });

    if (empty) {
      toast.error("Can't save changes , there are errors");
      return;
    }

    for (let i = 0; i < currentColumns.length; i++) {
      if (currentColumns[i].id < 0) {
        let url = BaseURL + CreateColumn;
        await axios.post(url, currentColumns[i]);
      } else if (currentColumns[i].id > 0) {
        let url = BaseURL + EditColumn + currentColumns[i].id + "/";
        await axios.put(url, currentColumns[i]);
      }
    }

    for (let i = 0; i < deletedColumns.length; i++) {
      if (deletedColumns[i].id > 0) {
        let url = BaseURL + DeleteColumn + deletedColumns[i].id + "/";
        await axios.delete(url);
      }
    }

    dispatch(GetAllColumnsByBoardId());

    let url = BaseURL + EditBoard + selectedBoardInfo?.id + "/"; // url for editing board by its id
    let boardSentObject = {
      name: name,
    };

    let boardResult = await axios.put(url, boardSentObject);

    dispatch(
      editBoard({
        name: name,
        id: boardResult.data.id,
      })
    );
    toast.success("board edited successfully");
  };

  let EditBoardAddColumn = async () => {
    let obj: ColumnType = {
      name: "Column " + (currentColumns.length + 1).toString(),
      id: -1, // new added column has id = -1
      board_id: selectedBoardInfo?.id ?? 1,
    };

    let temp = currentColumns;
    temp.push(obj);

    setEditBoardState((prev) => {
      return {
        ...prev,
        currentColumns: temp,
      };
    });
  };

  let DeleteColumnHandler = (e: ColumnType, index: number) => {
    if (currentColumns.length <= 1) {
      toast.error("you need to have at least one column in your board");
      return;
    }

    let temp: ColumnType[] = currentColumns.filter((_, ind) => ind !== index);
    let temp2: ColumnType[] = deletedColumns;

    if (e.id > 0) {
      temp2.push(e);
    }

    setEditBoardState((prev) => {
      return {
        ...prev,
        currentColumns: temp,
        deletedColumns: temp2,
      };
    });
  };

  let openChangeEditBoardHandler = (e: boolean) => {
    if (!e) {
      // close state
      setEditBoardState({
        name: selectedBoardInfo?.name ?? "",
        currentColumns: columnsData,
        deletedColumns: [],
      });
    }
  };
 
  let ColumnsInputFieldsContainer = currentColumns?.map((e, index) => {
    return (
      <div className="flex justify-between my-3 relative" key={"edit-board-column-input-field-"+index}>
        <input
          type="text"
          value={e.name}
          name={`edit-board-column-input-field${index}`}
          id={`edit-board-column-input-field${index}`}
          className={`py-2 px-3 dark:placeholder:opacity-50 outline-0 dark:focus:border-[#635FC7] w-full rounded-[5px]  border border-[#828Fa3] placeholder:text-[#bfbfc3]
            ${
              currentColumns[index].name.length <= 0
                ? "border-[#ea5555] dark:border-[#ea5555] dark:focus:border-[#ea5555]"
                : ""
            }`}
          placeholder={index % 2 == 0 ? "Todo" : "Done"}
          onChange={(e) => {
            let temp: ColumnType[] = currentColumns;
            temp[index].name = e.target.value;
            setEditBoardState((previous) => {
              return {
                ...previous,
                currentColumns: temp,
              };
            });
          }}
        />
        {currentColumns[index].name.length <= 0 && (
          <span className="text-[#ea5555] absolute top-2 not-sm:text-xs not-sm:top-3 right-10">
            Can't be empty
          </span>
        )}
        <div
          className="py-2 cursor-pointer pl-2"
          onClick={() => {
            DeleteColumnHandler(e, index);
          }}>
          <XIcon size={26} strokeWidth={3} color="#828Fa3" />
        </div>
      </div>
    );
  });

  return (
    <Dialog onOpenChange={(e) => openChangeEditBoardHandler(e)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="rounded-[5px] dark:bg-[#2b2c37]">
        <DialogHeader>
          <DialogTitle className="font-bold">Edit Board</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <form action="" onSubmit={(e) => EditBoardSubmitForm(e)}>
          <div id="edit-board-name-input-container" className="relative">
            <label
              htmlFor="edit-board-name-input-field"
              className="block text-[#828Fa3] dark:text-white font-bold mb-2  text-sm">
              Board Name
            </label>
            <input
              type="text"
              name="edit-board-name-input-field"
              id="edit-board-name-input-field"
              className={`py-2 px-3 w-full dark:placeholder:opacity-50 outline-0 dark:focus:border-[#635FC7] border rounded-[5px] border-[#828Fa3]  placeholder:text-[#bfbfc3]
                 ${
                   name.length <= 0
                     ? "border-[#ea5555] dark:border-[#ea5555] dark:focus:border-[#ea5555]"
                     : ""
                 }`}
              placeholder="e.g. Web Design"
              // value={name}
              defaultValue={name}
              onChange={(e) =>
                setEditBoardState((prev) => {
                  return { ...prev, name: e.target.value };
                })
              }
            />
            {name.length <= 0 && (
              <span className="text-[#ea5555] absolute top-9 not-sm:text-xs not-sm:top-10 right-1">
                Can't be empty
              </span>
            )}
          </div>

          <div id="edit-board-columns-container" className="mt-5">
            <p className="text-[#828Fa3] font-bold dark:text-white  text-sm">
              Board Columns
            </p>

            <div
              id="edit-board-columns-body"
              className="max-h-[250px] overflow-auto">
              {ColumnsInputFieldsContainer}
            </div>

            <div
              id="edit-board-add-column-button"
              className="w-full rounded-full text-center bg-[#f0effa] text-[#635FC7] hover:bg-[#d8d7f1] py-3 font-bold cursor-pointer"
              onClick={EditBoardAddColumn}>
              + Add New Column
            </div>
          </div>
          <input
            type="submit"
            value="Save Change"
            className="w-full bg-[#635FC7] rounded-full py-2 mt-7 text-white hover:bg-[#a8a4ff] font-bold cursor-pointer"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
