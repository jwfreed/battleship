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
    { name: 'Carrier', size: 5, img: 'Carrier.svg' },
    { name: 'Battleship', size: 4, img: 'Battleship.svg' },
    { name: 'Cruiser', size: 3, img: 'Cruiser.svg' },
    { name: 'Submarine', size: 3, img: 'sub.svg' },
    { name: 'Destroyer', size: 2, img: 'Destroyer.svg' },
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
  turn: null,
  gameStarted: false,
  player: null,
  gameOver: false,
  initialTurn: 'Player One',
  lastMsg: '',
  winner: null,
};

export default React.createContext();
