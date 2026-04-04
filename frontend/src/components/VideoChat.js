import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './VideoChat.css';


const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";
console.log("SOCKET URL:", SOCKET_URL);

const VideoChat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { interests = [], matchType = 'random' } = location.state || {};

  const [connecting, setConnecting] = useState(true);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showChat, setShowChat] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const chatContainerRef = useRef(null);
  const localStreamRef = useRef(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        if (isMounted && localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        localStreamRef.current = stream;

        socketRef.current = io(SOCKET_URL);

        socketRef.current.on("connect", () => {
          console.log("✅ Connected:", socketRef.current.id);
        });

        socketRef.current.on("connect_error", (err) => {
          console.log("❌ Connection error:", err.message);
        });

        setupSocketListeners();
        findMatch();

      } catch (err) {
        console.error("Media error:", err);
        alert("Failed to access camera/microphone");
      }
    };

    init();

    return () => {
      isMounted = false;
      cleanupConnection();
    };
  }, []);

  const cleanupConnection = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (socketRef.current) socketRef.current.disconnect();
  };

  const setupSocketListeners = () => {
    const socket = socketRef.current;

    socket.on('matched', async ({ partnerId }) => {
      console.log("✅ Matched with partner");

      setConnecting(false);
      setConnected(true);

      await setupPeerConnection();

      // 👇 ONLY ONE USER CREATES OFFER
      if (socketRef.current.id < partnerId) {
        console.log("🎯 I create offer");
        createOffer();
      } else {
        console.log("👂 Waiting for offer");
      }
    });

    socket.on('offer', async (offer) => {
      console.log("Received offer");
      let pc = peerConnectionRef.current;
      if (!pc) pc = await setupPeerConnection();

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', answer);
      } catch (err) {
        console.error("Offer handling error:", err);
      }
    });

    socket.on('answer', async (answer) => {
      console.log("Received answer");
      const pc = peerConnectionRef.current;
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (err) {
          console.error("Answer error:", err);
        }
      }
    });

    socket.on('ice-candidate', async (candidate) => {
      const pc = peerConnectionRef.current;
      if (pc) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("ICE error:", err);
        }
      }
    });

    socket.on('chat-message', (msg) => {
      setMessages(prev => [...prev, { text: msg, sender: 'remote' }]);
    });

    socket.on('user-disconnected', () => {
      console.log("Partner disconnected");
      setConnected(false);
      setConnecting(true);
      setMessages([]);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      setTimeout(findMatch, 1000);
    });
  };

  const setupPeerConnection = async () => {
    if (peerConnectionRef.current) peerConnectionRef.current.close();

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: 'turn:global.relay.metered.ca:80',
          username: 'openrelayproject',
          credential: 'openrelayproject'
        }
      ]
    });

    peerConnectionRef.current = pc;

    // Add local stream
    localStreamRef.current.getTracks().forEach(track => {
      pc.addTrack(track, localStreamRef.current);
    });

    // Handle remote video
    pc.ontrack = (event) => {
      console.log("✅ Remote track received");
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', event.candidate);
      }
    };

    return pc;
  };

  const createOffer = async () => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current.emit('offer', offer);
    } catch (err) {
      console.error("Create offer error:", err);
    }
  };

  const findMatch = () => {
    if (socketRef.current) {
      socketRef.current.emit('find-match', { matchType, interests });
    }
  };

  const sendMessage = () => {
    if (!currentMessage.trim() || !connected) return;
    setMessages(prev => [...prev, { text: currentMessage, sender: 'local' }]);
    socketRef.current.emit('chat-message', currentMessage);
    setCurrentMessage('');
  };

  const nextMatch = () => {
    if (socketRef.current) socketRef.current.emit('next-match');
    setConnected(false);
    setConnecting(true);
    setMessages([]);
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setTimeout(findMatch, 800);
  };

  const toggleMic = () => {
    localStreamRef.current.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setMicOn(prev => !prev);
  };

  const toggleVideo = () => {
    localStreamRef.current.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setVideoOn(prev => !prev);
  };

  const goHome = () => {
    cleanupConnection();
    navigate('/');
  };

  return (
    <div className="video-chat-container">

      {/* VIDEO SECTION */}
      <div className="video-area">

        <div className="video-wrapper remote-video">
          {connecting && (
            <div className="connecting-overlay">
              <div className="spinner"></div>
              <p>Looking for someone to chat with...</p>
            </div>
          )}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={connected ? 'visible' : ''}
          />
        </div>

        <div className="video-wrapper local-video">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
          />
        </div>

      </div>

      {/* CHAT SECTION (TOGGLE) */}
      {showChat && (
        <div className="chat-area">

          <div className="chat-messages" ref={chatContainerRef}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message ${msg.sender === 'local' ? 'sent' : 'received'}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              disabled={!connected}
            />
            <button
              onClick={sendMessage}
              disabled={!connected || !currentMessage.trim()}
            >
              Send
            </button>
          </div>

        </div>
      )}

      {/* CONTROLS */}
      <div className="controls">

        <button onClick={toggleMic}>
          {micOn ? 'Mic is ON' : 'Mic is OFF'}
        </button>

        <button onClick={() => setShowChat(prev => !prev)}>
          {showChat ? 'Hide Chat' : 'Show Chat'}
        </button>

        <button onClick={toggleVideo}>
          {videoOn ? 'Video is ON' : 'Video is OFF'}
        </button>

        <button className="next-button" onClick={nextMatch}>
          Next Person
        </button>

        <button className="home-button" onClick={goHome}>
          Exit
        </button>

      </div>

    </div>
  );
};

export default VideoChat;