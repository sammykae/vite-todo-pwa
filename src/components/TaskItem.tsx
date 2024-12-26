import { AiFillDelete, AiOutlineLoading3Quarters } from "react-icons/ai";
import { DataType, useCompleteTodo, useDeleteTodo } from "../services";
import { FaRegEdit } from "react-icons/fa";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const TaskItem = ({
  setEditData,
  item,
}: {
  setEditData: Dispatch<SetStateAction<DataType | null>>;
  item: DataType;
}) => {
  const { mutate, isPending } = useCompleteTodo();
  const { mutate: deleteTodo, isPending: delPending } = useDeleteTodo();
  const { category, completed, desc, _id, title } = item;
  const [pending, setPending] = useState(isPending);

  useEffect(() => {
    setPending(isPending);
  }, [isPending]);

  return (
    <div
      data-completed={completed}
      className="my-2 rounded border p-2 border-l-4  border-l-[red] data-[completed=true]:border-l-[green]"
    >
      <div className="flex justify-between items-center gap-3">
        <h1 className="text-lg">{title}</h1>
        <button disabled={delPending} onClick={() => deleteTodo({ _id })}>
          {delPending ? (
            <AiOutlineLoading3Quarters className="animate-spin" size={20} />
          ) : (
            <AiFillDelete className="fill-red-500" size={20} />
          )}
        </button>
      </div>
      <div className="flex justify-between items-center gap-3">
        <p className="text-md">{desc}</p>
        <button disabled={delPending} onClick={() => setEditData(item)}>
          <FaRegEdit className="fill-blue-500" size={20} />
        </button>
      </div>

      <div className="flex justify-between">
        <p className="text-sm capitalize">
          status:&nbsp;
          <button
            data-completed={completed}
            className="cursor-pointer bg-red-300 px-1 rounded-md capitalize data-[completed=true]:bg-green-300"
            disabled={pending}
            onClick={async () => {
              setTimeout(() => {
                if (!navigator.onLine) {
                  setPending(false);
                }
              }, 1000);
              mutate({ _id });
            }}
          >
            {pending ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : completed ? (
              "completed"
            ) : (
              "incomplete"
            )}
          </button>
        </p>
        {category && <p className="text-sm capitalize">category: {category}</p>}
      </div>
    </div>
  );
};

export default TaskItem;
