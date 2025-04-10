import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './VideoChat.css';

const VideoChat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { interests, matchType } = location.state || { interests: [], matchType: 'random' };
  
  const [connecting, setConnecting] = useState(true);
  const [connected, setConnected] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  // Request camera permissions on component mount
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        setPermissionGranted(true);
        
        // Connect to socket server
        socketRef.current = io('http://localhost:5000');
        
        // Setup socket event listeners
        setupSocketListeners();
        
        // Find a match
        findMatch();
        
        return stream;
      } catch (err) {
        console.error('Error accessing media devices:', err);
        alert('Failed to access camera and microphone. Please grant permissions.');
      }
    };
    
    const localStream = requestPermissions();
    
    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      
      if (localStream) {
        localStream.then(stream => {
          stream.getTracks().forEach(track => track.stop());
        });
      }
    };
  }, []);
  
  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const setupSocketListeners = () => {
    const socket = socketRef.current;
    
    socket.on('matched', async (data) => {
      setConnecting(false);
      setConnected(true);
      
      // Setup WebRTC connection
      await setupPeerConnection();
      
      // Create and send offer
      createOffer();
    });
    
    socket.on('offer', async (offer) => {
      if (!peerConnectionRef.current) {
        await setupPeerConnection();
      }
      
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Create and send answer
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      
      socket.emit('answer', answer);
    });
    
    socket.on('answer', async (answer) => {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });
    
    socket.on('ice-candidate', async (candidate) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
    
    socket.on('chat-message', (message) => {
      setMessages(prevMessages => [...prevMessages, { text: message, sender: 'remote' }]);
    });
    
    socket.on('user-disconnected', () => {
      setConnected(false);
      setConnecting(true);
      setMessages([]);
      
      // Find a new match
      findMatch();
    });
  };
  
  const setupPeerConnection = async () => {
    // Setup WebRTC peer connection
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    };
    
    const pc = new RTCPeerConnection(configuration);
    peerConnectionRef.current = pc;
    
    // Add local tracks to peer connection
    const localStream = localVideoRef.current.srcObject;
    localStream.getTracks().forEach(track => {
      pc.addTrack(track, localStream);
    });
    
    // Handle incoming remote tracks
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
    
    // Send ICE candidates to the other peer
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', event.candidate);
      }
    };
    
    return pc;
  };
  
  const createOffer = async () => {
    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      
      socketRef.current.emit('offer', offer);
    } catch (err) {
      console.error('Error creating offer:', err);
    }
  };
  
  const findMatch = () => {
    if (socketRef.current) {
      socketRef.current.emit('find-match', {
        matchType,
        interests
      });
    }
  };
  
  const sendMessage = () => {
    if (currentMessage.trim() !== '' && connected) {
      // Add message to local state
      setMessages(prevMessages => [...prevMessages, { text: currentMessage, sender: 'local' }]);
      
      // Send message to remote peer
      socketRef.current.emit('chat-message', currentMessage);
      
      // Clear input
      setCurrentMessage('');
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };
  
  const nextMatch = () => {
    if (socketRef.current) {
      socketRef.current.emit('next-match');
      setConnected(false);
      setConnecting(true);
      setMessages([]);
    }
  };
  
  const goHome = () => {
    navigate('/');
  };
  
  return (
    <div className="video-chat-container">
      <div className="video-area">
        <div className="video-wrapper remote-video">
          {connecting ? (
            <div className="connecting-overlay">
              <div className="spinner"></div>
              <p>Looking for someone to chat with...</p>
              <p className="subtext">
                {matchType === 'interests' ? 
                  `Matching based on: ${interests.join(', ')}` : 
                  'Random matching enabled'}
              </p>
            </div>
          ) : null}
          
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
      
      <div className="chat-area">
        <div className="chat-messages" ref={chatContainerRef}>
          {messages.length === 0 ? (
            <div className="no-messages">
              <p>No messages yet</p>
              <p className="subtext">Say hello to start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.sender === 'local' ? 'sent' : 'received'}`}
              >
                {message.text}
              </div>
            ))
          )}
        </div>
        
        <div className="chat-input">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={!connected}
          />
          <button 
            onClick={sendMessage}
            disabled={!connected || currentMessage.trim() === ''}
          >
            Send
          </button>
        </div>
      </div>
      
      <div className="controls">
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