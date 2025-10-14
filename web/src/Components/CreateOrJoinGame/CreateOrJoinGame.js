import React, { useContext, useState } from 'react';
import GameContext from '../../Context/GameContext';
import './CreateOrJoinGame.css';

export const CreateOrJoinGame = () => {
  const { uid, dispatch } = useContext(GameContext);
  const [joinMatch, setJoinMatch] = useState('');

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
      
      const matchID = data.data.id;
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

  const joinGame = () => {
    if (joinMatch !== '') {
      dispatch({ type: 'JOIN_GAME', matchID: joinMatch });
      return;
    };
    alert('enter a match Id to join a match');
  };

  return (
    <div className="create-join-game">
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
            onBlur={e => setJoinMatch(e.target.value)}
          />
        </form>
      </label>
    </div>
  );
};
