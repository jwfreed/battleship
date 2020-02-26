import React, { useContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../Context/GameContext';
import './Tile.css';

const Tile = ({ row, col, onClick, onAttack }) => {
  const { shipPlacements, view, attackPlacements } = useContext(GameContext);

  const doClick = useCallback(() => {
    onClick(row, col);
  }, [row, col, onClick]);

  const doAttack = useCallback(() => {
    onAttack(row, col);
  }, [row, col, onAttack]);

  const placedShip = useMemo(() => (
    shipPlacements[row] && shipPlacements[row][col]
  ), [row, col, shipPlacements]);

  const attackAttempts = useMemo(() => (
    attackPlacements[row] && attackPlacements[row][col]
  ), [row, col, attackPlacements]);

  return (
    (
      view === 'P' ?
        <button className="tile" onClick={doClick}>
          {placedShip ? placedShip.name : '-'}
        </button> :
        <button className="tile" onClick={doAttack}>
          {attackAttempts ? attackAttempts : '-'}
        </button>
    )
  );
};

Tile.propTypes = {
  row: PropTypes.number,
  col: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  onAttack: PropTypes.func.isRequired,
};

export default Tile;
