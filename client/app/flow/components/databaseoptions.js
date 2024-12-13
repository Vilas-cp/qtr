import React, { useState, useEffect } from "react";
import { Handle, Position, useReactFlow } from "reactflow";

export default function Databaseoptions({
  data: { name, code, description = "No description available", inputValue = "" }, // Default description
  id,
  onInputChange,
}) {
  const { setNodes } = useReactFlow();
  const [localInputValue, setLocalInputValue] = useState(inputValue);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setLocalInputValue(value); // Update local state
    onInputChange(id, value); // Pass input value back to parent
  };

  useEffect(() => {
    // Ensure component stays in sync with parent state
    setLocalInputValue(inputValue || ""); // Ensure it's a non-undefined value
  }, [inputValue]);

  return (
    <div className="flex flex-col items-start bg-purple-400 p-3 rounded-2xl gap-2 w-[400px]">
      <div className="flex justify-between items-center w-full">
        <div>
          <p className="text-sm font-bold text-black">{name}</p>
          <p className="text-xs text-gray-800 mt-1">Description: {description}</p>
        </div>
        <button
          aria-label="Delete Task Node"
          className="text-red-500 bg-transparent hover:text-red-700 focus:outline-none"
          onClick={() =>
            setNodes((prevNodes) =>
              prevNodes.filter((node) => node.id !== id)
            )
          }
        >
          ✖
        </button>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 bg-blue-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 bg-red-500"
      />
    </div>
  );
}
