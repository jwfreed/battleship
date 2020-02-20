import React, { useContext, useCallback } from 'react'
import Tile from '../Tile/Tile'
import GameContext from '../../Context/GameContext'

import './Board.css'

const Board = () => {
  const { boardRows, boardCols, dispatch } = useContext(GameContext);

  const doPlaceShip = useCallback((row, col) => {
    dispatch({ type: 'PLACE_SHIP', row, col });
  }, [dispatch]);

  return (
    <>
      <div className="board">
        {
          boardRows.map((rv, rowIndex) => (
            <div key={`row-${rowIndex}`} className="boardRow">
              {boardCols.map((cv, colIndex) => (
                <Tile key={`${rowIndex}-${colIndex}`} row={rowIndex} col={colIndex} onClick={doPlaceShip} />
              ))}
            </div>
          ))
        }
      </div>
    </>
  );
}

export default Board;