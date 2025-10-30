# 🎥 OnlyUs - Connect with Strangers via Video & Chat

**OnlyUs** is a real-time video chat platform that connects strangers from around the world. Users can join based on shared interests and communicate through live webcam and text chat. The platform features a sleek **black-themed interface with purple accents**.

---

## 🌟 Features

### 🚀 Frontend (React)
- 🖤 Black theme with purple highlights  
- 🏠 Homepage with interest selection (e.g., `indian`, `american`, `music`, etc.)  
- 📸 **GoOnlyUs** button to activate webcam and start chatting  
- 🔀 Match randomly or based on selected interests  
- 🎥 Dual video chat interface (local + remote)  
- 💬 Real-time text chat alongside video  
- ⏭️ "Next Person" button to skip and find a new match  

### 🛠️ Backend (Node.js + Socket.io)
- 🌐 Express server handles API and WebSocket routes  
- 🧠 Smart matchmaking (random + interest-based pairing)  
- 🔁 WebRTC signaling for real-time P2P video/audio streaming  
- 📡 Socket.io for chat, connect/disconnect, and signaling messages  

---

## 📁 Project Structure

> ⚠️ **Read the Setup Guide before running the project**

```
onlyus/
│
├── package.json
├── package-lock.json
├── node_modules/
│
├── backend/
│ ├── server.js
│ ├── package.json
│ └── ...
│
└── frontend/
├── src/
├── package.json
└── ...
```


---

## ⚙️ Getting Started

### 📦 Prerequisites
- Node.js ≥ 14.x  
- npm ≥ 6.x  

---

### 🖥️ Frontend Setup (React)

<code>
# Navigate to frontend
cd onlyus/frontend

# Install dependencies
npm install

# Start the dev server
npm start
</code>

Frontend runs at: **http://localhost:3000**

---

### 🔧 Backend Setup (Node.js)

<code>
# Navigate to backend
cd onlyus/backend

# Install dependencies
npm install

# Start the server
npm run dev
</code>

Backend runs at: **http://localhost:5000**

---

## 🛜 How It Works

1. User lands on the homepage and selects their interest tags.  
2. Clicking **GoOnlyUs** requests camera/mic permissions.  
3. The system places them in a queue to match with someone compatible.  
4. Once paired, WebRTC connects both peers for live video/audio.  
5. Users can chat via text and click **Next** to skip to a new stranger.  

---

## 🧪 Tech Stack

| Technology   | Purpose |
|---------------|----------|
| **React.js**  | Frontend UI |
| **React Router** | Navigation between pages |
| **Socket.io** | Real-time communication |
| **WebRTC** | Peer-to-peer video/audio calls |
| **Node.js** | Backend server |
| **Express.js** | HTTP + Socket.io routes |
| **CORS** | Cross-origin handling |

---

## 🔐 Environment Variables

Create a `.env` file in your `onlyus/backend` folder:

```
PORT=5000
```

---

## 🧰 Available Scripts

### Frontend
| Script | Description |
|--------|--------------|
| `npm start` | Starts development server |
| `npm run build` | Builds optimized production app |

### Backend
| Script | Description |
|--------|--------------|
| `npm run dev` | Starts server with Nodemon |
| `npm start` | Starts server normally |

---

## 🤝 Contributing

Pull requests are welcome!  
To contribute:

<code>
# Fork the project
# Create a feature branch
git checkout -b feature-name

# Commit your changes
git commit -m "Added feature"

# Push to your branch
git push origin feature-name
</code>

Then open a **Pull Request** on GitHub.  

---

## 🛡️ License
This project is **not licensed**.

---

## 📫 Contact

Built with ❤️ by **G Chaitanya Naga Sai**

- 🌐 **GitHub:** [Chaitanya1436](https://github.com/Chaitanya1436)  
- 📧 **Email:** [chaitanya.24085@gmail.com](mailto:chaitanya.24085@gmail.com)  
- 💼 **LinkedIn:** [G Chaitanya Naga Sai](https://www.linkedin.com/in/g-chaitanya-naga-sai-3b525a274)
