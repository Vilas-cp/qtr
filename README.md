# Productivity Tracker Web App

A comprehensive web application for boosting your productivity and team collaboration!

## Features

### This app empowers you to:

- **Manage Group Projects:** Organize and track progress on projects with your team, ensuring everyone stays on track.
- **Focus with Pomodoro Timer:** Implement the Pomodoro Technique for focused work intervals and timely breaks, maximizing your concentration.
- **Visualize Workflows:** Create dynamic and interactive flow charts to visualize the flow of tasks within your projects, enhancing clarity.
- **AI-Powered Optimization:** Receive personalized suggestions from an AI to optimize your productivity and workflow, unlocking new levels of efficiency.
- **Collaborate Seamlessly:** Work together in real-time with your team, sharing task status and communicating through comments, streamlining collaboration.

### Live Demo

[**Productivity Tracker - Live Demo**](https://qtr-vilas-cps-projects.vercel.app/)

## Features Summary

- **Group Project Management**
- **Pomodoro Timer**
- **Interactive Flowchart UI**
- **AI Productivity Suggestions**
- **Collaborative Features**

## Tech Stack

- **Frontend:** React.js, Next.js (for fast & responsive experience)
- **Backend:** Node.js, Express.js (for handling requests)
- **CMS:** Sanity.io (for content management & storage)
- **AI Integration:** Google Generative AI
- **Database:** Sanity (content storage & management)
- **Hosting:** Vercel (Frontend), Railway (Backend)

---

## Running Locally

### Clone the Repository:
```bash
git clone https://github.com/Vilas-cp/qtr.git

```

### Set Up Environment Variables
Create `.env.local` in the `client` folder and `.env` in the `backend` folder with your credentials.
In `client`
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY,TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKENTWILIO_PHONE_NUMBER
In `backend`
GEMINI_API_KEY


### Install Dependencies
```bash
# Client (Frontend)
cd client
npm install

# Backend (Node.js)
cd backend
npm install

# Server (Sanity) (if applicable)
cd server
npm install
```

### Start Development Servers
```bash
# Frontend (Next.js)
cd client
npm run dev

# Backend (Node.js)
cd backend
npm start

# Start Sanity Studio 
cd server
sanity start

```

### Access the Application
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend (Optional):** [http://localhost:5001](http://localhost:5001)

---

## Deployment

- **Frontend:** [Vercel](https://vercel.com/)
- **Backend:** [Railway](https://railway.app/)

Follow the deployment guides provided by each platform for seamless hosting.

---

## Troubleshooting

- **404 Error:** Ensure the Backend server is running and the URLs match.
- **CORS Issues:** Enable CORS on the Backend server.
- **Missing Environment Variables:** Check the `.env` files for correct setup.

---

## Contributing

We welcome contributions! Fork the repository, create a branch, and submit a pull request to share your ideas.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
