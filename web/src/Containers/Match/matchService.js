export const createAttacksObj = (arr) => {
  const attacksObj = {};
  if (arr && arr !== null) {
    arr.forEach((attack) => {
      const row = attack.row;
      const col = attack.col;
      const hit = attack.hit ? attack.hit.name : 'miss';
      attacksObj[row] = {
        ...attacksObj[row],
        [col]: hit,
      };
    });
  };
  return attacksObj;
};
