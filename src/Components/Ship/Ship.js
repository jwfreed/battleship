import React from 'react'
import PropTypes from 'prop-types'
import './Ship.css'

const Ship = ({ ship, selected, onClick }) => {
  return (
    <div className='ship' onClick={() => onClick(ship)}>
      <h4>{ship.name}{selected ? '*' : ''}</h4>
      <p>Tile Length: {ship.size}</p>
    </div>
  );
};

Ship.propTypes = {
  ship: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool
};

export default Ship;