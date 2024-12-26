import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { DataType, useCreateTodo, useUpdateTodo } from "../services";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { motion } from "framer-motion";
const TaskInput = ({
  editData,
  setEditData,
}: {
  editData: DataType | null;
  setEditData: Dispatch<SetStateAction<DataType | null>>;
}) => {
  const [title, setTitle] = useState(editData?.title || "");
  const [category, setCategory] = useState(editData?.category || "");
  const [desc, setDesc] = useState(editData?.desc || "");

  const resetValues = () => {
    setCategory("");
    setDesc("");
    setTitle("");
    setEditData(null);
  };

  useEffect(() => {
    if (editData) {
      setCategory(editData?.category as string);
      setDesc(editData?.desc as string);
      setTitle(editData?.title as string);
    }
  }, [editData]);
  const { mutate, isPending } = useCreateTodo(resetValues);
  const { mutate: updateTodo, isPending: upPending } =
    useUpdateTodo(resetValues);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const todoData: DataType = {
      title,
      desc,
      category: category !== "" ? category : null,
      completed: false,
    };

    if (todoData.category === null) {
      delete todoData.category;
    }
    if (editData) {
      updateTodo({
        ...todoData,
        _id: editData._id,
        completed: editData?.completed,
      });
    } else {
      mutate(todoData);
    }
  };
  return (
    <motion.form
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      key="modal"
      className="flex flex-col gap-3"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title here"
        className="grow border p-2 rounded-md outline-none"
      />
      <textarea
        required
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Description here"
        className="grow border p-2 rounded-md outline-none"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="grow border p-2 rounded-md outline-none"
      >
        <option value="">Select Category</option>
        <option value="work">Work</option>
        <option value="fun">Fun</option>
        <option value="school">School</option>
        <option value="shopping">Shopping</option>
        <option value="finance">Finance</option>
        <option value="health">Health</option>
        <option value="others">Others</option>
      </select>
      <div className="text-right">
        <button
          disabled={isPending || upPending}
          className="bg-green-500 px-2 py-1 w-24 h-8 cursor-pointer flex justify-center items-center rounded-md"
        >
          {isPending || upPending ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : editData ? (
            "Edit"
          ) : (
            "Save"
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default TaskInput;
