//hooks
import { useMemo } from "react";
import { useSelector } from "react-redux";

//components
import Task from "./Task";

// type
import { type ReactNode } from "react";
import type { taskType } from "@/types/types";

//functions
import { getAllTasks } from "@/features/tasks/tasksSlice";


export default function ColumnsBody({ column_id = 0 }: { column_id: number }) {

  let tasksData: taskType[] = useSelector(getAllTasks);

  let tasks = useMemo(
    () => tasksData.filter((col) => col.column_id == column_id),
    [column_id, tasksData]
  );

  let tasksUIComponent: ReactNode;

  tasksUIComponent = tasks?.map((task: taskType) => {
    return (
      <Task
        key={'task-'+task.id}
        column_id={column_id}
        name={task.name}
        id={task.id ?? 0}
        description={task.description}
        number_of_completed_subtasks={task.number_of_completed_subtasks}
        number_of_subtasks={task.number_of_subtasks}
      />
    );
  });

  return <div className=" w-full pb-5">{tasksUIComponent}</div>;
}
