import { Dispatch, SetStateAction } from "react";
import { DataType } from "../services";
import TaskItem from "./TaskItem";

const TaskList = ({
  setEditData,
  todos,
}: {
  setEditData: Dispatch<SetStateAction<DataType | null>>;
  todos: Array<DataType>;
}) => {
  return (
    <div className="mt-3">
      {todos.map((todo) => (
        <TaskItem setEditData={setEditData} key={todo._id} item={todo} />
      ))}
    </div>
  );
};

export default TaskList;
