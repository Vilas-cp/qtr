"use client";
import React, { useState, useCallback, useEffect } from "react";
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (report) {
     
      console.log("Full Report Data:", report); 
      console.log(typeof report); 
      console.log("Good Day Meter:", report?.insights?.goodDayMeter);
    }
  }, [report]);

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
        node.id === id
          ? { ...node, data: { ...node.data, inputValue: value } }
          : node
      )
    );
  };

  const getDatabaseConnections = () => {
    const databaseConnections = edges
      .filter((edge) => {
        const targetNode = nodes.find((node) => node.id === edge.target);
        return targetNode?.type === "databaseoptions";
      })
      .map((edge) => ({
        targetNodeId: edge.target,
        sourceNodeId: edge.source,
        targetNodeData: nodes.find((node) => node.id === edge.target)?.data,
        sourceNodeData: nodes.find((node) => node.id === edge.source)?.data,
      }));

    return databaseConnections;
  };

  const fetchDailyReport = async () => {
    const connections = getDatabaseConnections();
    const prompt = `Generate a daily workflow analysis {
      "insights": {
        "dayExplained": [
          {
            "activity": "",
            "description": "",
            "relatedActivities": [
              "",
              ""
            ]
          }
        ],
        "suggestions": [
          "", "", "", ""
        ],
        "goodDayMeter": 0
      }
    } give me in this format Do not wrap the json codes in JSON markers`;

    setLoading(true); // Set loading to true when starting the fetch

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

      const data = await response.text();
      console.log("Raw AI Response:", data);

      let cleanedData = cleanJsonString(data);
      let parsedData = JSON.parse(cleanedData);

      if (parsedData.aiResponse) {
        parsedData = parsedData.aiResponse;
      }

      console.log("Parsed Data:", ); 

      setReport(JSON.parse(parsedData)); 
      setDialogOpen(true);
    } catch (error) {
      console.error("Error fetching daily report:", error);
      alert("Failed to fetch the report. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  const cleanJsonString = (jsonString) => {
    const pattern = /^```json\s*(.*?)\s*```$/s;
    const cleanedString = jsonString.replace(pattern, "$1");
    return cleanedString.trim();
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
          onClick={fetchDailyReport}
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
          {loading ? "Loading..." : "Get Daily Report"}
        </button>
      </ReactFlowProvider>

      {/* Dialog */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: dialogOpen ? 0 : "-400px",
          width: "600px",
          height: "100%",
          backgroundColor: "#f5f5f5",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          transition: "right 0.3s ease-in-out",
          zIndex: 1000,
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <h2 className="font-medium" style={{ marginBottom: "20px", color: "#333" }}>
          Daily Report
        </h2>
        {/* Render Day Explained */}
        <h3>Day Explained</h3>
        {report?.insights?.dayExplained?.length > 0 ? (
          report.insights.dayExplained.map((activity, index) => (
            <div key={index}>
              <h4>{activity.activity}</h4>
              <p>{activity.description}</p>
              <strong>Related Activities:</strong>
              <ul>
                {activity.relatedActivities?.length > 0 ? (
                  activity.relatedActivities.map((related, idx) => (
                    <li key={idx}>{related}</li>
                  ))
                ) : (
                  <li>No related activities available.</li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p>No activities explained for the day.</p>
        )}

        {/* Render Suggestions */}
        <h3>Suggestions</h3>
        {report?.insights?.suggestions?.length > 0 ? (
          <ul>
            {report.insights.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        ) : (
          <p>No suggestions available.</p>
        )}

        {/* Render Good Day Meter */}
        <h3>Good Day Meter: {report?.insights?.goodDayMeter ?? 0}%</h3>

        {/* Close Button */}
        <button
          onClick={() => {
            setDialogOpen(false);
            setReport(null); // Clear the report when closing the dialog
          }}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            color: "#888",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default Flowable;
