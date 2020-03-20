import React, { useContext, memo } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../Context/GameContext';
import { shipHits } from './fleetHealthService';
import './FleetHealth.css';

export const FleetHealth = memo((attacks) => {
  const { ships, player } = useContext(GameContext);
  const title = (Object.keys(attacks).includes('myAttacks') && 'Opponent Fleet Health') || `${player} Fleet Health`;

  const hits = shipHits(attacks);

  const fleet = ships.map((ship, i) => {
    return <li key={i} >{ship.name}: {ship.size - hits[ship.name]}</li>;
  });
  console.log(hits)
  return (
    <div>
      {title}
      <ul className="fleet">
        {fleet}
      </ul>
    </div>
  );
});

FleetHealth.propTypes = {
  attacks: PropTypes.object,
};