//hooks
import { useState } from "react";

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
import { useDispatch} from "react-redux";
import { addBoard  } from "@/features/board/boardSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type AddBoardType = {
  name: string;
  columns?: string[];
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
    name: "",
    columns: ["Todo", "Doing"],
  });


  let dispatch = useDispatch();

  let queryClient = useQueryClient();

  let url = BaseURL + CreateColumn;

  // create a column and update the cache
  let CreateColumnQuery = useMutation({
    mutationFn: (column: SendColumnType) => axios.post(url, column),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [`board-id-${res?.data?.id}`, `columns`],
      });
    },
  });

  let AddBoardSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    
    //1 create a board
    //2 update the store state
    //3 create columns with new board id

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

    columns?.forEach(async (column) => {
      let columnSentObject: SendColumnType = {
        name: column,
        board_id: resultBoardId,
      };
      let createColumnHandler = async () => {
        CreateColumnQuery.mutate(columnSentObject);
      };
      await createColumnHandler();
      // await axios.post(url2, columnSentObject);
    });

    console.error("there was an error when creating the board", e);
  };

  let ColumnsInputFieldsContainer = columns?.map((e, index) => {
    return (
      <div className="flex justify-between my-3" key={index}>
        <input
          type="text"
          name={`column-input-field${index}`}
          id={`column-input-field${index}`}
          value={e}
          className="py-2 px-3 w-full rounded-[5px] dark:placeholder:opacity-50 outline-0 dark:focus:border-[#635FC7] border border-[#828Fa3] placeholder:text-[#bfbfc3]"
          placeholder={index % 2 == 0 ? "Todo" : "Done"}
          onChange={(e) => {
            let temp = columns;
            temp[index] = e.target.value;

            setAddBoardFormState((previous) => {
              return { ...previous, columns: temp };
            });
          }}
        />
        <div
          className="py-2 cursor-pointer pl-2"
          onClick={() => {
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
          <div id="new-board-name-input-container">
            <label
              htmlFor="new-board-name-input-field"
              className="block text-[#828Fa3] font-bold mb-1 dark:text-white  text-sm">
              Board Name
            </label>
            <input
              type="text"
              name="new-board-name-input-field"
              id="new-board-name-input-field"
              className="py-2 px-3 w-full outline-0 dark:focus:border-[#635FC7] dark:placeholder:opacity-50  border rounded-[5px] border-[#828Fa3] placeholder:text-[#bfbfc3]"
              placeholder="e.g. Web Design"
              value={name}
              onChange={(e) =>
                setAddBoardFormState((prev) => {
                  return { ...prev, name: e.target.value };
                })
              }
            />
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
                temp?.push("");
                setAddBoardFormState((prev) => {
                  return { ...prev, subTasks: temp };
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
