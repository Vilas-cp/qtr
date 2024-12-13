import React, { useState, useEffect } from "react";
import { useReactFlow } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { sanityClient } from "../../../sanity"; 

const Dropdowntest = () => {
  const { setNodes } = useReactFlow();
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState([]); 

  // Fetch tasks from Sanity
  useEffect(() => {
    const fetchTasks = async () => {
      try {
     
        const tasks = await sanityClient.fetch('*[_type == "task"]');
        
   
        const taskOptions = tasks.map(task => ({
          code: task._id, 
          name: task.title, 
        }));

        setOptions(taskOptions); // Set the options state
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const onProviderClick = ({ name, code }) => {
    setNodes((prevNodes) => [
      ...prevNodes,
      {
        id: uuidv4(),
        data: { name, code },
        type: "databaseoptions",
        position: { x: 0, y: 100 },
      },
    ]);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        Add Task ▼
      </button>
      {isOpen && (
        <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md">
          {options.map((provider) => (
            <li
              key={provider.code}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => onProviderClick(provider)}
            >
              {provider.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdowntest;
