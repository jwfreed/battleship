import React, { useReducer, useEffect } from 'react';
import Board from '../../Components/Board/Board';
import ShipSelect from '../ShipSelect/ShipSelect';
import GameContext, { localState, initialState } from '../../Context/GameContext';
import GameReducer from '../../Context/GameReducer';
import './Game.css';

const Game = () => {
  const [state, dispatch] = useReducer(GameReducer, localState || initialState);

  useEffect(() => {
    const parsedState = JSON.stringify(state);
    localStorage.setItem('state', parsedState);
  }, [state]);

  const doResetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const doChangeView = () => {
    dispatch({ type: 'CHANGE_VIEW' })
  };

  return (
    <div className="game">
      <header className="title">Battleship</header>
      <GameContext.Provider value={{ ...state, dispatch }}>
        {state.view === 'P' && <ShipSelect />}
        <div className="reset-view-div">
          <button className="reset-btn" onClick={doResetGame}>Reset Game</button>
          <button className="view-btn" onClick={doChangeView}>Board View</button>
        </div>
        {state.view === 'P' ? <p className="view-text">Place Ships</p> : <p className="view-text">Attack</p>}
        <Board />
      </GameContext.Provider>
    </div>
  );
};

export default Game;
