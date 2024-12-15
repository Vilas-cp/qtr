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
import { jsPDF } from "jspdf";

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
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

   
    const dialogContent = document.getElementById("dialog-content");

    doc.html(dialogContent, {
      callback: function (doc) {
        doc.save("daily_report.pdf");
      },
      scale: 0.8, 
      margin: [10, 10, 10, 10],
      x: 10,
      y: 10,
      width: 200,
      windowWidth: 900,
      autoPaging: true,
    });
    
  };

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
            ],
             "probableRequiredTime": "",
             "NumberofPomodoroCycles": "",
          }
        ],
        "suggestions": [
          "", "", "", ""
        ],
        "goodDayMeter": 0,
        "stressLevel": 0,
         "learningProgress": 0 ,
      }
    } give me in this format Do not wrap the json codes in JSON markers`;

    setLoading(true); // Set loading to true when starting the fetch

    try {
      const response = await fetch("https://qtrbackend-production.up.railway.app/api/getDayStatus", {
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

      console.log("Parsed Data:");

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
        id="dialog-content"
        style={{
          position: "fixed",
          top: 0,
          right: dialogOpen ? 0 : "-800px",
          width: "800px",
          height: "100%",
          backgroundColor: "#f5f5f5",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          transition: "right 0.3s ease-in-out",
          zIndex: 1000,
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <div className="p-6">
          <h2 className="font-medium text-2xl mb-6 text-gray-800">
            Daily Report
          </h2>

          {/* Day Explained Section */}
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-700">
              Day Explained
            </h3>
            {report?.insights?.dayExplained?.length > 0 ? (
              report.insights.dayExplained.map((activity, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow-sm">
                  <h4 className="text-lg font-bold text-gray-800">
                    {activity.activity}
                  </h4>
                  <p className="text-gray-600">{activity.description}</p>
                  <p className="mt-2">
                    <strong>Probable Required Time:</strong>{" "}
                    {activity.probableRequiredTime}
                  </p>
                  <p className="mt-2">
                    <strong>Number of Pomodoro Cycles:</strong>{" "}
                    {activity.NumberofPomodoroCycles}
                  </p>

                  <strong className="mt-2 block text-gray-800">
                    Related Activities:
                  </strong>
                  <ul className="list-disc pl-5 mt-2 flex gap-4">
                    {activity.relatedActivities?.length > 0 ? (
                      activity.relatedActivities.map((related, idx) => (
                        <div
                          key={idx}
                          className="text-white bg-black w-[150px] p-2 text-center rounded font-semibold text-sm"
                        >
                          {related}
                        </div>
                      ))
                    ) : (
                      <li className="text-gray-500">
                        No related activities available.
                      </li>
                    )}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No activities explained for the day.
              </p>
            )}
          </div>

          {/* Suggestions Section */}
          <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700">Suggestions</h3>
            {report?.insights?.suggestions?.length > 0 ? (
              <ul className="list-disc pl-5 mt-2 text-gray-600">
                {report.insights.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No suggestions available.</p>
            )}
          </div>

          {/* Good Day Meter Section */}
          <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700">
              Good Day Meter
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div
                className={`h-full rounded-full ${
                  report?.insights?.goodDayMeter ?? 0 >= 75
                    ? "bg-green-500"
                    : report?.insights?.goodDayMeter ?? 0 >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${report?.insights?.goodDayMeter ?? 0}%` }}
              ></div>
            </div>
            <p className="mt-2 text-gray-600">
              {report?.insights?.goodDayMeter ?? 0}%
            </p>
          </div>

          {/* Stress Level Section */}
          <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700">
              Stress Level
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div
                className={`h-full rounded-full ${
                  report?.insights?.stressLevel ?? 0 >= 75
                    ? "bg-red-500"
                    : report?.insights?.stressLevel ?? 0 >= 50
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${report?.insights?.stressLevel ?? 0}%` }}
              ></div>
            </div>
            <p className="mt-2 text-gray-600">
              {report?.insights?.stressLevel ?? 0}%
            </p>
          </div>

          {/* Learning Progress Section */}
          <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700">
              Learning Progress
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div
                className={`h-full rounded-full ${
                  report?.insights?.learningProgress ?? 0 >= 75
                    ? "bg-blue-500"
                    : report?.insights?.learningProgress ?? 0 >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${report?.insights?.learningProgress ?? 0}%` }}
              ></div>
            </div>
            <p className="mt-2 text-gray-600">
              {report?.insights?.learningProgress ?? 0}%
            </p>
            <button
            onClick={handleDownloadPDF}
            style={{
              position: "absolute",
              top: 60,
              right: 20,
              padding: "10px 20px",
              background: "#5e5eff",
              color: "#fff",
              borderRadius: "4px",
              border: "none",
            }}
          >
            Download PDF
          </button>
          </div>
        
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setDialogOpen(false);
            setReport(null); 
            window.location.reload();
            
          }}
          style={{
            position: "absolute",
            top: "10px",
            right: "30px",
            background: "transparent",
            border: "none",
            color: "#888",
            fontSize: "30px",
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
