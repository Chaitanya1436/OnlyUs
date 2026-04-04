# 🎥 OnlyUs — Real-Time Stranger Video Chat

## 🚀Site is Live on

👉 [https://only-us-seven.vercel.app/](https://only-us-seven.vercel.app/)

**OnlyUs** is a real-time video chat platform that connects strangers instantly using **WebRTC + Socket.io**.
Matchs randomly or based on interests and communicate through **live video + chat**.

> ⚡ Fast. Simple. Real-time.

---

# ✨ Features

* 🎯 Random + Interest-Based Matching
* 🎥 Live Video Chat (WebRTC)
* 💬 Real-time Text Messaging
* 🔄 Next Person (Skip Feature)
* 🎤 Mic ON/OFF Toggle
* 📷 Camera ON/OFF Toggle
* 💬 Chat Toggle (Show/Hide)
* 📱 Mobile Responsive UI
* 🌍 Multi-device support (Ngrok + Hotspot)

---

# Tech Stack

| Technology       | Purpose                     |
| ---------------- | --------------------------- |
| **React.js**     | Frontend UI                 |
| **React Router** | Navigation                  |
| **Socket.io**    | Real-time communication     |
| **WebRTC**       | Video/audio peer connection |
| **Node.js**      | Backend runtime             |
| **Express.js**   | Server & routing            |
| **CORS**         | Cross-origin handling       |

---

# 🛜 How It Works

1. User selects interests
2. Clicks **GoOnlyUs** → camera & mic enabled
3. User enters matchmaking queue
4. Server pairs users (random / interest-based)
5. WebRTC connects both peers
6. Users can chat, toggle mic/video, or skip

---

# 📁 Project Structure

```
onlyus/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── node_modules/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   ├── package.json
│   └── node_modules/
│
├── ngrok.exe
├── ngrok.yml (optional)
├── .gitignore
├── README.md
└── How_To_Run_Guide.txt
```

---

# ⚙️ How To Run

👉 Follow full setup guide here:

📄 **[How_To_Run_Guide.txt](./How_To_Run_Guide.txt)**

---

# 🚀 Key Notes

* Backend → Port **5000**
* Frontend → Port **3000**
* Ngrok → exposes frontend
* Backend uses **WiFi IP**

---

# ⚠️ Important

* Devices must be on same hotspot (current setup)
* `.env` must have correct IPv4
* Keep ngrok running

---

# 🤝 Contributing

Pull requests are welcome!

```
# Fork the project

# Create a feature branch
git checkout -b feature-name

# Commit your changes
git commit -m "Added feature"

# Push to your branch
git push origin feature-name
```

Then open a **Pull Request** on GitHub.

---

# 🛡️ License

This project is **not licensed**.

---

# 📫 Contact

Built with ❤️ by **G Chaitanya Naga Sai**

* 🌐 GitHub: https://github.com/Chaitanya1436
* 📧 Email: [chaitanya.24085@gmail.com](mailto:chaitanya.24085@gmail.com)
* 💼 LinkedIn: https://www.linkedin.com/in/chaitanya-g-24085-/

---

# ⭐ Final Note

This project involves:

* real-time systems
* peer-to-peer communication
* networking

👉 You are building beyond beginner level.

---
