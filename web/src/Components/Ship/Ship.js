import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../Context/GameContext';
import './Ship.css';

const Ship = ({ ship, selected, onClick }) => {
  const { shipsPlaced, dispatch } = useContext(GameContext);

  const doResetShip = (ship) => {
    dispatch({ type: 'REMOVE_SHIP', ship });
  };

  const shipOnBoard = useMemo(() => {
    const shipPlacement = shipsPlaced[ship.name];
    return !!shipPlacement;
  }, [ship.name, shipsPlaced]);

  return (
    <div 
      className={`ship ${selected ? 'ship-selected' : ''}`}
      onClick={() => onClick(ship)}
    >
      <h4>
        {ship.name}
      </h4>
      <p>
        Boat Length: {ship.size} Tiles
      </p>
      {shipOnBoard && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            doResetShip(ship.name);
          }}
        >
          Reset {ship.name}
        </button>
      )}
    </div>
  )
};

Ship.propTypes = {
  ship: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

export default Ship;
