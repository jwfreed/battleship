import React, { useContext, useCallback, useMemo } from 'react';
import Tile from '../Tile/Tile';
import GameContext from '../../Context/GameContext';
import { createAttacksObj } from './boardService'
import './Board.css';

const Board = ({ doAttackTile }) => {
  const { boardRows, boardCols, myAttackPlacements, opponentAttackPlacements, dispatch } = useContext(GameContext);

  const doPlaceShip = useCallback((row, col) => {
    dispatch({ type: 'PLACE_SHIP', row, col });
  }, [dispatch]);

  const doAttack = useCallback((row, col) => {
    doAttackTile(row, col);
  }, [doAttackTile]);

  const myAttacks = useMemo(() => {
    return createAttacksObj(myAttackPlacements);
  }, [myAttackPlacements]);

  const opponentAttacks = useMemo(() => {
    return createAttacksObj(opponentAttackPlacements);
  }, [opponentAttackPlacements]);

  return (
    <div className="board">
      {
        boardRows.map((rv, rowIndex) => (
          <div key={`row-${rowIndex}`} className="boardRow">
            {boardCols.map((cv, colIndex) => (
              <Tile key={`${rowIndex}-${colIndex}`} row={rowIndex} col={colIndex} onClick={doPlaceShip} onAttack={doAttack} myAttacks={myAttacks} opponentAttacks={opponentAttacks} />
            ))}
          </div>
        ))
      }
    </div>
  );
};

export default Board;
