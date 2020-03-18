import React, { useContext, useMemo } from 'react';
import GameContext from '../../Context/GameContext';
import './Fleet.css';

export const Fleet = (attacks) => {
  const { ships } = useContext(GameContext);
  const title = (Object.keys(attacks).includes('myAttacks') && 'Opponent Fleet') || 'Your Fleet';
  const player = (Object.keys(attacks).includes('myAttacks') && 'myAttacks') || 'opponentAttacks';
  const shipHits = () => {
    const shipHits = {};
    for (let player in attacks) {
      for (let row in attacks[player]) {
        for (let col in attacks[player][row]) {
          let ship = attacks[player][row][col];
          shipHits[ship] = !shipHits[ship] ? shipHits[ship] = 1 : shipHits[ship] += 1;
        };
      };
    };
    return shipHits;
  };
  console.log(shipHits())
  // console.log(attacks)
  const fleet = ships.map((ship, i) => {
    return <li key={i} >{ship.name}: {ship.size}</li>
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
