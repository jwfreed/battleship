import React, { useContext, useMemo, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../Context/GameContext';
import './Ship.css';

const Ship = memo(({ ship, selected, onClick }) => {
  const { shipsPlaced, dispatch } = useContext(GameContext);

  const doResetShip = useCallback((shipName) => {
    dispatch({ type: 'REMOVE_SHIP', ship: shipName });
  }, [dispatch]);

  const handleClick = useCallback(() => {
    onClick(ship);
  }, [onClick, ship]);

  const handleResetClick = useCallback((e) => {
    e.stopPropagation();
    doResetShip(ship.name);
  }, [doResetShip, ship.name]);

  const shipOnBoard = useMemo(() => {
    const shipPlacement = shipsPlaced[ship.name];
    return !!shipPlacement;
  }, [ship.name, shipsPlaced]);

  return (
    <div 
      className={`ship ${selected ? 'ship-selected' : ''}`}
      onClick={handleClick}
    >
      <h4>
        {ship.name}
      </h4>
      <p>
        Boat Length: {ship.size} Tiles
      </p>
      {shipOnBoard && (
        <button onClick={handleResetClick}>
          Reset {ship.name}
        </button>
      )}
    </div>
  )
});

Ship.displayName = 'Ship';

Ship.propTypes = {
  ship: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

export default Ship;
