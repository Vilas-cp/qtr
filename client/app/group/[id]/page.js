"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { sanityClient } from "../../../sanity"; // Adjust this to your Sanity client configuration
import Pending from "./components/Pending";
import Completed from "./components/Completed";
import { useRouter } from "next/navigation";
import LottieAnimation from "@/app/components/Loading";
const UserDetails = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false); // Controls dialog visibility
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");

  const [dueDate, setDueDate] = useState("");
  const [members, setMembers] = useState([]); // Store members of the project

  // Fetch project details and members
  useEffect(() => {
    const fetchProject = async () => {
      console.log("Fetching project with ID:", projectId);

      try {
        const query = `
          *[_type == "project" && _id == $projectId] {
            projectName,
            projectDescription,
            members[] {
              _ref
            },
            tasks[] {
              taskId,
              taskTitle,
              taskDescription,
              status,
              priority,
              dueDate,
              assignedTo-> { name, email }
            }
          }
        `;
        const data = await sanityClient.fetch(query, { projectId });
        setProject(data.length > 0 ? data[0] : null);

        // Fetch project members' details for the dropdown
        if (data.length > 0) {
          const memberIds = data[0].members.map((member) => member._ref);
          const memberQuery = `*[_type == "user" && _id in $memberIds] { _id, name }`;
          const membersData = await sanityClient.fetch(memberQuery, {
            memberIds,
          });
          setMembers(membersData);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleAddTask = async () => {
    if (!taskTitle || !priority || !assignedTo) {
      alert("Please fill all required fields.");
      return;
    }

    const newTask = {
      _key: Math.random().toString(36).substring(2, 10), // Generate a unique key
      taskTitle,
      taskDescription,
      priority,
      status: "pending", // Default status
      assignedTo: {
        _ref: assignedTo, // Ensure assignedTo is a reference object
        _type: "reference",
      },
      dueDate,
      taskId: `task_${Math.random().toString(36).substr(2, 9)}`,
    };

    try {
      const updatedProject = await sanityClient
        .patch(projectId) // Replace `projectId` with your project's ID
        .setIfMissing({ tasks: [] }) // Ensure the `tasks` array exists
        .insert("after", "tasks[-1]", [newTask]) // Add the new task
        .commit();

      console.log("Task added successfully:", updatedProject);
      setTaskTitle("");
      setTaskDescription("");
      setPriority("");
      setAssignedTo("");
      setDueDate("");
    } catch (error) {
      console.error("Error adding task:", error.message);
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    try {
      const projectDoc = await sanityClient.fetch(
        `
        *[_type == "project" && _id == $projectId][0] {
          _id,
          tasks
        }
      `,
        { projectId }
      );

      if (!projectDoc) {
        throw new Error(`Project with ID ${projectId} not found`);
      }

      const taskToUpdate = projectDoc.tasks.find(
        (task) => task.taskId === taskId
      );

      if (!taskToUpdate) {
        throw new Error(
          `Task with taskId ${taskId} not found within the project`
        );
      }

      const newStatus = currentStatus === "pending" ? "completed" : "pending";

      await sanityClient
        .patch(projectDoc._id)
        .set({
          [`tasks[_key == "${taskToUpdate._key}"].status`]: newStatus,
        })
        .commit();

      console.log(`Task with taskId ${taskId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  if (loading || !project) {
    return (
      <div className="">
       <div className="flex items-center justify-center h-screen">
        <LottieAnimation/>
       </div>
      </div>
    );
  }

  const pendingTasks =
    project.tasks?.filter((task) => task.status === "pending") || [];
  const completedTasks =
    project.tasks?.filter((task) => task.status === "completed") || [];

  return (
    <div className="ml-[110px] mt-5">
      <div className="flex items-center justify-between px-8">
        <div className="flex gap-[40px] items-center">
          <div>
            <h1 className="text-2xl font-bold mb-4">{project.projectName}</h1>
            <p className="text-gray-600 mb-6">{project.projectDescription}</p>
          </div>
          <div className="bg-[#7f8ac6] py-2 px-4 text-white flex gap-2 cursor-pointer" onClick={()=>{router.push(`/dashboard/${projectId}`)}}>
            <p>
            Dashborad
            </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                />
              </svg>
            
          </div>
        </div>
        <div>
          <button
            className="bg-[#7f8ac6] py-2 px-4 text-white"
            onClick={() => setShowDialog(true)} // Open dialog on button click
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Dialog box */}
      {showDialog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-end">
          <div className="bg-white p-6 w-96 h-full shadow-lg relative">
            <button
              className="absolute top-5 right-4 "
              onClick={() => setShowDialog(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-4">Add Task</h2>
            <div>
              <label className="block mb-2">Task Title</label>
              <input
                type="text"
                className="border p-2 w-full mb-4"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              <label className="block mb-2">Task Description</label>
              <textarea
                className="border p-2 w-full mb-4"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
              <label className="block mb-2">Priority</label>
              <select
                className="border p-2 w-full mb-4"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <label className="block mb-2">Assign To</label>
              <select
                className="border p-2 w-full mb-4"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="" disabled>
                  Select a member
                </option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>

              <label className="block mb-2">Due Date</label>
              <input
                type="datetime-local"
                className="border p-2 w-full mb-4"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <button
                className="bg-[#7f8ac6] text-white py-2 px-4"
                onClick={handleAddTask}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-3">All Tasks</h2>
          <ul className="space-y-4 overflow-y-scroll overflow-x-hidden h-[600px] bg-gray-100 px-2 py-2">
            {project.tasks?.map((task, index) => (
              <li key={index} className="border p-4 rounded-md bg-white">
                <h3 className="font-medium text-lg">{task.taskTitle}</h3>
                <p className="text-gray-500 mt-2">{task.taskDescription}</p>
                <p className="text-gray-500 mt-2">{task.priority}</p>
                <p
                  className="text-sm mt-2 cursor-pointer"
                  onClick={() => toggleTaskStatus(task.taskId, task.status)}
                >
                  <span className="font-semibold">Status:</span>
                  <span
                    className={`px-3 ml-2 py-1 text-white rounded-sm ${
                      task.status === "pending"
                        ? "bg-[#d79497]"
                        : "bg-[#95e0dc]"
                    }`}
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
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1">
          <Pending tasks={pendingTasks} toggleTaskStatus={toggleTaskStatus} />
        </div>
        <div className="flex-1">
          <Completed
            tasks={completedTasks}
            toggleTaskStatus={toggleTaskStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
