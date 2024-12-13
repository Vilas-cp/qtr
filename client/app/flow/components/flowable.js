"use client";
import React, { useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import Dropdowntest from "./dropdowntest";
import { initialEdges, initialNodes } from "./Workflow.constant";
import { v4 as uuidv4 } from "uuid";
import Databaseoptions from "./databaseoptions";

const nodeTypes = {
  dropdowntest: Dropdowntest,
  databaseoptions: Databaseoptions,
};

const Flowable = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((connection) => {
    const edge = {
      ...connection,
      animated: true,
      id: uuidv4(),
    };
    setEdges((prevEdges) => addEdge(edge, prevEdges));
  }, []);

  const handleInputChange = (id, value) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, inputValue: value } } : node
      )
    );
  };

  const getDatabaseConnections = () => {
    const databaseConnections = edges
      .filter((edge) => {
        const targetNode = nodes.find((node) => node.id === edge.target);
        return targetNode?.type === "databaseoptions"; // Filter for "databaseoptions" node type
      })
      .map((edge) => ({
        targetNodeId: edge.target,
        sourceNodeId: edge.source,
        targetNodeData: nodes.find((node) => node.id === edge.target)?.data,
        sourceNodeData: nodes.find((node) => node.id === edge.source)?.data,
      }));

    console.log(JSON.stringify(databaseConnections, null, 2));
    return databaseConnections;
  };

  const fetchDailyReport = async () => {
    const connections = getDatabaseConnections();
    const prompt = "Analyze these node connections and provide insights and say how good is my day planned";
  
    try {
      const response = await fetch("http://localhost:5001/api/getDayStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: connections, prompt }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Daily Report Response:", data);
    } catch (error) {
      console.error("Error fetching daily report:", error);
    }
  };
  

  return (
    <div style={{ width: "100%", height: "80vh", paddingTop: "0px" }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              onInputChange: handleInputChange,
            },
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          onConnect={onConnect}
          nodeTypes={nodeTypes}
        >
          <Background color="#aaa" gap={16} />
          <Controls />
        </ReactFlow>
        <button
          onClick={fetchDailyReport} // Call the fetchDailyReport function
          style={{
            position: "absolute",
            bottom: 20,
            left: 150,
            padding: "10px 20px",
            background: "#5e5eff",
            color: "#fff",
            borderRadius: "4px",
            border: "none",
          }}
        >
          Get Daily Report
        </button>
      </ReactFlowProvider>
    </div>
  );
};

export default Flowable;
