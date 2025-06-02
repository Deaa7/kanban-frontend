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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

//icons
import { XIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { getSelectedBoardInfo } from "@/features/board/boardSlice";
import axios from "axios";
import {
  BaseURL,
  CreateSubtask,
  CreateTask,
  GetAllColumnsByBoardIdURL,
  IncreaseNumberOfColumnTasks,
  IncreaseNumberOfTaskSubtasks,
} from "@/API/Apis";

 
type AddTaskStateType = {
  title: string;
  description: string;
  subTasks: string[];
  status: number,
};

type ColumnType = {
  name: string;
  id: number;
  board_id: number;
};

export default function AddTaskDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  // we get columns data that is cached
  let selectedBoardInfo = useSelector(getSelectedBoardInfo);

  let currentBoardId = selectedBoardInfo?.id;

  let [{ title, description, subTasks, status }, setAddTasksState] =
    useState<AddTaskStateType>({
      title: "",
      description: "",
      subTasks: ["", ""], // array of strings
      status: 0,
    });

  let [columnsInfo, setColumnsInfo] = useState<ColumnType[]>([]); // to build column status select

  let initializeData = async (e: boolean) => {
    // function runs when dialog state changes from close (false) to open (true)
    
    if (!e) return;

    let url = BaseURL + GetAllColumnsByBoardIdURL + currentBoardId + "/";

    axios.get(url).then((res) => {
      if (res.data)
      {
        setColumnsInfo(res.data);
        setAddTasksState((prev) => {
          return { ...prev, status: res.data[0].id ?? 0 };
        })
      }
    });
  };

  let getColumnNameByColumnId = (id: number) => columnsInfo.find(e => e.id == id)?.name;

  let AddTaskFormSubmitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    
    let url = BaseURL + CreateTask ;
 
    let newTaskObject = {
      name: title,
      description: description,
      status: getColumnNameByColumnId(status),
      column_id : status,
    };
    
    try {
      let res = await axios.post(url, newTaskObject); //creates a new task
      
      let url2 = BaseURL + IncreaseNumberOfColumnTasks +status+"/"; 
      
        await axios.post(url2); // increases number of column's tasks
      
      let url3 = BaseURL + CreateSubtask;
       
      let task_id = res.data.id;
      
      subTasks.forEach(async (subtask) => {
        
        let newSubtaskObject = {
          name: subtask,
          is_done: false,
         task_id : task_id, 
        };

       let res2 = await axios.post(url3, newSubtaskObject); // creates a subtask for the new created task
        
        let url4 = BaseURL + IncreaseNumberOfTaskSubtasks + task_id + "/";

        await axios.post(url4);

      });
    } catch (e) {
      console.log('add task error ', e);
    }
  };

  let SubtasksInputFieldsContainer = subTasks.map((e, index) => {
    return (
      <div className="flex justify-between my-3" key={index}>
        <input
          type="text"
          name={`subtask-input-field${index}`}
          id={`subtask-input-field${index}`}
          value={e}
          maxLength={200}
          className="py-2 px-3 w-full dark:focus:border-[#635FC7] outline-0 rounded-[5px] dark:placeholder:opacity-50 border border-[#828Fa3] placeholder:text-[#bfbfc3]"
          placeholder={
            index % 2 == 0 ? "e.g. Make Coffee" : "e.g. Drink coffee & smile"
          }
          onChange={(e) => {
            let temp = subTasks;
            temp[index] = e.target.value;

            setAddTasksState((previous) => {
              return { ...previous, subTasks: temp };
            });
          }}
        />
        <div
          className="py-2 cursor-pointer pl-2"
          onClick={() => {
            let temp: string[] = [];
            subTasks.forEach((item, i) => {
              if (i !== index) temp.push(item);
            });

            setAddTasksState((prev) => {
              return { ...prev, subTasks: temp };
            });
          }}>
          <XIcon size={26} strokeWidth={3} color="#828Fa3" />
        </div>
      </div>
    );
  });

  let SelectStatus = columnsInfo.map((e: ColumnType) => {

    return (
      <SelectItem
        key={`select-status${e.id}`}
        value={e.id.toString()}
        className="font-bold mb-2 text-[#828Fa3]">
        {e.name}
      </SelectItem>
    );
  });

  return (
    <Dialog onOpenChange={(e) => initializeData(e)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="rounded-[5px] dark:bg-[#2b2c37]">
        <DialogHeader>
          <DialogTitle className="font-bold">Add New Task</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <form
          onSubmit={(e) => AddTaskFormSubmitHandler(e)}
          className="not-sm:text-sm">
          <div id="new-task-title-input-container">
            <label
              htmlFor="new-task-title-input-field"
              className="block text-[#828Fa3] dark:text-white font-semibold mb-1  text-sm">
              Title
            </label>
            <input
              type="text"
              name="new-task-title-input-field"
              id="new-task-title-input-field"
              className="py-2 px-3 w-full dark:focus:border-[#635FC7] outline-0 border rounded-[5px] border-[#828Fa3] placeholder:text-[#bfbfc3] dark:placeholder:opacity-50 "
              placeholder="e.g. Take coffee break"
              maxLength={200}
              onChange={(e) =>
                setAddTasksState((prev) => {
                  return { ...prev , title: e.target.value };
                })
              }/>
          </div>

          <div id="new-task-description-input-container" className="mt-5">
            <label
              htmlFor="new-task-description-input-field"
              className="block text-[#828Fa3] dark:text-white font-semibold mb-1 text-sm">
              Description
            </label>
            <textarea
              name="new-task-description-input-field"
              id="new-task-description-input-field"
              maxLength={1200}
              placeholder="e.g. it's always good to take a break. This 15 minutes break will recharge the batteries a little"
              className=" resize-none border dark:focus:border-[#635FC7] outline-0 rounded-[5px] w-full h-[110px]  p-2 border-[#828Fa3] placeholder:text-[#bfbfc3] dark:placeholder:opacity-50
              "
              onChange={(e) =>
                setAddTasksState((prev) => {
                  return { ...prev, description: e.target.value };
                })
              }></textarea>
          </div>
          <div id="new-task-subtasks-container" className="mt-5">
            <p className="text-[#828Fa3] font-semibold dark:text-white  text-sm">
              Subtasks
            </p>

            <div
              id="new-task-subtasks-body"
              className="max-h-[140px] overflow-auto">
              {SubtasksInputFieldsContainer}
            </div>
            <div
              className="w-full rounded-full text-center bg-[#f0effa] text-[#635FC7] hover:bg-[#d8d7f1] py-3 font-bold cursor-pointer"
              onClick={() => {
                let temp = subTasks;
                temp.push("");
                setAddTasksState((prev) => {
                  return { ...prev, subTasks: temp };
                });
              }}>
              + Add New Subtask
            </div>
          </div>
          <div id="new-task-status-container" className="mt-5">
            <p className="text-[#828Fa3] font-semibold  text-sm dark:text-white mb-2">
              Status :
            </p>
            <Select
            defaultValue={status.toString()}
              onValueChange={(e) =>  
                setAddTasksState((prev) => {
                  return { ...prev, status: parseInt(e) };
                })
              }>
              <SelectTrigger className="w-full py-5 dark:bg-[#2b2c37] rounded-sm  dark:hover:bg-[#2b2c37] data-[state=open]:border data-[state=open]:border-[#635FC7] font-bold">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#2b2c37]">
                {SelectStatus}
              </SelectContent>
            </Select>
          </div>
          <input
            type="submit"
            value="Create Task"
            className="w-full bg-[#635FC7] rounded-full py-2 mt-7 text-white hover:bg-[#a8a4ff] font-bold cursor-pointer"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
