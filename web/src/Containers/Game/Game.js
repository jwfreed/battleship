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
    <div className="game">
      <header className="title">Battleship</header>
      <GameContext.Provider value={{ ...state, dispatch }}>
        {state.matchID ? <Match /> : <CreateOrJoinGame />}
      </GameContext.Provider>
    </div>
  );
};

export default Game;
