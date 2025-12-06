import React, { useContext, useCallback, memo } from 'react';
import GameContext from '../../Context/GameContext';
import Ship from '../../Components/Ship/Ship';

import './SelectShip.css';

const ShipSelect = memo(() => {
  const { ships, selectedShip, placementOrientation, dispatch } = useContext(GameContext);

  const doSelectShip = useCallback((ship) => {
    dispatch({ type: 'SELECT_SHIP', ship });
  }, [dispatch]);

  const doChangeShipOrientation = useCallback(() => {
    dispatch({ type: 'CHANGE_SHIP_ORIENTATION' });
  }, [dispatch]);

  return (
    <div className="main-ship-container">
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
      <div className="orientation-div">
        <button className="orientation-btn" onClick={doChangeShipOrientation}>
          Orientation
        </button>
        <p className="current-orientation">
          {placementOrientation === 'H' ? 'Horizontal' : 'Vertical'}
        </p>
      </div>
    </div>
  );
});

ShipSelect.displayName = 'ShipSelect';

export default ShipSelect;
