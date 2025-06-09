//hooks
import { useSelector } from "react-redux";

//components
import ColumnHeader from "./ColumnHeader";
import ColumnsBody from "./ColumnsBody";
import EditBoardDialog from "../Dialogs/EditBoardDialog";

//functions
import { getColumns } from "@/features/columns/columnSlice";

//type 
import type { ReactNode } from "react";
import type { columnType } from "@/types/types";

export default function Column() {
  
  let columnsData: columnType[] = useSelector(getColumns);

  let numberOfColumns: number = columnsData.length;

  let ColumnsContent: ReactNode; // the UI element

  ColumnsContent = columnsData.map((column, index) => {
    return (
      <div
        key={`column-container-${column.id}`}
        className="w-[300px] min-w-[300px] mx-4 mt-2">
        <ColumnHeader
          key={`column-header-${column.id}`}
          index={index}
          name={column.name}
          number_of_tasks={column.number_of_tasks}
        />
        <ColumnsBody key={`column-body-${column.id}`} column_id={column.id} />
      </div>
    );
  });

  const AddNewColumnContent = (
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
      
      {numberOfColumns <= 0 && (
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
      {numberOfColumns > 0 && (
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
