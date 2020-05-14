import React, { useContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../Context/GameContext';
import './Tile.css';

const Tile = ({ row, col, onClick, onAttack, myAttacks, opponentAttacks }) => {
  const { shipPlacements, shipsPlaced, view } = useContext(GameContext);

  const doClick = useCallback(() => {
    onClick(row, col);
  }, [row, col, onClick]);

  const doAttack = useCallback(() => {
    onAttack(row, col);
  }, [row, col, onAttack]);

  const placedShip = useMemo(() => (
    shipPlacements[row] && shipPlacements[row][col]
  ), [row, col, shipPlacements, shipsPlaced]);

  const opponentAttempts = useMemo(() => (
    opponentAttacks[row] && opponentAttacks[row][col]
  ), [row, col, opponentAttacks]);

  const attackAttempts = useMemo(() => (
    myAttacks[row] && myAttacks[row][col]
  ), [row, col, myAttacks]);

  if (view === 'P') {
    const imgPath = placedShip && process.env.PUBLIC_URL + '/assets/' + placedShip.img;
    const attemptClass = (opponentAttempts && 'hit') || (opponentAttempts && 'miss') || 'tile';
    return (
      <button className="tile fleet-view" onClick={doClick} >
        {(placedShip && <img className="tileImg" src={imgPath} alt={placedShip.name} />) || (opponentAttempts && '*') || '-'}
        {/* {(placedShip && placedShip.name) || (opponentAttempts && '*') || '-'} */}
      </button >
    );
  }

  return (
    <button className="tile attack-view" onClick={doAttack}>
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