import React, { useContext, useState } from 'react';
import GameContext from '../../Context/GameContext';
import './CreateOrJoinGame.css';

export const CreateOrJoinGame = () => {
  const { uid, dispatch } = useContext(GameContext);
  const [joinMatch, setJoinMatch] = useState('');
  const [rejoinMatch, setRejoinMatch] = useState('');
  const [rejoinUid, setRejoinUid] = useState('');
  const [showRejoin, setShowRejoin] = useState(false);

  const createGame = async () => {
    try {
      console.log('Creating game with API URL:', import.meta.env.VITE_API_URL);
      console.log('UID:', uid);
      
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: uid }),
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!data.success) {
        throw new Error(data.message || 'Server reported failure');
      }

      const matchID = data.data?.id;
      console.log('Match ID:', matchID);
      
      if (matchID) {
        dispatch({ type: 'JOIN_GAME', matchID });
        alert('share Match ID with your opponent: ' + matchID);
      } else {
        throw new Error('No match ID returned from server');
      }
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Error creating game: ' + error.message);
    }
  };

  const joinGame = (e) => {
    e.preventDefault();
    if (joinMatch !== '') {
      dispatch({ type: 'JOIN_GAME', matchID: joinMatch });
      return;
    };
    alert('enter a match Id to join a match');
  };

  const handleRejoinFromOtherDevice = async (e) => {
    e.preventDefault();
    if (!rejoinMatch || !rejoinUid) {
      alert('Enter both Match ID and your Player ID');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/${rejoinMatch}/rejoin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: rejoinUid }),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message || 'Failed to rejoin match');
        return;
      }

      // Store the UID from the other device
      localStorage.setItem('uid', rejoinUid);
      
      // Rejoin with the restored state
      dispatch({ type: 'REJOIN_MATCH', data: data.data });
    } catch (error) {
      console.error('Error rejoining match:', error);
      alert('Error rejoining match: ' + error.message);
    }
  };

  const copyUid = () => {
    navigator.clipboard.writeText(uid);
    alert('Player ID copied to clipboard!');
  };

  return (
    <div className="create-join-game">
      <div className="player-id-section">
        <p className="player-id-label">Your Player ID:</p>
        <div className="player-id-display">
          <code className="player-id">{uid}</code>
          <button className="copy-btn" onClick={copyUid} title="Copy to clipboard">📋</button>
        </div>
        <p className="player-id-hint">Save this to rejoin from another device</p>
      </div>

      <label htmlFor="create-game-btn">
        <button id="create-game-btn" onClick={createGame}>Create a New Match</button>
      </label>
      
      <label htmlFor="join-game">
        <form onSubmit={joinGame}>
          <button id="join-game-btn">Join an Existing Match</button>
          <input
            id="join-game"
            type="text"
            value={joinMatch}
            placeholder="Enter Match ID"
            onChange={e => setJoinMatch(e.target.value)}
          />
        </form>
      </label>

      <div className="rejoin-section">
        <button 
          className="toggle-rejoin-btn" 
          onClick={() => setShowRejoin(!showRejoin)}
        >
          {showRejoin ? '▼ Hide' : '▶ Rejoin from another device'}
        </button>
        
        {showRejoin && (
          <form className="rejoin-form" onSubmit={handleRejoinFromOtherDevice}>
            <input
              type="text"
              value={rejoinMatch}
              placeholder="Match ID"
              onChange={e => setRejoinMatch(e.target.value)}
            />
            <input
              type="text"
              value={rejoinUid}
              placeholder="Your Player ID from other device"
              onChange={e => setRejoinUid(e.target.value)}
            />
            <button type="submit" className="rejoin-btn">Rejoin Match</button>
          </form>
        )}
      </div>
    </div>
  );
};
