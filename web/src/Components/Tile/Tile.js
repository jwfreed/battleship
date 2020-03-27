import React, { useContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../Context/GameContext';
import './Tile.css';

const Tile = ({ row, col, onClick, onAttack, myAttacks, opponentAttacks }) => {
  const { shipPlacements, view } = useContext(GameContext);

  const doClick = useCallback(() => {
    onClick(row, col);
  }, [row, col, onClick]);

  const doAttack = useCallback(() => {
    onAttack(row, col);
  }, [row, col, onAttack]);

  const placedShip = useMemo(() => (
    shipPlacements[row] && shipPlacements[row][col]
  ), [row, col, shipPlacements]);

  const opponentAttempts = useMemo(() => (
    opponentAttacks[row] && opponentAttacks[row][col]
  ), [row, col, opponentAttacks]);

  const attackAttempts = useMemo(() => (
    myAttacks[row] && myAttacks[row][col]
  ), [row, col, myAttacks]);


  if (view === 'P') {
    return (
      <button className="tile" onClick={doClick}>
        {placedShip ? placedShip.name : '-'}
        {opponentAttempts ? '*' : ''}
      </button>
    );
  }

  return (
    <button className="tile" onClick={doAttack}>
      {attackAttempts || '-'}
    </button>
  );
};

Tile.propTypes = {
  row: PropTypes.number,
  col: PropTypes.number,
  myAttacks: PropTypes.object,
  opponentAttacks: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  onAttack: PropTypes.func.isRequired,
};

export default Tile;
