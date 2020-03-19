import React, { useContext, useMemo } from 'react';
import GameContext from '../../Context/GameContext';
import { shipHits } from './fleetService';
import './Fleet.css';

export const Fleet = (attacks) => {
  const { ships } = useContext(GameContext);
  const title = (Object.keys(attacks).includes('myAttacks') && 'Opponent Fleet Health') || 'Your Fleet Health';

  const hits = shipHits(attacks);

  // const hits = useMemo(() => {
  //   shipHits(attacks)
  // }, [attacks]);

  console.log(hits)

  const fleet = ships.map((ship, i) => {
    return <li key={i} >{ship.name}: {ship.size - hits[ship.name]}</li>
  });

  return (
    <div>
      {title}
      <ul className="fleet">
        {fleet}
      </ul>
    </div>
  );
};
