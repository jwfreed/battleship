import React, { useContext, useCallback } from 'react'
import Tile from '../Tile/Tile'
import Ship from '../Ship/Ship'
import GameContext from '../../Context/GameContext'

import './Board.css'

const Board = () => {
  const { boardRows, boardCols, ships, dispatch } = useContext(GameContext);

  const doSelectShip = useCallback((value, size) => {
    dispatch({ type: 'SELECT_SHIP', value, size });
  }, [dispatch]);

  const renderShips = () => {
    const result = [];
    for (let key in ships) {
      result.push(<Ship key={key} value={key} size={ships[key]} onClick={doSelectShip} />);
    }
    return result;
  };


  const doPlaceShip = useCallback((row, col, ships) => {
    // need: row and column clicked and length of the ship
    dispatch({ type: 'PLACE_SHIP', row, col, ships });
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
    <>
      <div>
        {renderShips()}
      </div>
      <div className='board'>
        {renderTiles()}
      </div>
    </>
  );
}

export default Board;