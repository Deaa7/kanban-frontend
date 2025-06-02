export default function ColumnHeader({
  name,
  number_of_tasks,
  index = 0,
}: {
  name: string;
  number_of_tasks: number;
  index: number;
}) {

  return (
    <div className="w-full mb-5">
      <h2 className="flex font-bold text-[#828Fa3]">
        <div
          className={`inline-block w-5 h-5 my-auto rounded-full mr-3   ${
            index % 3 == 0
              ? "bg-[#49c4e5]"
              : index % 3 == 1
              ? "bg-[#8471f2]"
              : "bg-[#67e2ae]"
          }`}></div>
        {name} &nbsp; ({number_of_tasks})
      </h2>
    </div>
  );
}
