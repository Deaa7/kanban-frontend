import TaskDetailsDialog from "../Dialogs/TaskDetailsDialog";

export default function Task({
  name,
  number_of_completed_subtasks,
  number_of_subtasks,
  id,
}: {
  name: string;
  number_of_completed_subtasks: number;
  number_of_subtasks: number;
  id: number;
}) {
  sessionStorage.setItem("chosen_task_id", id.toString());

  return (
    <TaskDetailsDialog>
      <div className="bg-white dark:bg-[#2b2c37] my-6 p-4 rounded-[8px] cursor-pointer shadow-lg group
      not-sm:p-3">
        <h1 className="font-bold  group-hover:text-[#635FC7]">{name}</h1>
        <p className="text-[#828Fa3] text-xs my-2 font-bold">
          {number_of_completed_subtasks} of {number_of_subtasks} subtasks
        </p>
      </div>
    </TaskDetailsDialog>
  );
}
