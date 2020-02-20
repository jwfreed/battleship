import React from 'react'

export const initialState = {
  boardRows: Array(10).fill(null),
  boardCols: Array(10).fill(null),
  shipPlacements: {},
  ships: {
    Carrier: {
      size: 5,
      damage: 0
    },
    Battleship: {
      size: 4,
      damage: 0
    },
    Cruiser: {
      size: 3,
      damage: 0
    },
    Submarine: {
      size: 3,
      damage: 0
    },
    Destroyer: {
      size: 2,
      damage: 0
    }
  },
  selectedShip: { name: null, orientation: 'horizontal' },
};

export const GameReducer = (prevState, action) => {
  switch (action.type) {
    case 'SELECT_SHIP': {
      const { value, size } = action;
      const selectedShip = { name: value, size: size, orientation: 'horizontal' };
      console.log(selectedShip)
      return { ...prevState, selectedShip };
    }
    case 'PLACE_SHIP': {
      const selectedShip = prevState.selectedShip;
      if (!selectedShip) {
        alert('Select a ship first');
        return prevState;
      }

      const { row, col } = action;
      const prevPlacements = prevState.shipPlacements;
      const newPlacements = {
        ...prevPlacements,
        [row]: {
          ...prevPlacements[row],
          [col]: prevState.selectedShip,
        }
      };
      return { ...prevState, shipPlacements: newPlacements };
    }
    case 'CLEAR_PLACEMENTS':
      return { ...prevState, shipPlacements: initialState.shipPlacements };
    default:
      return prevState;
  }
};

export default React.createContext();