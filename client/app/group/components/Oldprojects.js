import { useUser } from "@clerk/nextjs"; 
import { useState, useEffect } from "react";
import { sanityClient } from "../../../sanity"; 
import { useRouter } from "next/navigation";
const MyProjects = () => {
  const { user } = useUser(); // Get user from Clerk
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
        project.members.forEach((member) => {
          console.log(member.email); 
        });
  
        console.log("User email:", userEmail); 
  
    
        const isMember = project.members.some((member) => member.email === userEmail);
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
      <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
      
      {projects.length === 0 ? (
        <p className="text-sm text-gray-600">No projects assigned to you yet.</p>
      ) : (
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
      )}
    </div>
  );
};

export default MyProjects;
