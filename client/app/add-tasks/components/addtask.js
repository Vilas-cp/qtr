"use client";
import { useState, useEffect } from "react";
import { sanityClient } from "../../../sanity";
import { useRouter } from "next/navigation";




const TaskForm = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!sanityClient) {
        console.error("sanityClient is not initialized");
        return;
      }

      const query = '*[_type == "task"]';
      const sanityTasks = await sanityClient.fetch(query);
      setTasks(sanityTasks);
    };

    fetchTasks();
  }, []);

  // State for form inputs
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "in-progress",
    pomodoroSettings: {
      workDuration: 25,
      breakDuration: 5,
      longBreakDuration: 15,
    },
  });

  // Handle changes in form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("pomodoroSettings")) {
      const key = name.split(".")[1]; // workDuration, breakDuration, etc.
      setTask((prevTask) => ({
        ...prevTask,
        pomodoroSettings: {
          ...prevTask.pomodoroSettings,
          [key]: value,
        },
      }));
    } else {
      setTask({
        ...task,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Push task to Sanity
      const newTask = await sanityClient.create({
        _type: "task",
        title: task.title,
        description: task.description,
        status: task.status,
        pomodoroSettings: {
          workDuration: task.pomodoroSettings.workDuration,
          breakDuration: task.pomodoroSettings.breakDuration,
          longBreakDuration: task.pomodoroSettings.longBreakDuration,
        },
      });

      // Update tasks in state
      setTasks((prevTasks) => [...prevTasks, newTask]);

      // Reset form
      setTask({
        title: "",
        description: "",
        status: "in-progress",
        pomodoroSettings: {
          workDuration: 25,
          breakDuration: 5,
          longBreakDuration: 15,
        },
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="relative ">
      {/* Button to toggle form visibility */}
      <button
        onClick={() => setShowForm((prev) => !prev)}
        className="p-4 rounded fixed bottom-8 right-7 z-50"
      >
        {showForm ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-12"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-12"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {/* Overlay background */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-30" />
      )}

      {/* Form with sliding animation */}
      <div
        className={`fixed top-0 right-0 w-[500px] h-full bg-white shadow-lg z-40 transform transition-all duration-700 ease-in-out ${
          showForm
            ? "translate-x-0 opacity-100" // Form visible (in view)
            : "translate-x-full opacity-0" // Form hidden (off-screen)
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className="p-4 space-y-4 px-[100px] pt-[50px] font-medium"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm text-gray-600"
              placeholder="Enter the task"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleInputChange}
              className="w-full p-2  rounded text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              placeholder="Enter the task description"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={task.status}
              onChange={handleInputChange}
              className="w-full p-2 text-sm bg-white shadow-lg  border-gray-100 border-[1px] rounded"
            >
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="mt-[10px]">
            <label className="block text-sm font-medium">
              Work Duration (minutes)
            </label>
            <input
              type="number"
              name="pomodoroSettings.workDuration"
              value={task.pomodoroSettings.workDuration}
              onChange={handleInputChange}
              className="w-full p-2 text-sm rounded  bg-white shadow-lg  border-gray-100 border-[1px] focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              required
            />
          </div>

          <div className="mt-[10px]">
            <label className="block text-sm font-medium">
              Break Duration (minutes)
            </label>
            <input
              type="number"
              name="pomodoroSettings.breakDuration"
              value={task.pomodoroSettings.breakDuration}
              onChange={handleInputChange}
              className="w-full p-2  text-sm rounded  bg-white shadow-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black  border-gray-100 border-[1px]"
              required
            />
          </div>

          <div className="mt-[10px]">
            <label className="block text-sm font-medium">
              Long Break Duration (minutes)
            </label>
            <input
              type="number"
              name="pomodoroSettings.longBreakDuration"
              value={task.pomodoroSettings.longBreakDuration}
              onChange={handleInputChange}
              className="w-full p-2  rounded text-sm  bg-white shadow-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black border-gray-100 border-[1px]"
              required
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>

      {/* Displaying task data */}
      <div className="mt-8 ml-[250px]">
        <h2 className="text-[50px] font-bold pb-5">
           Task List
            </h2>
        <ul className="space-y-2 w-[500px] pb-[100px]">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="p-4 border border-gray-200 flex hover:bg-gray-100 items-center  space-x-4 cursor-pointer"
              onClick={() => router.push(`/clock2/${task._id}`)}
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-gray-400 font-medium text-sm">{task.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskForm;
