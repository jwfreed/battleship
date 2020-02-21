import React from 'react'

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
  shipsPlaced: { Carrier: false, Battleship: false, Cruiser: false, Submarine: false, Destroyer: false },
  selectedShip: { name: null, size: null },
  placementOrientation: 'H', // H or V
};

export const GameReducer = (prevState, action) => {
  switch (action.type) {
    case 'SELECT_SHIP': {
      const ship = action.ship;
      const selectedShip = { name: ship.name, size: ship.size };
      return { ...prevState, selectedShip };
    }
    case 'CHANGE_SHIP_ORIENTATION': {
      const currentOrientation = prevState.placementOrientation;
      const placementOrientation = currentOrientation === 'H' ? 'V' : 'H';
      return { ...prevState, placementOrientation };
    }
    case 'PLACE_SHIP': {
      const selectedShip = prevState.selectedShip;
      if (!selectedShip.name) {
        alert('Select a ship first');
        return prevState;
      }

      if (prevState.shipsPlaced[selectedShip.name]) {
        alert('Ship is already on the board')
        return prevState;
      }

      const { row, col } = action;
      const prevPlacements = prevState.shipPlacements;

      let newPlacements = {};

      if (prevState.placementOrientation === 'H') {
        newPlacements = {
          ...prevPlacements,
          [row]: {
            ...prevPlacements[row],
          }
        };
        for (let i = 0; i < selectedShip.size; i++) {
          let nextCol = col + i;
          newPlacements[row][nextCol] = selectedShip;
        }
      }

      if (prevState.placementOrientation === 'V') {
        newPlacements = {
          ...prevPlacements,
        }
        for (let i = 0; i < selectedShip.size; i++) {
          let nextRow = row + i;
          newPlacements[nextRow] = {
            ...prevPlacements[nextRow],
          }
          newPlacements[nextRow][col] = selectedShip;
        }
      }

      return { ...prevState, shipPlacements: newPlacements, shipsPlaced: { [selectedShip.name]: true } };
    }
    case 'CLEAR_PLACEMENTS':
      return { ...prevState, shipPlacements: initialState.shipPlacements };
    default:
      return prevState;
  }
};

export default React.createContext();