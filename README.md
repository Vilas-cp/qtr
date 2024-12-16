# Productivity Tracker Web App

## Description

The **Productivity Tracker Web App** is a comprehensive web application designed to help users track their productivity and collaborate effectively on projects. This app includes multiple features like:

- **Group Project Control**: Allows teams to manage and track progress on projects.
- **Pomodoro Timer**: A built-in timer to implement the Pomodoro technique for focused work and breaks.
- **Interactive Flow Chart UI**: Visualize the flow of tasks and projects using dynamic and interactive flow charts.
- **AI Suggestions**: Receive personalized AI-driven suggestions for optimizing productivity and workflow.
- **Collaboration**: Multiple users can collaborate on the same project, making it a perfect tool for team-based productivity.

The app is divided into three main components:
1. **Client**: Frontend built with **Next.js** for a fast and responsive user experience.
2. **Server**: Backend using **Sanity** for content management and storage.
3. **Backend**: Node.js server for handling requests, including integrations with AI APIs.

### Live Demo

Check out the live version of the app:

[Productivity Tracker - Live Demo](https://vercel.com/vilas-cps-projects/qtr)

## Features
- **Group Project Management**: Organize projects, assign tasks, and track the progress of tasks.
- **Pomodoro Timer**: Allows you to focus on tasks using Pomodoro cycles, with notifications when time is up.
- **Interactive Flowchart UI**: Dynamic flowchart to visualize project tasks, dependencies, and progress.
- **AI Productivity Suggestions**: Receive daily AI-generated suggestions to improve work habits.
- **Collaborative Features**: Team members can collaborate in real-time, share task status, and communicate through comments.

## Technologies Used
- **Frontend**: React.js, Next.js
- **Backend**: Node.js, Express.js
- **CMS**: Sanity.io
- **AI Integration**: Google Generative AI
- **Database**: Sanity (for content storage and management)
- **Hosting**: Vercel (Frontend), Railway (Backend)

## How to Run Locally

To run this project locally, you need to set up three components: **Client**, **Server**, and **Backend**. Follow these steps to get the app running on your local machine.

### 1. Clone the Repository
First, clone the repository to your local machine. If you don't have the repository, use the following command:

```bash
git clone https://github.com/Vilas-cp/qtr.git
cd productivity-tracker
2. Set Up Environment Variables
Before running the project, you need to set up the environment variables. These variables help configure your project for different environments (development, production, etc.).

Client (Frontend - Next.js):
In the client folder, create a .env.local file and add the following:

bash
Copy code
NEXT_PUBLIC_API_URL=http://localhost:5001/api
This will point the frontend to your local backend server.

Backend (Node.js):
In the backend folder, create a .env file with the following configuration:

bash
Copy code
GEMINI_API_KEY=your_google_api_key_here
SANITY_PROJECT_ID=your_sanity_project_id_here
SANITY_DATASET=your_sanity_dataset_here
PORT=5001
Replace the placeholders with your actual API keys and other credentials.

3. Install Dependencies
Next, install the dependencies required for each folder (Client, Server, and Backend).

Client (Frontend - Next.js):
Navigate to the client folder and install the required dependencies:

bash
Copy code
cd client
npm install
Backend (Node.js):
Navigate to the backend folder and install the necessary packages:

bash
Copy code
cd backend
npm install
Server (Sanity):
If you are using Sanity as your CMS, navigate to the server folder and install Sanity-specific packages:

bash
Copy code
cd server
sanity install
4. Start the Development Servers
Now that you have installed the necessary dependencies, you can start the Client and Backend servers.

Start the Frontend (Next.js):
Navigate to the client folder and run the development server:

bash
Copy code
cd client
npm run dev
This will start the frontend server on http://localhost:3000.

Start the Backend (Node.js):
Navigate to the backend folder and run the backend server:

bash
Copy code
cd backend
npm start
This will start the backend server on http://localhost:5001.

Sanity (Content Management Server):
If you are using Sanity for content management, follow the instructions in Sanity's documentation to start the Sanity Studio locally.

5. Access the Application
Once both the Client and Backend are running, open your browser and navigate to the following URLs to access the application:

Frontend: http://localhost:3000
Backend: http://localhost:5001 (Optional for direct API testing)
6. API Endpoints
POST /api/getDayStatus
This API endpoint accepts a POST request to generate a daily workflow analysis based on the given data and prompt.

Request Body Example:

json
Copy code
{
  "data": [
    {
      "sourceNodeData": { "name": "Task 1", "code": "T1" },
      "targetNodeData": { "name": "Task 2", "code": "T2" }
    }
  ],
  "prompt": "Generate a daily workflow analysis ..."
}
Response Example:

json
Copy code
{
  "aiResponse": "Generated report content here"
}
7. Deployment
For deployment, the Frontend is deployed on Vercel and the Backend on Railway.

You can deploy your application using these platforms by following their deployment guides:

Vercel (for Frontend): Vercel Documentation
Railway (for Backend): Railway Documentation
8. Troubleshooting
404 Error
If you're encountering a 404 error while fetching data from the backend, verify the following:

Make sure the backend server is running on http://localhost:5001.
Ensure the endpoint in your frontend code matches the backend's URL.
CORS Issues
If you're facing CORS issues, make sure the Backend server (Node.js) has CORS enabled to allow requests from the frontend.

Missing Environment Variables
Double-check your .env files to ensure that all required environment variables (API keys, project IDs, etc.) are correctly set up.

9. Contributing
We welcome contributions! If you have ideas for new features or bug fixes, feel free to fork the repository, create a new branch, and submit a pull request.

10. License
This project is licensed under the MIT License. See the LICENSE file for more details.