import React, { useContext, useCallback, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../Context/GameContext';
import './Tile.css';

const Tile = memo(function Tile({ row, col, onClick, onAttack, myAttacks, opponentAttacks }) {
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
    const imgPath = placedShip && `/assets/${placedShip.img}`;
    const attemptClass = (opponentAttempts && 'hit') || (opponentAttempts && 'miss') || 'tile';
    return (
      <button className={`tile fleet-view ${attemptClass}`} onClick={doClick}>
        {(placedShip && <img className="tileImg" src={imgPath} alt={placedShip.name} loading="lazy" />)}
      </button>
    );
  }

  return (
    <button className="tile attack-view" onClick={doAttack}>
      {attackAttempts || '-'}
    </button>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better performance - only re-render if these change
  return (
    prevProps.row === nextProps.row &&
    prevProps.col === nextProps.col &&
    prevProps.myAttacks === nextProps.myAttacks &&
    prevProps.opponentAttacks === nextProps.opponentAttacks &&
    prevProps.onClick === nextProps.onClick &&
    prevProps.onAttack === nextProps.onAttack
  );
});

Tile.displayName = 'Tile';

Tile.propTypes = {
  row: PropTypes.number,
  col: PropTypes.number,
  myAttacks: PropTypes.object,
  opponentAttacks: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  onAttack: PropTypes.func.isRequired,
};

export default Tile;
