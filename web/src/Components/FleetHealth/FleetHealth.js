import React, { useContext, memo, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../Context/GameContext';
import { shipHits } from './fleetHealthService';
import './FleetHealth.css';

export const FleetHealth = memo((attacks) => {
  const { ships, player, dispatch } = useContext(GameContext);
  const title = (Object.keys(attacks).includes('myAttacks') && 'Opponent Fleet Health') || `${player} Fleet Health`;

  const hits = shipHits(attacks);

  const fleet = ships.map((ship, i) => {
    return <li key={i} >{ship.name}: {ship.size - hits[ship.name]}</li>;
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
