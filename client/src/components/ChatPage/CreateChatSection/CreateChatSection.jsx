import { useState } from "react";
import { CreateChatroom } from "../../../services/ChatroomsService";

const CreateChatSection = ({ handleRefresh }) => {
  const [formData, setFormData] = useState({ name: "" });

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await CreateChatroom(formData.name);
    if (response) {
      handleRefresh();
    }
  };

  return (
    <div className="basis-3/4 bg-gray-200">
      <div className="flex justify-center items-center h-screen ">
        <form
          className="bg-white rounded px-8 pt-6 pb-8 mb-4 w-96 shadow-md"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Create Channel{" "}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="name"
              required={true}
              type="text"
              placeholder="Enter Channel Name"
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-teal-500 hover:bg-teal-700 font-semibold py-2 px-4 rounded text-white mt-2"
              type="submit"
            >
              Create Channel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChatSection;
