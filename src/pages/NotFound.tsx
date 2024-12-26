import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl uppercase">This page does not exist</h1>
      <h1 className="my-3">Go to the home page</h1>
      <Link className="w-fit" to="/">
        <button className="bg-red-500 px-2 py-1 text-white rounded-md">
          View Tasks
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
