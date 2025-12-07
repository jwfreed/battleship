import React, { useContext, useCallback, memo } from 'react';
import Tile from '../Tile/Tile';
import PropTypes from 'prop-types';
import GameContext from '../../Context/GameContext';
import './Board.css';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const Board = memo(({ doAttackTile, opponentAttacks, myAttacks }) => {
  const { boardRows, boardCols, dispatch } = useContext(GameContext);

  const doPlaceShip = useCallback((row, col) => {
    dispatch({ type: 'PLACE_SHIP', row, col });
  }, [dispatch]);

  const doAttack = useCallback((row, col) => {
    doAttackTile(row, col);
  }, [doAttackTile]);

  return (
    <div className="board-wrapper">
      {/* Column Numbers */}
      <div className="col-labels">
        <div className="corner-cell" />
        {boardCols.map((_, colIndex) => (
          <div key={`col-${colIndex}`} className="label-cell">
            <span className="label-text">{colIndex + 1}</span>
          </div>
        ))}
      </div>

      {/* Grid with Row Labels */}
      <div className="grid-container">
        {boardRows.map((rv, rowIndex) => (
          <div key={`row-${rowIndex}`} className="row-container">
            <div className="row-label-cell">
              <span className="label-text">{LETTERS[rowIndex]}</span>
            </div>
            <div className="boardRow">
              {boardCols.map((cv, colIndex) => (
                <Tile
                  key={`${rowIndex}-${colIndex}`}
                  row={rowIndex}
                  col={colIndex}
                  onClick={doPlaceShip}
                  onAttack={doAttack}
                  myAttacks={myAttacks}
                  opponentAttacks={opponentAttacks}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

Board.displayName = 'Board';

Board.propTypes = {
  doAttackTile: PropTypes.func.isRequired,
  opponentAttacks: PropTypes.object,
  myAttacks: PropTypes.object,
};

export default Board;
