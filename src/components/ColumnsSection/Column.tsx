import ColumnHeader from "./ColumnHeader";
import ColumnsBody from "./ColumnsBody";



export default function Column({index, column_id, name, number_of_tasks  }:
    {
        column_id: number,
        name: string,
        number_of_tasks: number,
        index : number 
     
    })

{
    
    return <div className="w-[300px] min-w-[300px] mx-4 mt-2">
            <ColumnHeader index= {index}  name = { name }  number_of_tasks={number_of_tasks} />
      
        <ColumnsBody column_id={column_id} />
    </div>
    
}