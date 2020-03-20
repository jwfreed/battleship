export const shipHits = (attacksObj) => {
  const shipHits = {};
  for (let player in attacksObj) {
    for (let row in attacksObj[player]) {
      for (let col in attacksObj[player][row]) {
        let ship = attacksObj[player][row][col];
        shipHits[ship] = !shipHits[ship] ? shipHits[ship] = 1 : shipHits[ship] += 1;
      };
    };
  };
  return shipHits;
};
