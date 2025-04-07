# 🎥 OnlyUs - Connect with Strangers via Video & Chat

OnlyUs is a real-time video chat platform that connects strangers from around the world. Users can join based on shared interests and communicate through live webcam and text chat. The platform offers a smooth, black-themed interface with purple accents for a sleek and modern look.

---

## 🌟 Features

### 🚀 Frontend (React)
- 🖤 Black theme with purple highlights
- 🏠 Homepage with interest selection (like `indian`, `american`, `music`, etc.)
- 📸 "GoOnlyUs" button to activate webcam and start the journey
- 🔀 Match randomly or based on selected interests
- 🎥 Video chat interface: local + remote video
- 💬 Real-time text chat alongside video
- ⏭️ "Next Person" button to skip and find a new match

### 🛠️ Backend (Node.js + Socket.io)
- 🌐 Express server handles API and WebSocket routes
- 🧠 Smart matchmaking: supports both random and interest-based pairing
- 🔁 WebRTC signaling for real-time P2P video/audio streaming
- 📡 Socket.io for chat, connect/disconnect, and signaling messages

---

## 📁 Project Structure

onlyus/ │ ├── onlyus-frontend/ # React frontend │ ├── public/ │ └── src/ │ ├── components/ │ ├── pages/ │ └── App.js │ └── onlyus-backend/ # Node.js backend ├── server.js └── matchmaker.js

yaml
Copy
Edit

---

## ⚙️ Getting Started

### 📦 Prerequisites

- Node.js >= 14.x
- npm >= 6.x

---

### 🖥️ Frontend Setup (React)

```bash
# Navigate to frontend
cd onlyus/onlyus-frontend

# Install dependencies
npm install

# Start the dev server
npm start
Runs on http://localhost:3000

🔧 Backend Setup (Node.js)
bash
Copy
Edit
# Navigate to backend
cd onlyus/onlyus-backend

# Install dependencies
npm install

# Start the server
npm run dev
Backend runs on http://localhost:5000

🛜 How It Works
User lands on the homepage and selects their interest tags.

Clicking GoOnlyUs requests camera/mic permissions.

The system places them in a queue to match with someone compatible.

Once paired, WebRTC connects both peers for live video/audio.

Users can chat via text and click Next to skip to a new stranger.

📸 Screenshots
Coming soon... (Add screenshots or GIF demos here once your UI is polished)

🧪 Tech Stack
Technology	Usage
React.js	Frontend UI
React Router	Navigation between pages
Socket.io	Real-time communication
WebRTC	Peer-to-peer video/audio calls
Node.js	Backend server
Express.js	HTTP server for API & Socket.io
CORS	Handles cross-origin requests
🔐 Environment Variables
Create a .env file in your onlyus-backend folder with the following (if needed):

env
Copy
Edit
PORT=5000
🧰 Available Scripts
Frontend
Script	Description
npm start	Starts dev server
npm run build	Builds optimized production app
Backend
Script	Description
npm run dev	Starts server with Nodemon
npm start	Starts server (without reloads)
🤝 Contributing
Pull requests are welcome! If you want to contribute:

Fork the project

Create a feature branch: git checkout -b feature-name

Commit changes: git commit -m "Added feature"

Push to your branch: git push origin feature-name

Open a pull request on GitHub

🛡️ License
This project is licensed under the MIT License.

📫 Contact
Built with ❤️ by G Chaitanya Naga Sai

🌐 GitHub: https://github.com/Chaitanya1436

📧 Email: chaitanya.24085@gmail.com

💼 LinkedIn: https://www.linkedin.com/in/g-chaitanya-naga-sai-3b525a274

