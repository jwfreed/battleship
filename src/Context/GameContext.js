import React from 'react'

export const initialState = {
  boardRows: 10,
  boardCols: 10,
  shipPlacements: {},
  ships: {
    Carrier: 5,
    Battleship: 4,
    Cruiser: 3,
    Submarine: 3,
    Destroyer: 2
  },
  selectedShip: null,
};

export const GameReducer = (prevState, action) => {
  switch (action.type) {
    case 'SELECT_SHIP': {
      const { value, size } = action;
      console.log(value, size);
      const selection = { [value]: size };
      return { ...prevState, selectedShip: selection };
    }
    case 'PLACE_SHIP': {
      const { row, col } = action;
      const prevPlacements = prevState.shipPlacements;
      const newPlacements = {
        ...prevPlacements,
        [row]: {
          ...prevPlacements[row],
          [col]: 'placed boat',
        }
      };
      console.log(newPlacements);
      return { ...prevState, shipPlacements: newPlacements };
    }
    case 'CLEAR_PLACEMENTS':
      return { ...prevState, shipPlacements: initialState.shipPlacements };
    default:
      return prevState;
  }
};

export default React.createContext();