//hooks
import { useSelector } from "react-redux";

//function
import {
  getBoardItems,
  getSelectedBoardId,
} from "../../features/board/boardSlice";

//component
import BoardItem from "./BoardItem";

export default function BoardItemsList() {
  
  let boards = useSelector(getBoardItems);
  let numberOfCurrentBoards = boards.length;
  let selectedBoard = useSelector(getSelectedBoardId);

  let boardList = (
    <div>
      {boards.map((item, index) => {
        return (
          <BoardItem
            name={item.name}
            id={item.id}
            key={index}
            selected={item.id === selectedBoard}
          />
        );
      })}
    </div>
  );

  return (
    <div className="w-full mt-10">
      <p
        id="number-of-current-boards"
        className="indent-5 text-sm text-[#828Fa3] font-semibold mb-5
       not-lg:text-xs
      ">
        ALL BOARDS ({numberOfCurrentBoards})
      </p>
      <div className=" max-h-[500px] not-sm:max-h-[250px] overflow-auto">
        {boardList}
      </div>
    </div>
  );
}
