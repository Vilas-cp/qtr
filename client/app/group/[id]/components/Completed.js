import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";

function Completed({ tasks, toggleTaskStatus }) {
  const { isSignedIn, user } = useUser();
  const [selectedTask, setSelectedTask] = useState(null); // To store the selected task for the dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false); // To control the dialog visibility

  if (!isSignedIn) {
    return <p>Please sign in to view your tasks.</p>;
  }

  // Open the dialog and set the selected task
  const openDialog = (task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  // Close the dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedTask(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-5 text-gray-800">
        Completed Tasks
      </h2>
      <ul className="space-y-4 overflow-y-auto">
        {tasks
          ?.filter(
            (task) =>
              task.assignedTo &&
              task.assignedTo.email &&
              task.assignedTo.email === user.primaryEmailAddress?.emailAddress
          )
          .map((task, index) => (
            <li
              key={index}
              className="border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out"
            >
              <h3 className="font-medium text-xl text-gray-800">
                {task.taskTitle}
              </h3>
              <p className="text-gray-600 mt-2">{task.taskDescription}</p>

              <p className="text-sm mt-2">
                <span className="font-semibold text-gray-700">Status:</span>{" "}
                <span
                  className={`px-3 py-1 text-white rounded-sm ${
                    task.status === "pending" ? "bg-[#ff2732]" : "bg-green-500"
                  } cursor-pointer`}
                  onClick={() => toggleTaskStatus(task.taskId, task.status)} // Pass taskId here
                >
                  {task.status}
                </span>
              </p>

              {task.assignedTo && (
                <p className="text-sm mt-2 text-gray-600">
                  <span className="font-semibold text-gray-700">
                    Assigned To:
                  </span>{" "}
                  {task.assignedTo.name} ({task.assignedTo.email})
                </p>
              )}

              {task.dueDate && (
                <p className="text-sm text-gray-400 mt-2">
                  <span className="font-semibold text-gray-700">Due Date:</span>{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}

              <p className="pt-[10px]">
                <span
                  className={`px-3 py-1 text-white rounded-full ${
                    task.priority === "high"
                      ? "bg-[#ff2732]"
                      : task.priority === "medium"
                      ? "bg-[#ffc107]"
                      : "bg-[#28a745]"
                  }`}
                >
                  {task.priority}
                </span>
              </p>

              <div
                className="bg-[#7f8ac6] py-[1px] px-2 text-white w-[70px] flex items-center gap-1 mt-5 cursor-pointer rounded-sm"
                onClick={() => openDialog(task)} // Open dialog on click
              >
                <p>View</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </div>
            </li>
          ))}
      </ul>

      {/* Right Dialog (Modal) */}
      {isDialogOpen && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-end z-50 bg-gray-800 bg-opacity-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-white w-[600px] h-screen p-6 rounded-l-md overflow-auto shadow-lg transform transition-transform duration-300 ease-in-out translate-x-full sm:translate-x-0">
            <div className="relative">
              <h2 className="text-3xl font-semibold mb-4 text-gray-800">
                {selectedTask.taskTitle}
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                {selectedTask.taskDescription}
              </p>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">
                    Assigned To:
                  </span>{" "}
                  <br />
                  <div className="space-y-4">
                    <div>{selectedTask.assignedTo.name}</div>
                    <div className="bg-green-200 px-2 w-fit rounded-[9999px] ml-4 py-2 mt-3 ">
                      {selectedTask.assignedTo.email}
                    </div>
                  </div>
                </p>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 mt-7">
                    <span className="font-semibold text-gray-800">
                      Due Date:
                    </span>{" "}
                    {new Date(selectedTask.dueDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-4 py-[20px]">
                  <span className="font-semibold text-gray-800">Priority:</span>{" "}
                  <span
                    className={`px-3 py-1 text-white rounded-full ${
                      selectedTask.priority === "high"
                        ? "bg-[#ff2732]"
                        : selectedTask.priority === "medium"
                        ? "bg-[#ffc107]"
                        : "bg-[#28a745]"
                    }`}
                  >
                    {selectedTask.priority}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">Status:</span>{" "}
                  <span
                    className={`px-3 py-1 rounded-full ${
                      selectedTask.status === "pending"
                        ? "bg-[#ff2732]"
                        : "bg-green-500"
                    } text-white`}
                  >
                    {selectedTask.status}
                  </span>
                </p>
              </div>

              <button
                className="absolute top-4 right-4 bg-transparent text-gray-500 hover:text-gray-800 focus:outline-none"
                onClick={closeDialog}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <button
                className="mt-6 bg-[#7f8ac6] text-white px-4 py-2 rounded-md w-full hover:bg-[#5f6b91] transition duration-200"
                onClick={closeDialog}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Completed;
