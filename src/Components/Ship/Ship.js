import React from 'react'
import PropTypes from 'prop-types'
import './Ship.css'

const Ship = ({ value, size, onClick }) => {
  return (
    <div className='ship' onClick={() => onClick(value, size)}>
      <h4>{value}</h4>
      <p>Tile Length: {size}</p>
    </div>
  );
};

Ship.propTypes = {
  value: PropTypes.string,
  size: PropTypes.number,
  onClick: PropTypes.func.isRequired
};

export default Ship;