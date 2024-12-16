Productivity Tracker Web App
A comprehensive web application for boosting your productivity and team collaboration!

This app empowers you to:

Manage Group Projects: Organize and track progress on projects with your team, ensuring everyone stays on track.
Focus with Pomodoro Timer: Implement the Pomodoro Technique for focused work intervals and timely breaks, maximizing your concentration.   
Visualize Workflows: Create dynamic and interactive flow charts to visualize the flow of tasks within your projects, enhancing clarity.
AI-Powered Optimization: Receive personalized suggestions from an AI to optimize your productivity and workflow, unlocking new levels of efficiency.
Collaborate Seamlessly: Work together in real-time with your team, sharing task status and communicating through comments, streamlining collaboration.
Live Demo: Check out the app in action!

Productivity Tracker - Live Demo

Features:

Group Project Management
Pomodoro Timer
Interactive Flowchart UI
AI Productivity Suggestions
Collaborative Features
Tech Stack:

Frontend: React.js, Next.js (for fast & responsive experience)   
Backend: Node.js, Express.js (for handling requests)
CMS: Sanity.io (for content management & storage)
AI Integration: Google Generative AI
Database: Sanity (content storage & management)
Hosting: Vercel (Frontend), Railway (Backend)
Running Locally:

Clone the Repository:
Bash

git clone https://github.com/Vilas-cp/qtr.git
cd productivity-tracker
Set Up Environment Variables: Create .env.local in client and .env in backend with your credentials.
Install Dependencies:
Bash

# Client (Frontend)
cd client
npm install

# Backend (Node.js)
cd backend
npm install

# Server (Sanity) (if applicable)
cd server
sanity install
Start Development Servers:
Bash

# Frontend (Next.js)
cd client
npm run dev

# Backend (Node.js)
cd backend
npm start

# Start Sanity Studio (if applicable)
# Follow Sanity's documentation
Access the Application:
Frontend: http://localhost:3000
Backend (Optional): http://localhost:5001
Deployment:

Frontend: Vercel
Backend: Railway
Follow their deployment guides for each platform.

Troubleshooting:

404 Error: Ensure Backend runs & URLs match.
CORS Issues: Enable CORS on the Backend server.
Missing Environment Variables: Check .env files for correct setup.
Contributing:

We welcome contributions! Fork the repo, create a branch, and submit a pull request to share your ideas.

License:

MIT License (See LICENSE file for details)