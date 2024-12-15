"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { sanityClient } from "../../../sanity"; 
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
  });
  

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await sanityClient.fetch(
          `*[_type == "project" && _id == "${id}"][0]{
            projectName,
            projectDescription,
            tasks[]{
              status
            }
          }`
        );

        if (projectData) {
          setProject(projectData);

          const totalTasks = projectData.tasks?.length || 0;
          const pendingTasks = projectData.tasks?.filter((task) => task.status === "pending").length || 0;
          const completedTasks = projectData.tasks?.filter((task) => task.status === "completed").length || 0;

          setTaskStats({ totalTasks, pendingTasks, completedTasks });
        } else {
          setError("Project not found.");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to fetch project data.");
      }
    };

    fetchProject();
  }, [id]);

  if (error) {
    return <div className="ml-[110px] text-red-500">{error}</div>;
  }

  if (!project) {
    return <div className="ml-[110px]">Loading...</div>;
  }

  return (
    <div className="ml-[100px] p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-2">{project.projectName}</h1>
        <p className="text-gray-700 mb-4">{project.projectDescription}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-500 text-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold">Total Tasks</h2>
          <p className="text-4xl font-semibold mt-2">{taskStats.totalTasks}</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold">Pending Tasks</h2>
          <p className="text-4xl font-semibold mt-2">{taskStats.pendingTasks}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold">Completed Tasks</h2>
          <p className="text-4xl font-semibold mt-2">{taskStats.completedTasks}</p>
        </div>
      </div>

      <div className="mt-8">
        <button
          className="bg-[#7f8ac6] text-white px-6 py-3 rounded shadow-md hover:bg-[#6e7bb3] transition"
          onClick={() => router.push(`/group/${id}`)}
        >
          Go to Project Page
        </button>
      </div>
    </div>
  );
};

export default Page;

