"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { sanityClient } from "../../../sanity"; // Adjust this to your Sanity client configuration
import Pending from "./components/Pending";
import Completed from "./components/Completed";

const UserDetails = () => {
  const params = useParams();
  const projectId = params.id;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the project data based on the project ID
    const fetchProject = async () => {
      console.log("Fetching project with ID:", projectId);

      try {
        const query = `
          *[_type == "project" && _id == "${projectId}"] {
            projectName,
            projectDescription,
            tasks[] {
              taskTitle,
              taskDescription,
              status,
              dueDate,
              assignedTo-> { name, email }
            }
          }
        `;
        const data = await sanityClient.fetch(query, { projectId });
        console.log("Project data:", JSON.stringify(data, null, 2));

        // Ensure we handle array response properly
        setProject(data.length > 0 ? data[0] : null);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // Use a loading placeholder for consistent SSR
  if (loading || !project) {
    return (
      <div className="ml-[110px]">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  // Filter tasks based on status
  const pendingTasks = project.tasks?.filter((task) => task.status === "pending") || [];
  const completedTasks = project.tasks?.filter((task) => task.status === "completed") || [];

  return (
    <div className="ml-[110px]">
      <h1 className="text-2xl font-bold mb-4">{project.projectName}</h1>
      <p className="text-gray-600 mb-6">{project.projectDescription}</p>
      <div className="flex gap-2">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-3">All Tasks</h2>
          <ul className="space-y-4 overflow-scroll">
            {project.tasks?.map((task, index) => (
              <li key={index} className="border p-4 rounded-md">
                <h3 className="font-medium text-lg">{task.taskTitle}</h3>
                <p className="text-gray-500 mt-2">{task.taskDescription}</p>
                <p className="text-sm mt-2">
                  <span className="font-semibold">Status:</span>
                  <span
                    className={`px-3 ml-2 py-1 text-white rounded-sm ${
                      task.status === "pending"
                        ? "bg-[#ff2732]"
                        : "bg-green-500"
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
          <Pending tasks={pendingTasks} />
        </div>
        <div className="flex-1">
          <Completed tasks={completedTasks} />
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
