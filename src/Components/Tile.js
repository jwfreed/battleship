import React, { useContext, useCallback, useMemo } from 'react';
import GameContext from '../Context/GameContext'
import './Tile.css';

export const Tile = ({ row, col, onClick }) => {
  const { shipPlacements } = useContext(GameContext);

  const doClick = useCallback(() => {
    onClick && onClick(row, col);
  }, [row, col, onClick]);

  const hasShip = useMemo(() => {
    return shipPlacements[row] && shipPlacements[row][col];
  }, [row, col, shipPlacements]);

  return (
    <button className='tile' onClick={doClick}>
      {hasShip ? 'ship' : 'water'}
    </button>
  );
}