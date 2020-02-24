export const selectShip = (prevState, action) => {
  const ship = action.ship;
  const selectedShip = { name: ship.name, size: ship.size };
  return { ...prevState, selectedShip };
};

export const changeOrientation = (prevState, action) => {
  const currentOrientation = prevState.placementOrientation;
  const placementOrientation = currentOrientation === 'H' ? 'V' : 'H';
  return { ...prevState, placementOrientation };
};

export const placeShip = (prevState, action) => {
  const selectedShip = prevState.selectedShip;
  if (!selectedShip.name) { // if no selected ship
    alert('Select a ship first');
    return prevState;
  }

  if (prevState.shipsPlaced[selectedShip.name]) { // if ship is already on the board
    alert('Ship is already on the board\nSelect another ship')
    return prevState;
  }

  const { row, col } = action;
  const prevPlacements = prevState.shipPlacements;

  let newPlacements = {};

  let shipPlacementSuccessful = { [selectedShip.name]: true }

  if (prevState.placementOrientation === 'H') { // if orientation is set to horizontal
    newPlacements = {
      ...prevPlacements,
      [row]: {
        ...prevPlacements[row],
      }
    };
    for (let i = 0; i < selectedShip.size; i++) {
      let nextCol = col + i;
      if (nextCol < prevState.boardCols.length && prevPlacements[row] === undefined) {
        newPlacements[row][nextCol] = selectedShip;
      } else {
        alert('cannot place ships off board or on occupied tile')
        newPlacements = { ...prevPlacements }
        shipPlacementSuccessful = { [selectedShip.name]: false }
        return prevState;
      }
    }
  }

  if (prevState.placementOrientation === 'V') { // if orientation is set to vertical
    newPlacements = {
      ...prevPlacements,
    }
    for (let i = 0; i < selectedShip.size; i++) {
      let nextRow = row + i;
      if (nextRow < prevState.boardRows.length) {
        // console.log(prevPlacements)
        newPlacements[nextRow] = {
          ...prevPlacements[nextRow],
        }
        newPlacements[nextRow][col] = selectedShip;
      } else {
        alert('cannot place ships off board or on occupied tile')
        newPlacements = { ...prevPlacements }
        shipPlacementSuccessful = { [selectedShip.name]: false }
        return prevState;
      }
    }
  }

  return { ...prevState, shipPlacements: newPlacements, shipsPlaced: shipPlacementSuccessful };
};