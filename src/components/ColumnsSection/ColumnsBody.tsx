import { useQuery } from "@tanstack/react-query";
import Task from "./Task";
import { BaseURL, GetAllTasksByColumnId } from "@/API/Apis";
import axios from "axios";

type taskType = {
  column_id: number;
  name: string;
  id: number;
  number_of_subtasks: number;
  number_of_completed_subtasks: number;
};

export default function ColumnsBody({ column_id }: { column_id: number }) {
  // we get tasks using column id
  // let tasksData = useQuery({
  //     queryKey: [`column-id${column_id}`, `tasks`],
  //     queryFn: () => {
  //         let url = BaseURL + GetAllTasksByColumnId + column_id + "/";
  //         return axios.get(url);
  //     },
  //     staleTime: 1000 * 5 * 60,
  //      enabled: column_id ? true : false
  // });

  let tasksData = [
    {
      name: "task-1",
      id: 1,
      column_id: 1,
      number_of_subtasks: 4,
      number_of_completed_subtasks: 2,
    },
    {
      name: "task-2",
      id: 1,
      column_id: 1,
      number_of_subtasks: 4,
      number_of_completed_subtasks: 2,
    },
    {
      name: "task-3",
      id: 1,
      column_id: 1,
      number_of_subtasks: 4,
      number_of_completed_subtasks: 2,
    },
    {
      name: "task-4",
      id: 1,
      column_id: 1,
      number_of_subtasks: 4,
      number_of_completed_subtasks: 2,
    },
  ];

//   if (tasksData.isSuccess) {
    // tasks = tasksData?.data?.map((task :taskType , index:number) => {
    //     return <Task key={index} name={task.name}
    //     id={task.id}
    //     number_of_completed_subtasks={task.number_of_completed_subtasks}
    //     number_of_subtasks={task.number_of_subtasks}
    //     />
    //     // when click send the id of task to popup box
    // })
    //   }
    let tasks = tasksData.map((e) => {
        return <Task name={e.name} number_of_completed_subtasks={e.number_of_completed_subtasks}
         number_of_subtasks={e.number_of_subtasks} id ={e.id} />
    } )
  return <div className=" w-full pb-5">{tasks}</div>;
}
