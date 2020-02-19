import React from 'react'

export const initialState = {
  boardRows: 10,
  boardCols: 10,
  shipPlacements: {},
};

export const GameReducer = (prevState, action) => {
  switch (action.type) {
    case 'PLACE_SHIP':
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
    case 'CLEAR_PLACEMENTS':
      return { ...prevState, shipPlacements: initialState.shipPlacements };
    default:
      return prevState;
  }
};

export default React.createContext();