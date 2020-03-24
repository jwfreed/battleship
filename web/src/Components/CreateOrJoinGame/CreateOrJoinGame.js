import React, { useContext, useState } from 'react';
import GameContext from '../../Context/GameContext';
import './CreateOrJoinGame.css';

export const CreateOrJoinGame = () => {
  const { uid, dispatch } = useContext(GameContext);
  const [joinMatch, setJoinMatch] = useState('');

  const createGame = async () => {
    const matchID = await fetch('http://localhost:3001/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid: uid }),
    }).then((res) => res.json()).then((data) => data.data.id).catch(console.error);

    dispatch({ type: 'JOIN_GAME', matchID });
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