import React from 'react';
import shortid from 'shortid';

const currentUID = (() => {
  const storedUID = localStorage.getItem('uid');
  if (storedUID) return storedUID;

  const newUID = shortid.generate();
  localStorage.setItem('uid', newUID);
  return newUID;
})();

const localRawState = localStorage.getItem('state');
export const localState = localRawState && JSON.parse(localRawState);

export const initialState = {
  boardRows: Array(10).fill(null),
  boardCols: Array(10).fill(null),
  shipPlacements: {},
  ships: [
    { name: 'Carrier', size: 5 },
    { name: 'Battleship', size: 4 },
    { name: 'Cruiser', size: 3 },
    { name: 'Submarine', size: 3 },
    { name: 'Destroyer', size: 2 },
  ],
  shipsPlaced: {},
  selectedShip: { name: null, size: null },
  placementOrientation: 'H', // H or V
  view: 'P', // P or A
  myAttackPlacements: [],
  opponentAttackPlacements: [],
  uid: currentUID,
  matchID: null,
  shipsCommitted: false,
  opponentShipsCommitted: false,
  turn: 'player_one',
  player: null,
  gameOver: false,
};

export default React.createContext();
