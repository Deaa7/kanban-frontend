import { useSelector } from "react-redux";
import {
  getBoardItems,
  getNumberOfBoardItems,
  getSelectedBoardId,
} from "../../features/board/boardSlice";
import BoardItem from "./BoardItem";
import AddBoardButton from "./AddBoardButton";

export default function BoardItemsList() {
  let numberOfCurrentBoards = useSelector(getNumberOfBoardItems);
  let selectedBoard = useSelector(getSelectedBoardId);
  let boards = useSelector(getBoardItems);

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
    <div className="w-full  mt-10">
      <p id="number-of-current-boards" className="indent-5 text-sm text-[#828Fa3] font-semibold mb-5
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
