import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import shortid from 'shortid';

const currentUID = (async () => {
  const storedUID = await AsyncStorage.getItem('uid');

  if (storedUID) return storedUID;

  const newUID = shortid.generate();
  await AsyncStorage.setItem('uid', newUID);
  return newUID
})();

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
  turn: null,
  gameStarted: false,
  player: null,
  gameOver: false,
  initialTurn: 'Player One',
  lastMsg: '',
  winner: null,
  initialized: false,
};

export const loadInitialState = (async () => {
  const storedState = await AsyncStorage.getItem('state', false);
  if (storedState) return JSON.parse(storedState);
  console.log(storedState)

  const currentUID = await (async () => {
    const storedUID = await AsyncStorage.getItem('uid');

    if (storedUID) return storedUID;

    const newUID = shortid.generate();
    await AsyncStorage.setItem('uid', newUID);
    return newUID
  })();

  return {
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
    turn: null,
    gameStarted: false,
    player: null,
    gameOver: false,
    initialTurn: 'Player One',
    lastMsg: '',
    winner: null,
    initialized: false,
  };
})();

export default React.createContext();
