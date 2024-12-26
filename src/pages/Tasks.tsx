import { useState } from "react";
import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import Filter from "../components/Filter";
import { DataType, useGetTodos } from "../services";
import { AnimatePresence } from "framer-motion";
import OfflineNotification from "../components/OfflineNotification";

const getFilter = (fil: number) => {
  switch (fil) {
    case 1:
      return (da: DataType) => da.completed;
    case 2:
      return (da: DataType) => !da.completed;
    default:
      return (da: DataType) => da;
  }
};

const Tasks = () => {
  const [filter, setFilter] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [editData, setEditData] = useState<DataType | null>(null);
  const { data, isFetching } = useGetTodos();
  const newData: Array<DataType> = data?.data?.data;

  return (
    <>
      <OfflineNotification />
      <div className="p-4 max-w-xl mx-auto h-full">
        <Filter
          filter={filter}
          setFilter={setFilter}
          handleClick={() => {
            setShowInput(!showInput);
            setEditData(null);
          }}
        />
        <AnimatePresence>
          {(showInput || editData) && (
            <TaskInput editData={editData} setEditData={setEditData} />
          )}
        </AnimatePresence>
        {isFetching && <p>Loading</p>}
        {data && (
          <TaskList
            setEditData={setEditData}
            todos={newData?.filter(getFilter(filter))}
          />
        )}
      </div>
    </>
  );
};

export default Tasks;
