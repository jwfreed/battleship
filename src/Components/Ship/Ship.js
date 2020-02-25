import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../Context/GameContext';
import './Ship.css';

const Ship = ({ ship, selected, onClick }) => {
  const { shipsPlaced, dispatch } = useContext(GameContext);

  const shipOnBoard = (() => {
    if (Object.entries(shipsPlaced).length === 0 && shipsPlaced.constructor === Object) {
      return false;
    } else {
      const ships = Object.keys(shipsPlaced);
      return ships.includes(ship.name);
    }
  })();

  return (
    <div className="ship" >
      <div onClick={() => onClick(ship)}>
        <h4>
          {ship.name} {selected ? '*' : ''}
        </h4>
        <p>
          Tile Length: {ship.size}
        </p>
      </div>
      {shipOnBoard && <button>Reset {ship.name}</button>}
    </div>
  )
};

Ship.propTypes = {
  ship: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

export default Ship;
