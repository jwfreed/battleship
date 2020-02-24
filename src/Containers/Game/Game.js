import React, { useReducer } from 'react';
import Board from '../../Components/Board/Board';
import ShipSelect from '../ShipSelect/ShipSelect';
import GameContext, { initialState } from '../../Context/GameContext';
import GameReducer from '../../Context/GameReducer';
import './Game.css';

const Game = () => {
  const [state, dispatch] = useReducer(GameReducer, initialState);

  return (
    <div className="game">
      <header className="title">Battleship</header>
      <GameContext.Provider value={{ ...state, dispatch }}>
        <ShipSelect />
        <Board />
      </GameContext.Provider>
    </div>
  );
};

export default Game;
