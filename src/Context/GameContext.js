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
  selectedShip: { name: null, size: null },
  placementOrientation: 'H', // H or V
};

export const GameReducer = (prevState, action) => {
  switch (action.type) {
    case 'SELECT_SHIP': {
      const ship = action.ship;
      const selectedShip = { name: ship.name, size: ship.size };
      console.log(selectedShip);
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
          let column = col + i;
          newPlacements[row][column] = selectedShip
        }
      }
      return { ...prevState, shipPlacements: newPlacements };
    }
    case 'CLEAR_PLACEMENTS':
      return { ...prevState, shipPlacements: initialState.shipPlacements };
    default:
      return prevState;
  }
};

export default React.createContext();