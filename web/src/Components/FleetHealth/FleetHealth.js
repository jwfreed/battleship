import React, { useContext, memo, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../Context/GameContext';
import { shipHits } from './fleetHealthService';
import './FleetHealth.css';

const FleetHealth = memo((attacks) => {
  const { ships, player, dispatch } = useContext(GameContext);
  const title = (Object.keys(attacks).includes('myAttacks') && 'Opponent Fleet Health') || `${player} Fleet Health`;
  const fleetClass = (title === `${player} Fleet Health`) && 'my' || 'opponent';

  const hits = shipHits(attacks);
  const fleet = ships.map((ship, i) => {
    if (hits && hits[ship.name]) {
      return <li className="ship-health" key={i} >{ship.name}: {ship.size - hits[ship.name]}</li>;
    };
    return <li key={i} >{ship.name}: {ship.size}</li>;
  });

  const victory = useMemo(() => {
    const defeatedShips = [];
    ships.forEach((ship) => {
      defeatedShips.push(ship.size - hits[ship.name] === 0);
    });
    return !defeatedShips.includes(false)
  }, [hits, ships]);

  useEffect(() => {
    victory && dispatch({ type: 'VICTORY' });
  }, [victory, dispatch]);

  return (
    <div className="fleet-div">
      <h4 className="fleet-title">
        {title}
      </h4>
      <ul className={`${fleetClass}-fleet`}>
        {fleet}
      </ul>
    </div>
  );
});

FleetHealth.propTypes = {
  attacks: PropTypes.object,
};

export default FleetHealth;