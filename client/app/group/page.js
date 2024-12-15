"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { sanityClient } from "../../sanity";
import { v4 as uuidv4 } from "uuid"; 
import MyProjects from "./components/Oldprojects";

const UserInfo = () => {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    projectName: "",
    projectDescription: "",
    dueDate: "",
    members: [], 
  });
  const [showForm, setShowForm] = useState(false);
  const [allUsers, setAllUsers] = useState([]); 

 
  const fetchProjects = async () => {
    try {
    
      const data = await sanityClient.fetch(`
        *[_type == "project"]{
          _id, 
          projectName, 
          projectDescription, 
          dueDate, 
          createdAt, 
          members[]->{
            _id,
            name,
            email
          }
        }
      `);

      
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  
  const fetchUsers = async () => {
    try {
      const users = await sanityClient.fetch(
        '*[_type == "user"]{_id, name, email, role, profilePicture}'
      ); 
      setAllUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };


  useEffect(() => {
    if (isSignedIn) {
      fetchProjects();
      fetchUsers();
    }
  }, [isSignedIn]);

  const handleNavigation = (userId) => {
    router.push(`/group/${userId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the new project data to send to Sanity
    const newProjectData = {
      _type: "project",
      projectName: newProject.projectName,
      projectDescription: newProject.projectDescription,
      dueDate: newProject.dueDate,
      createdAt: new Date().toISOString(),
      // Map the selected members to reference objects with unique _keys
      members: newProject.members.map((userId) => ({
        _type: "reference",
        _ref: userId,
        _key: uuidv4(), // Assign a unique key to each member
      })),
    };

    try {
      // Create a new project in Sanity
      await sanityClient.create(newProjectData);
      setProjects([...projects, newProjectData]);
      setNewProject({
        projectName: "",
        projectDescription: "",
        dueDate: "",
        members: [], // Clear the members after adding the project
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding new project:", error);
    }
  };
  if (!isSignedIn) {
    return (
      <div className="ml-[110px]">
        <div className="flex items-center justify-center h-screen">
        
        </div>
     
        </div>
    );
  }

  return (
    <div className="ml-[110px]">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.firstName}!</h2>
      <p className="text-sm text-gray-600 mb-4">
        Email: {user.primaryEmailAddress?.emailAddress}
      </p>

      <button
        onClick={() => setShowForm((prev) => !prev)}
        className="bg-[#7f8ac6] text-white p-3 rounded-md mt-6 shadow transition duration-200"
      >
        {showForm ? "Close Form" : "Add New Project"}
      </button>
      {/* Display Projects */}
      <div className="flex gap-8">
      <div className="flex-1">
      <h3 className="text-xl font-semibold mt-8">Projects</h3>
      <ul className="space-y-4 mt-4">
        {projects.map((project) => (
          <li
            key={project._id}
            className="border border-gray-300 p-4 rounded-md hover:bg-gray-50 transition duration-200 cursor-pointer"
            onClick={() => handleNavigation(project._id)}
          >
            <h4 className="font-semibold text-lg">{project.projectName}</h4>
            <p className="text-sm text-gray-500 mt-2">
              {project.projectDescription}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Due Date: {new Date(project.dueDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Members:{" "}
              {project.members?.map((member) => `${member.name}`).join(", ")}
            </p>
          </li>
        ))}
      </ul>
      </div>
      <div className="mt-8 flex-1 px-[10px]">
        <MyProjects/>
      </div>
      </div>
      {/* Toggle Button for Form */}

      {/* Sidebar Form (Right Slide) */}
      {showForm && (
        <div
          className={`fixed top-0 right-0 w-[500px] h-full bg-white shadow-lg z-50 transform transition-all duration-800 ease-in-out ${
            showForm ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="w-full flex items-end justify-end pr-6">
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className=" text-white bg-black p-3 rounded-[9999px] mt-6 shadow transition duration-200"
            >
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
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6 font-medium">
            <div>
              <label className="block text-sm font-medium">Project Name</label>
              <input
                type="text"
                value={newProject.projectName}
                onChange={(e) =>
                  setNewProject({ ...newProject, projectName: e.target.value })
                }
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Project Description
              </label>
              <textarea
                value={newProject.projectDescription}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    projectDescription: e.target.value,
                  })
                }
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Due Date</label>
              <input
                type="datetime-local"
                value={newProject.dueDate}
                onChange={(e) =>
                  setNewProject({ ...newProject, dueDate: e.target.value })
                }
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Project Members
              </label>
              <div className="space-y-2">
                {/* Display selected users as tags */}
                <div className="flex flex-wrap gap-2">
                  {newProject.members.map((memberId) => {
                    const member = allUsers.find(
                      (user) => user._id === memberId
                    );
                    return (
                      member && (
                        <span
                          key={member._id}
                          className="flex items-center bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm"
                        >
                          {member.name} ({member.email})
                          <button
                            type="button"
                            onClick={() =>
                              setNewProject((prevState) => ({
                                ...prevState,
                                members: prevState.members.filter(
                                  (id) => id !== member._id
                                ),
                              }))
                            }
                            className="ml-2 text-red-600"
                          >
                            &times;
                          </button>
                        </span>
                      )
                    );
                  })}
                </div>

                {/* Select dropdown */}
                <select
                  multiple
                  value={newProject.members}
                  onChange={(e) => {
                    const selectedMembers = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );

                    setNewProject((prevState) => {
                      const newMembers = [
                        ...new Set([...prevState.members, ...selectedMembers]), // Merging the arrays and removing duplicates
                      ];
                      return {
                        ...prevState,
                        members: newMembers,
                      };
                    });
                  }}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {allUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-[#7f8ac6] text-white p-3 rounded-md transition duration-200"
              >
                Add Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
