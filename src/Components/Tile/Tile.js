import React, { useContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../Context/GameContext';
import './Tile.css';

const Tile = ({ row, col, onClick }) => {
  const { shipPlacements } = useContext(GameContext);

  const doClick = useCallback(() => {
    onClick(row, col);
  }, [row, col, onClick]);

  const placedShip = useMemo(() => (
    shipPlacements[row] && shipPlacements[row][col]
  ), [row, col, shipPlacements]);

  return (
    <button className="tile" onClick={doClick}>
      {placedShip ? placedShip.name : '-'}
    </button>
  );
};

Tile.propTypes = {
  row: PropTypes.number,
  col: PropTypes.number,
  onClick: PropTypes.func.isRequired,
};

export default Tile;
