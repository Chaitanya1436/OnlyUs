import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [interests, setInterests] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [matchType, setMatchType] = useState('random');
  const navigate = useNavigate();

  const addInterest = () => {
    if (inputValue.trim() !== '' && !interests.includes(inputValue.trim())) {
      setInterests([...interests, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeInterest = (interest) => {
    setInterests(interests.filter(item => item !== interest));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addInterest();
    }
  };

  const startChat = () => {
    navigate('/chat', { 
      state: { 
        interests, 
        matchType 
      } 
    });
  };

  return (
    <div className="home-container">
      <div className="logo-container">
        <h1>OnlyUs</h1>
        <p>Connect with strangers through video and chat</p>
      </div>
      
      <div className="preferences-container">
        <h2>Choose Your Preferences</h2>
        
        <div className="match-type">
          <label>Match Type:</label>
          <div className="toggle-container">
            <button 
              className={matchType === 'random' ? 'active' : ''} 
              onClick={() => setMatchType('random')}
            >
              Random
            </button>
            <button 
              className={matchType === 'interests' ? 'active' : ''} 
              onClick={() => setMatchType('interests')}
            >
              By Interests
            </button>
          </div>
        </div>
        
        <div className="interests-section">
          <label>Add Interests:</label>
          <div className="input-group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., music, english, telugu..."
              disabled={matchType === 'random'}
            />
            <button 
              onClick={addInterest}
              disabled={matchType === 'random'}
            >
              Add
            </button>
          </div>
          
          <div className="tags-container">
            {interests.map((interest, index) => (
              <div key={index} className="tag">
                {interest}
                <span onClick={() => removeInterest(interest)}>&times;</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <button 
        className="start-button" 
        onClick={startChat}
      >
        GoOnlyUs
      </button>
    </div>
  );
};

export default Home;