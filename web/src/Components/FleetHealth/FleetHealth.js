import React, { useContext, memo, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../Context/GameContext';
import { shipHits } from './fleetHealthService';
import './FleetHealth.css';

const FleetHealth = memo(({ myAttacks, opponentAttacks }) => {
  const { ships, player, dispatch } = useContext(GameContext);
  
  // Determine which attacks to use based on props
  const attacks = myAttacks !== undefined ? { myAttacks } : { opponentAttacks };
  const title = myAttacks !== undefined ? 'Opponent Fleet Health' : `${player} Fleet Health`;
  const fleetClass = myAttacks !== undefined ? 'opponent' : 'my';

  const hits = useMemo(() => shipHits(attacks), [attacks]);
  
  const fleet = useMemo(() => (
    ships.map((ship, i) => {
      if (hits && hits[ship.name]) {
        return <li className="ship-health" key={ship.name}>{ship.name}: {ship.size - hits[ship.name]}</li>;
      }
      return <li key={ship.name}>{ship.name}: {ship.size}</li>;
    })
  ), [ships, hits]);

  const victory = useMemo(() => {
    if (!hits) return false;
    const defeatedShips = ships.map((ship) => ship.size - (hits[ship.name] || 0) === 0);
    return defeatedShips.every(Boolean);
  }, [hits, ships]);

  useEffect(() => {
    if (victory) {
      dispatch({ type: 'VICTORY' });
    }
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

FleetHealth.displayName = 'FleetHealth';

FleetHealth.propTypes = {
  myAttacks: PropTypes.object,
  opponentAttacks: PropTypes.object,
};

export default FleetHealth;