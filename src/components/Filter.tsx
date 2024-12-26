import { Dispatch, SetStateAction } from "react";
import { IoMdAdd } from "react-icons/io";
interface Props {
  filter: number;
  setFilter: Dispatch<SetStateAction<number>>;
  handleClick: VoidFunction;
}

const filters = ["all", "completed", "incomplete"];
const Filter = ({ filter, setFilter, handleClick }: Props) => {
  return (
    <div className="flex gap-5 justify-between my-3 items-center">
      <div className="flex gap-5 ">
        {filters.map((fil, ind) => (
          <button
            key={ind}
            data-active={filter}
            className={`rounded-lg text-black px-2 min-w-20 bg-blue-200 capitalize text-md data-[active=${ind}]:bg-blue-500`}
            onClick={() => setFilter(ind)}
          >
            {fil}
          </button>
        ))}
      </div>
      <button onClick={handleClick} className="bg-green-500 p-1 rounded-full">
        <IoMdAdd size={20} />
      </button>
    </div>
  );
};

export default Filter;
