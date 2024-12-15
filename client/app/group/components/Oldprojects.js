import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { sanityClient } from "../../../sanity";
import { useRouter } from "next/navigation";
const MyProjects = () => {
  const { user } = useUser(); 
  const router = useRouter();
  const [projects, setProjects] = useState([]);

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const handleNavigation = (userId) => {
    router.push(`/group/${userId}`);
  };

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
  
      console.log(data);
  
      const filteredProjects = data.filter((project) => {
        console.log("All member emails for project:", project.projectName);
        console.log("User email:", userEmail);
  
       
        const isMember = project.members?.some(
          (member) => member?.email === userEmail
        );
  
        console.log("Is user a member:", isMember);
  
        return isMember;
      });
  
      setProjects(filteredProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  

  useEffect(() => {
    if (userEmail) {
      fetchProjects();
      console.log("User email:", userEmail);
    }
  }, [userEmail]);

  if (!userEmail) {
    return <div>Please sign in to view your projects.</div>;
  }

  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-4 flex gap-2 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M19.5 21a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-5.379a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Zm-6.75-10.5a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V10.5Z"
            clipRule="evenodd"
          />
        </svg>

        <span> My Projects</span>
      </h2>

      {projects.length === 0 ? (
        <p className="text-sm text-gray-600">
          No projects assigned to you yet.
        </p>
      ) : (
        <ul className="space-y-4 mt-4 overflow-x-hidden overflow-y-scroll h-[600px]">
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
              <div>
              <div
                className="bg-[#7f8ac6] py-[1px] px-2 text-white w-[70px] flex items-center gap-1 mt-5 cursor-pointer rounded-sm"
          // Open dialog on click
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyProjects;
