//hooks
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../types/types";

//components
import Column from "./Column";
import Loading from "../Loading";

// functions
import { getSelectedBoardId } from "@/features/board/boardSlice";
import { GetAllColumnsByBoardId } from "@/features/columns/columnSlice";
import { GetAllTasksByBoardId } from "@/features/tasks/tasksSlice";

export default function ColumnsContainer() {
  
  const board_id = useSelector(getSelectedBoardId);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (board_id > 0) {
      dispatch(GetAllColumnsByBoardId());
      dispatch(GetAllTasksByBoardId());
    }
  });

  return <>{board_id < 0 ? <Loading /> : <Column />}</>;
}
