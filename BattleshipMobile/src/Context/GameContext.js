import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import shortid from 'shortid';

import Battleship from '../assets/Battleship.svg';
import Carrier from '../assets/Carrier.svg';
import Cruiser from '../assets/Cruiser.svg';
import Destroyer from '../assets/Destroyer.svg';
import Sub from '../assets/sub.svg';

export const initialState = {
  boardRows: Array.from({length: 10}),
  boardCols: Array.from({length: 10}),
  shipPlacements: {},
  ships: [
    {name: 'Carrier', size: 5, img: Carrier},
    {name: 'Battleship', size: 4, img: Battleship},
    {name: 'Cruiser', size: 3, img: Cruiser},
    {name: 'Submarine', size: 3, img: Sub},
    {name: 'Destroyer', size: 2, img: Destroyer},
  ],
  shipsPlaced: {},
  selectedShip: {name: null, size: null},
  placementOrientation: 'H', // H or V
  view: 'P', // P or A
  myAttackPlacements: [],
  opponentAttackPlacements: [],
  uid: null, // Will be loaded async
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
  pendingViewChange: null,
  lastAttackResult: null,
};

export const loadInitialState = async () => {
  try {
    console.log('Loading initial state...');
    const storedUID = await AsyncStorage.getItem('uid');
    console.log('Stored UID:', storedUID);
    let uid = storedUID;
    if (!uid) {
      uid = shortid.generate();
      console.log('Generated new UID:', uid);
      await AsyncStorage.setItem('uid', uid);
    }

    const localRawState = await AsyncStorage.getItem('state');
    const localState = localRawState ? JSON.parse(localRawState) : null;

    return {
      ...(localState || initialState),
      uid,
    };
  } catch (e) {
    console.error('Failed to load state', e);
    return initialState;
  }
};

export default React.createContext();
