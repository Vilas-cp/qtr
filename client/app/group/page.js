"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect,useRef } from "react";
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
  

  const isUserChecked = useRef(false);  // useRef does not trigger re-renders
  

  const userExistsInSanity = async (email) => {
    console.log("Checking if user exists in Sanity:", email);
    
    const query = `*[_type == "user" && email == "${email}"][0]`;
    const params = { email }; 
    
    const existingUser = await sanityClient.fetch(query, params);
    return existingUser; 
  };


  const addUserToSanity = async () => {
    if (user && !isUserChecked.current) {
      try {
        isUserChecked.current = true; // Prevent re-checking
        
        const existingUser = await userExistsInSanity(user.primaryEmailAddress?.emailAddress);

        if (existingUser) {
          console.log('User already exists in Sanity:', existingUser);
          return;  
        }

        // Create user document in Sanity
        const result = await sanityClient.create({
          _type: 'user', // Ensure this matches your schema type in Sanity
          name: user.fullName, // Clerk's user object provides fullName
          email: user.primaryEmailAddress?.emailAddress, // Clerk's user object provides email
          role: 'member',  // You can modify the role based on your requirement
          joinedAt: new Date().toISOString(), // Current date and time
        });

        console.log('User added to Sanity:', result);
      } catch (error) {
        console.error('Error adding user to Sanity:', error);
      }
    }
  };

  // Call addUserToSanity when the component loads
  useEffect(() => {
    if (user) {
      addUserToSanity();
    }
  }, [user]);
  // Fetch projects from Sanity
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

  // Fetch users from Sanity
  const fetchUsers = async () => {
    try {
      const users = await sanityClient.fetch(`
        *[_type == "user"]{_id, name, email, role}
      `);
      setAllUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch data on mount if the user is signed in
  useEffect(() => {
    if (isSignedIn) {
      fetchProjects();
      fetchUsers();
    }
  }, [isSignedIn,isUserChecked.current]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !newProject.projectName ||
      !newProject.projectDescription ||
      !newProject.dueDate ||
      !newProject.members.length
    ) {
      alert("Please fill out all fields and add at least one member.");
      return;
    }

    const newProjectData = {
      _type: "project",
      projectName: newProject.projectName,
      projectDescription: newProject.projectDescription,
      dueDate: newProject.dueDate,
      createdAt: new Date().toISOString(),
      members: newProject.members.map((userId) => ({
        _type: "reference",
        _ref: userId,
        _key: uuidv4(),
      })),
    };

    try {
      await sanityClient.create(newProjectData);
      setProjects([...projects, newProjectData]);
      setNewProject({
        projectName: "",
        projectDescription: "",
        dueDate: "",
        members: [],
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding new project:", error);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="ml-[110px] flex items-center justify-center h-screen">
        <p>Please sign in to view this page.</p>
      </div>
    );
  }
  



  return (
    <div className="ml-[110px]">
      <div className="flex items-center justify-between mt-5">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Welcome, {user.firstName}!
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Email: {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-[#7f8ac6] text-white p-3 rounded-md mt-6 shadow mr-8"
        >
          {showForm ? "Close Form" : "Add New Project"}
        </button>
      </div>

      {/* Display Projects */}
      <div className="flex gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4 flex gap-2 items-center mt-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M15.75 8.25a.75.75 0 0 1 .75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 1 1-.992-1.124A2.243 2.243 0 0 0 15 9a.75.75 0 0 1 .75-.75Z" />
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.575 15.6a8.25 8.25 0 0 0 9.348 4.425 1.966 1.966 0 0 0-1.84-1.275.983.983 0 0 1-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 0 1 2.328-.377L16.5 15h.628a2.25 2.25 0 0 1 1.983 1.186 8.25 8.25 0 0 0-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.575 15.6Z"
                clipRule="evenodd"
              />
            </svg>

            <span> Projects</span>
          </h2>
          <ul className="space-y-4 mt-4 h-[600px] overflow-x-hidden overflow-y-scroll">
            {projects.map((project) => (
              <li
                key={project._id}
                className="border border-gray-300 p-4 rounded-md hover:bg-gray-50 transition duration-200 cursor-pointer"
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
                  {project.members
                    ?.filter((member) => member) // Filter out null/undefined members
                    .map((member) => member.name || "Unknown Member")
                    .join(", ")}
                </p>
               
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 flex-1 px-[10px]">
          <MyProjects />
        </div>
      </div>

      {/* Add Project Form */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-30" />
          <div className="fixed top-0 right-0 w-[500px] h-full bg-white shadow-lg z-50 transform transition-transform duration-700 overflow-y-scroll">
            <div className="w-full flex justify-end p-6">
              <button
                onClick={() => setShowForm(false)}
                className="text-black "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-10"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6 font-medium">
              <div>
                <label className="block text-sm font-medium">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProject.projectName}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      projectName: e.target.value,
                    })
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
                          ...new Set([
                            ...prevState.members,
                            ...selectedMembers,
                          ]), // Merging the arrays and removing duplicates
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
                  className="bg-[#7f8ac6] text-white p-3 rounded-md"
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default UserInfo;
