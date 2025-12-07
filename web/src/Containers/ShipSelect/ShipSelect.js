import React, { useContext, useCallback, memo } from 'react';
import GameContext from '../../Context/GameContext';
import Ship from '../../Components/Ship/Ship';

import './SelectShip.css';

const ShipSelect = memo(() => {
  const { ships, selectedShip, placementOrientation, shipsPlaced, dispatch } = useContext(GameContext);

  const placedCount = Object.keys(shipsPlaced).length;
  const totalShips = ships.length;

  const doSelectShip = useCallback((ship) => {
    dispatch({ type: 'SELECT_SHIP', ship });
  }, [dispatch]);

  const doChangeShipOrientation = useCallback(() => {
    dispatch({ type: 'CHANGE_SHIP_ORIENTATION' });
  }, [dispatch]);

  return (
    <div className="main-ship-container">
      {/* Header */}
      <div className="ship-select-header">
        <h3 className="ship-select-title">DEPLOY YOUR FLEET</h3>
        <div className="progress-container">
          <span className="progress-text">{placedCount}/{totalShips} SHIPS PLACED</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(placedCount / totalShips) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Orientation Toggle */}
      <div className="orientation-div">
        <button className="orientation-btn" onClick={doChangeShipOrientation}>
          <span className="orientation-icon">
            {placementOrientation === 'H' ? '↔️' : '↕️'}
          </span>
          <span className="current-orientation">
            {placementOrientation === 'H' ? 'HORIZONTAL' : 'VERTICAL'}
          </span>
          <span className="tap-hint">TAP TO CHANGE</span>
        </button>
      </div>

      {/* Ships List */}
      <div className="select-ship-container">
        {ships.map((ship) => (
          <Ship
            key={ship.name}
            ship={ship}
            selected={selectedShip && ship.name === selectedShip.name}
            onClick={doSelectShip}
          />
        ))}
      </div>
    </div>
  );
});

ShipSelect.displayName = 'ShipSelect';

export default ShipSelect;
