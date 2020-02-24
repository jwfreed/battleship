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
  shipsPlaced: {},
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
      if (!selectedShip.name) {           // if no selected ship
        alert('Select a ship first');
        return prevState;
      }

      if (prevState.shipsPlaced[selectedShip.name]) {             // if ship is already on the board
        alert('Ship is already on the board\n Select another ship')
        return prevState;
      }

      const { row, col } = action;
      const prevPlacements = prevState.shipPlacements;

      let newPlacements = {};

      let shipPlacementSuccessful = { [selectedShip.name]: true }

      if (prevState.placementOrientation === 'H') {       // if orientation is set to horizontal
        newPlacements = {
          ...prevPlacements,
          [row]: {
            ...prevPlacements[row],
          }
        };
        for (let i = 0; i < selectedShip.size; i++) {
          let nextCol = col + i;
          if (nextCol < prevState.boardCols.length) {
            newPlacements[row][nextCol] = selectedShip;
          } else {
            alert('off board')
            newPlacements = { ...prevPlacements }
            shipPlacementSuccessful = { [selectedShip.name]: false }
            return prevState;
          }
        }
      }

      if (prevState.placementOrientation === 'V') {       // if orientation is set to vertical
        newPlacements = {
          ...prevPlacements,
        }
        for (let i = 0; i < selectedShip.size; i++) {
          let nextRow = row + i;
          if (nextRow < prevState.boardRows.length) {
            newPlacements[nextRow] = {
              ...prevPlacements[nextRow],
            }
            newPlacements[nextRow][col] = selectedShip;
          } else {
            alert('off board')
            newPlacements = { ...prevPlacements }
            shipPlacementSuccessful = { [selectedShip.name]: false }
            return prevState;
          }
        }
        // for (let row in newPlacements) {

        // }
      }

      return { ...prevState, shipPlacements: newPlacements, shipsPlaced: shipPlacementSuccessful };
    }
    case 'CLEAR_PLACEMENTS':
      return { ...prevState, shipPlacements: initialState.shipPlacements };
    default:
      return prevState;
  }
};

export default React.createContext();