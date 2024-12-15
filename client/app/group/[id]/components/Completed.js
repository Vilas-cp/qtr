import React from "react";
import { useUser } from "@clerk/nextjs";

function Completed({ tasks }) {
  const { isSignedIn, user } = useUser();


  if (!isSignedIn) {
    return <p>Please sign in to view your tasks.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Completed</h2>
      <ul className="space-y-4 overflow-scroll">
        {tasks
          ?.filter(
            (task) =>
              task.assignedTo &&
              task.assignedTo.email &&
              task.assignedTo.email === user.primaryEmailAddress?.emailAddress
          )
          .map((task, index) => (
            <li key={index} className="border p-4 rounded-md">
              <h3 className="font-medium text-lg">{task.taskTitle}</h3>
              <p className="text-gray-500 mt-2">{task.taskDescription}</p>
              <p className="text-sm mt-2">
                <span className="font-semibold">Status:</span>
                <span
                  className={`px-3 ml-2 py-1 text-white rounded-sm ${
                    task.status === "pending" ? "bg-[#ff2732]" : "bg-green-500"
                  }`}   onClick={() => toggleTaskStatus(task.taskId, task.status)} 
                >
                  {task.status}
                </span>
              </p>
             
              {task.assignedTo && (
                <p className="text-sm mt-2">
                  <span className="font-semibold">Assigned To:</span>{" "}
                  <span>
                    {task.assignedTo.name} ({task.assignedTo.email})
                  </span>
                </p>
              )}
              {task.dueDate && (
                <p className="text-sm text-gray-400 mt-2">
                  <span className="font-semibold">Due Date:</span>{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
               <p className="pt-[10px]">
                <span
                  className={`px-3 py-1 text-white rounded-sm ${
                    task.priority === "high"
                      ? "bg-[#ff2732]" // Red for high priority
                      : task.priority === "medium"
                      ? "bg-[#ffc107]" // Yellow for medium priority
                      : "bg-[#28a745]" // Green for low priority
                  }`}
                >
                  {task.priority}
                </span>
              </p>

            </li>
          ))}
      </ul>
    </div>
  );
}

export default Completed;
