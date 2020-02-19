import React, { useContext, useCallback } from 'react'
import { Tile } from './Tile'
import GameContext from '../Context/GameContext'

import './Board.css'

export const Board = () => {
  const { boardRows, boardCols, dispatch } = useContext(GameContext);

  const doPlaceShip = useCallback((row, col) => {
    dispatch({ type: 'PLACE_SHIP', row, col });
  }, [dispatch]);

  const renderTiles = () => {
    const result = [];
    for (let i = 0; i < boardRows; i++) {
      for (let j = 0; j < boardCols; j++) {
        result.push(<Tile row={i} col={j} key={`${i}-${j}`} onClick={doPlaceShip} />);
      }
    }
    return result;
  };

  return (
    <div className='board'>
      {renderTiles()}
    </div>
  );
}