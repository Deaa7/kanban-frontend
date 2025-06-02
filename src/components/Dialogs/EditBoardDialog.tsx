//hooks
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";

//components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";

//icons
import { XIcon } from "lucide-react";

//apis
import {
  BaseURL,
  CreateColumn,
  DeleteColumn,
  EditBoard,
  EditColumn,
} from "@/API/Apis";
import axios from "axios";

//functions
import { editBoard, getSelectedBoardInfo } from "@/features/board/boardSlice";

type ApiResponse<T> = {
  // cached data type
  data: T;
};

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
  let selectedBoardInfo = useSelector(getSelectedBoardInfo); // gets info of selected board

  // form input state
  let [{ name, currentColumns, deletedColumns }, setEditBoardState] =
    useState<EditBoardType>({
      name: selectedBoardInfo?.name ?? "",
      currentColumns: [], // added columns or edited columns
      deletedColumns: [], // deleted columns
    });

  let dispatch = useDispatch();

  let queryClient = useQueryClient();

  // query key to get the info of columns from cache
  let queryKey = [`board-id-${selectedBoardInfo?.id}`, `columns`];

  // get the columns
  useEffect(() => {
    // we use cache to get columns
    let cachedColumns =
    queryClient.getQueryData<ApiResponse<ColumnType[]>>(queryKey);
    

    if (cachedColumns?.data)
      setEditBoardState((prev) => {
        return { ...prev, currentColumns: cachedColumns?.data ?? [] };
      });
  }, []);

  let url = BaseURL + CreateColumn;
  let CreateColumnQuery = useMutation({
    mutationFn: (column: ColumnType) => axios.post(url, column),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`board-id-${selectedBoardInfo?.id}`, `columns`],
      });
    },
  });

  let UpdateColumnQuery = useMutation({
    mutationFn: (column: ColumnType) => {
      let url = BaseURL + EditColumn + column.id + "/";
      return axios.put(url, column);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`board-id-${selectedBoardInfo?.id}`, `columns`],
      });
    },
  });

  let DeleteColumnQuery = useMutation({
    mutationFn: (column: ColumnType) => {
      let url = BaseURL + DeleteColumn + column.id + "/";
      return axios.delete(url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`board-id-${selectedBoardInfo?.id}`, `columns`],
      });
    },
  });

  // form submit handler
  let EditBoardSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1) create/update/delete columns
    // 2) update the cache
    // 3) edit board and update store state.

    let columnsOperationsHandler = async () => {
      currentColumns.forEach(async (column) => {
        let columnSentObject: ColumnType = {
          name: column.name,
          board_id: selectedBoardInfo?.id ?? 1,
          id: column.id,
        };
        let UpdateOrCreateColumnsHandler = async () => {
          //create new column
          if (column.id < 0) {
            CreateColumnQuery.mutate(columnSentObject);
          }
          //update existed column
          else {
            UpdateColumnQuery.mutate(columnSentObject);
          }
        };
        await UpdateOrCreateColumnsHandler();
        
      });

      deletedColumns.forEach(async (column) => {
        let columnSentObject: ColumnType = {
          name: column.name,
          board_id: selectedBoardInfo?.id ?? 1,
          id: column.id,
        };

        if (column.id > 0) {
          DeleteColumnQuery.mutate(columnSentObject);
        }
      });
    };

    await columnsOperationsHandler();

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
  };

  let EditBoardAddColumn = async () => {
    let obj: ColumnType = {
      name: "",
      id: -1, // new added column has id = -1
      board_id: selectedBoardInfo?.id ?? 1,
    };

    let temp = currentColumns;
    temp.push(obj);
    setEditBoardState((prev) => {
      return { ...prev, currentColumns: temp };
    });
  };

  let DeleteColumnHandler = (e: ColumnType) => {
    let temp: ColumnType[] = currentColumns.filter(
      (column) => column.id !== e.id
    );

    let temp2: ColumnType[] = deletedColumns;
    temp2.push(e);

    setEditBoardState((prev) => {
      return { ...prev, currentColumns: temp, deletedColumns: temp2 };
    });
  };

  let ColumnsInputFieldsContainer = currentColumns?.map((e, index) => {
    return (
      <div className="flex justify-between my-3" key={index}>
        <input
          type="text"
          name={`edit-board-column-input-field${index}`}
          id={`edit-board-column-input-field${index}`}
          value={e.name}
          className="py-2 px-3 dark:placeholder:opacity-50 outline-0 dark:focus:border-[#635FC7] w-full rounded-[5px]  border border-[#828Fa3] placeholder:text-[#bfbfc3]"
          placeholder={index % 2 == 0 ? "Todo" : "Done"}
          onChange={(e) => {
            let temp = currentColumns;
            temp[index].name = e.target.value;
            setEditBoardState((previous) => {
              return { ...previous, currentColumns: temp };
            });
          }}
        />
        <div
          className="py-2 cursor-pointer pl-2"
          onClick={() => {
            DeleteColumnHandler(e);
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
          <DialogTitle className="font-bold">Edit Board</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <form action="" onSubmit={(e) => EditBoardSubmitForm(e)}>
          <div id="edit-board-name-input-container">
            <label
              htmlFor="edit-board-name-input-field"
              className="block text-[#828Fa3] dark:text-white font-bold mb-2  text-sm">
              Board Name
            </label>
            <input
              type="text"
              name="edit-board-name-input-field"
              id="edit-board-name-input-field"
              className="py-2 px-3 w-full dark:placeholder:opacity-50 outline-0 dark:focus:border-[#635FC7] border rounded-[5px] border-[#828Fa3]  placeholder:text-[#bfbfc3]"
              placeholder="e.g. Web Design"
              value={name}
              onChange={(e) =>
                setEditBoardState((prev) => {
                  return { ...prev, name: e.target.value };
                })
              }
            />
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
          <DialogClose className="w-full bg-[#635FC7] rounded-full py-2 mt-7 text-white hover:bg-[#a8a4ff] font-bold cursor-pointer">
            <input type="submit" value="Save Change" />
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
