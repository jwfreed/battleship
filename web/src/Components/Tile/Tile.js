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
    const isHit = opponentAttempts === 'hit' || (opponentAttempts && opponentAttempts !== 'miss');
    const isMiss = opponentAttempts === 'miss';
    
    return (
      <button 
        className={`tile fleet-view ${placedShip ? 'has-ship' : ''} ${isHit ? 'hit' : ''} ${isMiss ? 'miss' : ''}`} 
        onClick={doClick}
      >
        {placedShip && (
          <div className="ship-container">
            <img className={`tileImg ${isHit ? 'hit' : ''}`} src={imgPath} alt={placedShip.name} loading="lazy" />
          </div>
        )}
        {isMiss && <div className="miss-marker" />}
        {isHit && (
          <div className="hit-marker">
            <div className="hit-inner" />
          </div>
        )}
      </button>
    );
  }

  const isHit = attackAttempts === 'hit' || (attackAttempts && attackAttempts !== 'miss');
  const isMiss = attackAttempts === 'miss';

  return (
    <button 
      className={`tile attack-view ${isHit ? 'hit' : ''} ${isMiss ? 'miss' : ''}`} 
      onClick={doAttack}
    >
      {isHit && (
        <div className="hit-marker">
          <div className="hit-inner" />
        </div>
      )}
      {isMiss && <div className="miss-marker" />}
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
