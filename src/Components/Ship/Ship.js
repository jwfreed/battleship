import React from 'react'
import PropTypes from 'prop-types'

const Ship = ({ value, size, onClick }) => {
  return (
    <div className='ship' onClick={() => onClick(value, size)}>
      {value}
    </div>
  );
};

Ship.propTypes = {
  value: PropTypes.string,
  size: PropTypes.number,
  onClick: PropTypes.func.isRequired
};

export default Ship;