import React, { useContext, useCallback, useMemo } from 'react';
import Tile from '../Tile/Tile';
import GameContext from '../../Context/GameContext';

import './Board.css';

const Board = ({ doAttackTile }) => {
  const { boardRows, boardCols, myAttackPlacements, dispatch } = useContext(GameContext);

  const doPlaceShip = useCallback((row, col) => {
    dispatch({ type: 'PLACE_SHIP', row, col });
  }, [dispatch]);

  const doAttack = useCallback((row, col) => {
    // dispatch({ type: 'ATTACK', row, col });
    doAttackTile(row, col);
  }, [doAttackTile]);

  const myAttacks = useMemo(() => {
    const attacks = {};
    myAttackPlacements.forEach(attack => {
      console.log(attack)
      const row = attack.row;
      const col = attack.col;
      const hit = attack.hit ? attack.hit.name : 'miss';
      attacks[row] = {
        ...attacks[row],
        [col]: hit,
      };
    });
    return attacks;
  }, [myAttackPlacements]);

  return (
    <div className="board">
      {
        boardRows.map((rv, rowIndex) => (
          <div key={`row-${rowIndex}`} className="boardRow">
            {boardCols.map((cv, colIndex) => (
              <Tile key={`${rowIndex}-${colIndex}`} row={rowIndex} col={colIndex} onClick={doPlaceShip} onAttack={doAttack} myAttacks={myAttacks} />
            ))}
          </div>
        ))
      }
    </div>
  );
};

export default Board;
