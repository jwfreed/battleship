import React, { useContext, useCallback } from 'react'
import GameContext from '../../Context/GameContext'
import Ship from '../../Components/Ship/Ship'

import './SelectShip.css'

const ShipSelect = () => {
  const { ships, dispatch } = useContext(GameContext);

  const doSelectShip = useCallback((value, size) => {
    dispatch({ type: 'SELECT_SHIP', value, size });
  }, [dispatch]);

  const renderShips = useCallback(() => {
    return Object.keys(ships).map((key) => (
      <Ship key={key} value={key} size={ships[key]['size']} onClick={doSelectShip} />
    ));
  }, [ships, doSelectShip]);
  return (
    <div className="select-ship-container">
      {renderShips()}
    </div>
  )
}

export default ShipSelect;