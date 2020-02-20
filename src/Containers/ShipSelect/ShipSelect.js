import React, { useContext, useCallback } from 'react'
import GameContext from '../../Context/GameContext'
import Ship from '../../Components/Ship/Ship'

import './SelectShip.css'

const ShipSelect = () => {
  const { ships, selectedShip, placementOrientation, dispatch } = useContext(GameContext);

  const doSelectShip = useCallback((ship) => {
    dispatch({ type: 'SELECT_SHIP', ship });
  }, [dispatch]);

  const doChangeShipOrientation = () => {
    dispatch({ type: 'CHANGE_SHIP_ORIENTATION' })
  }

  const renderShips = useCallback(() => {
    return ships.map((ship) => (
      <Ship
        key={ship.name}
        ship={ship}
        selected={selectedShip && ship.name === selectedShip.name}
        onClick={doSelectShip}
      />
    ));
  }, [ships, selectedShip, doSelectShip]);

  return (
    <div className="main-ship-container">
      <div className="select-ship-container">
        {renderShips()}
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
};

export default ShipSelect;