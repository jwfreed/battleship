import React from 'react';

export const initialState = {
  boardRows: Array(5).fill(null),
  boardCols: Array(5).fill(null),
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
};

export default React.createContext();
