import React, { useContext, useCallback } from 'react';
import Tile from '../Tile/Tile';
import GameContext from '../../Context/GameContext';

import './Board.css';

const AttackBoard = () => {
  const { boardRows, boardCols, dispatch } = useContext(GameContext);

  const doAttack = useCallback((row, col) => {
    console.log(row, col)
    dispatch({ type: 'ATTACK', row, col });
  }, [dispatch]);

  return (
    <div className="board">
      {
        boardRows.map((rv, rowIndex) => (
          <div key={`row-${rowIndex}`} className="boardRow">
            {boardCols.map((cv, colIndex) => (
              <Tile key={`${rowIndex}-${colIndex}`} row={rowIndex} col={colIndex} doAttack={doAttack} />
            ))}
          </div>
        ))
      }
    </div>
  );
};

export default AttackBoard;
