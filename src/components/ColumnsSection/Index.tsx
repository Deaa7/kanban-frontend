//hooks
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

//components
import Column from "./Column";
import EditBoardDialog from "../Dialogs/EditBoardDialog";

//functions
import { GetAllColumnsByBoardId, getAllColumnsData, getSelectedBoardId } from "@/features/board/boardSlice";

// api
import { BaseURL, GetAllColumnsByBoardIdURL } from "@/API/Apis";
import axios from "axios";
import { useEffect } from "react";

//types
import type { AppDispatch } from "@/app/store";

type columnDataType = {
  board_id: number;
  id: number;
  name: string;
  number_of_tasks: number;
};
type columnType = {
  name: string,
  id: number,
  board_id?: number,
  number_of_tasks : number,  
}


export default function ColumnsContainer() {
  

  let dispatch = useDispatch<AppDispatch>();
  let columns = useSelector(getAllColumnsData);
  let selectedBoardId = useSelector(getSelectedBoardId);

  if(columns.length <= 0 && selectedBoardId < 0) return <></>
   
  useEffect(() => {
    dispatch(GetAllColumnsByBoardId() );
  }, [])
  

  let ColumnsContent ; // the UI element

  let data = columns; // formatted data

    ColumnsContent = data.map((column: columnType, index: number) => {
      return (
        <Column
          key={index}
          index={index}
          column_id={column.id}
          name={column.name}
          number_of_tasks={column.number_of_tasks}
        />
      );
    });
  

  let AddNewColumnContent = (
    <EditBoardDialog>
      <div
        id="add-column-button"
        className="h-[95%] w-[300px] min-w-[300px] mx-4 mt-2 bg-[#e4ebfa] dark:bg-[#22242e] flex-col flex justify-center cursor-pointer rounded-[5px] group">
        <h1 className="text-center text-[#828Fa3] text-2xl font-bold group-hover:text-[#635FC7] ">
          + New Column
        </h1>
      </div>
    </EditBoardDialog>
  );
 
  return (
    <>
      {data.length <= 0 && (
        <div
          id="columns-section-root-empty"
          className=" bg-[#f4f7fd] dark:bg-[#20212c] w-full flex justify-center ">
          <div
            className=" w-fit h-fit mx-auto mt-[20%] flex justify-center flex-col 
           not-md:mt-[50%]
          ">
            <h2
              className="text-[#828fa3] font-bold text-center w-[80%] mx-auto
              md:w-full">
              This board is empty. Create a new column to get started
            </h2>
            <EditBoardDialog>
              <button className="text-white bg-[#635FC7] hover:bg-[#a8a4ff] font-bold rounded-full px-4 py-3 mx-auto block mt-4 cursor-pointer">
                + Add New Column
              </button>
            </EditBoardDialog>
          </div>
        </div>
      )}
      {data.length > 0 && (
        <div
          id="columns-section-root"
          className=" bg-[#f4f7fd] dark:bg-[#20212c] w-full overflow-auto h-full  flex ">
          {ColumnsContent}
          {AddNewColumnContent}
        </div>
      )}
    </>
  );
}
