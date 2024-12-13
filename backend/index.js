const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();  // Ensure .env is loaded

const app = express();

// Initialize CORS and bodyParser middleware
app.use(cors());  // Allow all domains (you can modify this to restrict to specific domains)
app.use(bodyParser.json());  

// Initialize Google Generative AI client with API Key from environment variables
const geminiApiKey = process.env.GEMINI_API_KEY;  // Load from .env file
const googleAI = new GoogleGenerativeAI(geminiApiKey);
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-1.5-flash",  // Ensure this is the correct model
});

// Endpoint to handle POST request for getting day status
app.post('/api/getDayStatus', async (req, res) => {
  const data = req.body;  // The input data from the frontend (could be a list of nodes)

  // Log the incoming request data for debugging
  console.log("Received request data:", data);

  // 1. Data Preparation (converting the received data into a format expected by the Gemini API)
  const geminiInput = data.map(item => {
    return `Source Node: ${item.sourceNodeData.name} (${item.sourceNodeData.code})\n` +
           `Target Node: ${item.targetNodeData.name} (${item.targetNodeData.code})\n`;
  }).join('\n\n');  // Joining the data into a single string

  // 2. Call Gemini API using async/await (making the actual request)
  try {
    // Use the geminiModel's generateContent method to send the input to the Gemini model
    const result = await geminiModel.generateContent(geminiInput);
    
    // Log the API response for debugging
    console.log("Gemini API response:", result);

    // Assuming result.response contains the AI's response
    const aiResponse = result.response.text();  // Adjust this according to the response format

    
    res.json({ aiResponse });
  } catch (error) {
   
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Internal server error' }); // Respond with an error message
  }
});

// Start the Express server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
