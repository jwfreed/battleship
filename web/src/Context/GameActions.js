import { initialState } from './GameContext'

export const selectShip = (prevState, action) => {
  const ship = action.ship;
  const selectedShip = { name: ship.name, size: ship.size };
  return { ...prevState, selectedShip };
};

export const changeOrientation = (prevState) => {
  const currentOrientation = prevState.placementOrientation;
  const placementOrientation = currentOrientation === 'H' ? 'V' : 'H';
  return { ...prevState, placementOrientation };
};

export const placeShip = (prevState, action) => {
  const { row, col } = action;
  const selectedShip = prevState.selectedShip;
  const currentPlacements = prevState.shipPlacements;

  let newPlacements = {};
  const placedShipRowColArr = []
  let shipPlacementSuccessful = { ...prevState.shipsPlaced, [selectedShip.name]: placedShipRowColArr };

  if (!selectedShip.name) { // if no selected ship
    alert('Select a ship first');
    return prevState;
  };

  if (prevState.shipsPlaced[selectedShip.name]) { // if ship is already on the board
    alert('Ship is already on the board\nSelect another ship');
    return prevState;
  };

  const noOverflow = (rowOrCol) => {
    const shipLength = parseInt(selectedShip.size);
    const arg = parseInt(rowOrCol);
    const boardLength = parseInt(initialState.boardCols.length);
    if (boardLength - arg >= shipLength) return true;
  };

  const invalidMove = () => {
    alert('cannot place ships off board or on occupied tile');
    newPlacements = { ...currentPlacements };
    shipPlacementSuccessful = { [selectedShip.name]: false };
    return prevState;
  };

  if (prevState.placementOrientation === 'H') { // if orientation is set to horizontal
    newPlacements = {
      ...currentPlacements,
      [row]: {
        ...currentPlacements[row],
      },
    };

    if (noOverflow(col)) {
      for (let i = 0; i < selectedShip.size; i++) {
        const nextCol = col + i;
        newPlacements[row][nextCol] = selectedShip;
        placedShipRowColArr.push([row, nextCol]);
        if (currentPlacements[row] && currentPlacements[row][nextCol]) {
          return invalidMove();
        };
      };
    } else {
      return invalidMove();
    };
  };

  if (prevState.placementOrientation === 'V') { // if orientation is set to vertical
    newPlacements = {
      ...currentPlacements,
    };

    if (noOverflow(row)) {
      for (let i = 0; i < selectedShip.size; i++) {
        const nextRow = row + i;
        newPlacements[nextRow] = {
          ...currentPlacements[nextRow],
        };
        newPlacements[nextRow][col] = selectedShip;
        placedShipRowColArr.push([nextRow, col]);
        if (currentPlacements[nextRow] && currentPlacements[nextRow][col]) {
          return invalidMove();
        };
      };
    } else {
      return invalidMove();
    };
  };

  return { ...prevState, shipPlacements: newPlacements, shipsPlaced: shipPlacementSuccessful };
};

export const removeShip = (prevState, action) => {
  const currentShipsPlaced = prevState.shipsPlaced;
  const currentPlacements = prevState.shipPlacements;

  const removedShipPlacements = currentShipsPlaced[action.ship].forEach(arr => {
    if (currentPlacements[arr[0]] && currentPlacements[arr[0]][arr[1]]) {
      currentPlacements[arr[0]][arr[1]] = undefined
    }
  });
  const removedShipsPlaced = currentShipsPlaced[action.ship] = undefined;

  return { ...prevState, shipsPlaced: { ...currentShipsPlaced, removedShipsPlaced }, shipPlacements: { ...currentShipsPlaced, removedShipPlacements } };
};

export const resetGame = () => {
  return initialState;
};

export const attack = (prevState, action) => {
  const { id, data } = action;
  const shipPlacements = prevState.shipPlacements;

  const myCurrentAttacks = prevState.myAttackPlacements;
  let myNewAttacks = { ...myCurrentAttacks };

  const opponentCurrentAttacks = prevState.opponentAttackPlacements;
  let opponentNewAttacks = { ...opponentCurrentAttacks };

  console.log('here', action)

  if (id === initialState.uid) {
    data.forEach((coordinate) => {
      let row = coordinate[0];
      let col = coordinate[1];
      myNewAttacks = {
        ...myCurrentAttacks,
        [row]: {
          ...myCurrentAttacks[row]
        },
      };

      if (shipPlacements[row] && shipPlacements[row][col]) {
        myNewAttacks[row][col] = 'hit'
      } else {
        myNewAttacks[row][col] = 'miss';
      };
    });
  };

  return { ...prevState, myAttackPlacements: myNewAttacks };
};

export const changeView = (prevState) => {
  const currentView = prevState.view;
  const view = currentView === 'P' ? 'A' : 'P';
  return { ...prevState, view };
};

export const joinGame = (prevState, action) => {
  const matchID = action.matchID;
  return { ...prevState, matchID };
};