import React, { useReducer, useEffect } from 'react';
import { Match } from '../Match/Match'
import { CreateOrJoinGame } from '../../Components/CreateOrJoinGame/CreateOrJoinGame';
import GameContext, { localState, initialState } from '../../Context/GameContext';
import GameReducer from '../../Context/GameReducer';
import './Game.css';

const Game = () => {
  const [state, dispatch] = useReducer(GameReducer, localState || initialState);

  useEffect(() => {
    const parsedState = JSON.stringify(state);
    localStorage.setItem('state', parsedState);
  }, [state]);

  return (
    <div className="game game-container">
      <header className="title">BATTLESHIP</header>
      <p>Hi, I'm Jon Freed. Repo: <a href="https://github.com/jwfreed/battleship">github.com/jwfreed/battleship</a> </p>
      <GameContext.Provider value={{ ...state, dispatch }}>
        {state.matchID ? <Match /> : <CreateOrJoinGame />}
      </GameContext.Provider>
    </div>
  );
};

export default Game;
