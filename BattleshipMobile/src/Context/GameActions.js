import {Alert} from 'react-native';
import {initialState} from './GameContext';

export const selectShip = (prevState, action) => {
  const ship = action.ship;
  const selectedShip = {name: ship.name, size: ship.size, img: ship.img};
  return {...prevState, selectedShip};
};

export const changeOrientation = prevState => {
  const currentOrientation = prevState.placementOrientation;
  const placementOrientation = currentOrientation === 'H' ? 'V' : 'H';
  return {...prevState, placementOrientation};
};

export const placeShip = (prevState, action) => {
  const {row, col} = action;
  const selectedShip = prevState.selectedShip;
  const currentPlacements = prevState.shipPlacements;

  let newPlacements = {};
  const placedShipRowColArr = [];
  let shipPlacementSuccessful = {
    ...prevState.shipsPlaced,
    [selectedShip.name]: placedShipRowColArr,
  };

  if (prevState.shipsCommitted) {
    Alert.alert('Warning', 'Ships already placed and committed');
    return prevState;
  }

  if (!selectedShip.name && !prevState.shipsCommitted) {
    // if no selected ship
    Alert.alert('Warning', 'Select a ship first');
    return prevState;
  }

  if (prevState.shipsPlaced[selectedShip.name] && !prevState.shipsCommitted) {
    // if ship is already on the board
    Alert.alert('Warning', 'Ship is already on the board\nSelect another ship');
    return prevState;
  }

  const noOverflow = rowOrCol => {
    const shipLength = parseInt(selectedShip.size, 10);
    const arg = parseInt(rowOrCol, 10);
    const boardLength = parseInt(initialState.boardCols.length, 10);
    if (boardLength - arg >= shipLength) {
      return true;
    }
    return false;
  };

  const invalidMove = () => {
    Alert.alert('Warning', 'Cannot place ships off board or on occupied tile');

    newPlacements = {...currentPlacements};
    shipPlacementSuccessful = {[selectedShip.name]: false};
    return prevState;
  };

  if (prevState.placementOrientation === 'H') {
    // if orientation is set to horizontal
    newPlacements = {
      ...currentPlacements,
      [row]: {
        ...currentPlacements[row],
      },
    };

    if (noOverflow(col)) {
      for (let i = 0; i < selectedShip.size; i += 1) {
        const nextCol = col + i;
        newPlacements[row][nextCol] = selectedShip;
        placedShipRowColArr.push([row, nextCol]);
        if (currentPlacements[row] && currentPlacements[row][nextCol]) {
          return invalidMove();
        }
      }
    } else {
      return invalidMove();
    }
  }

  if (prevState.placementOrientation === 'V') {
    // if orientation is set to vertical
    newPlacements = {
      ...currentPlacements,
    };

    if (noOverflow(row)) {
      for (let i = 0; i < selectedShip.size; i += 1) {
        const nextRow = row + i;
        newPlacements[nextRow] = {
          ...currentPlacements[nextRow],
        };
        newPlacements[nextRow][col] = selectedShip;
        placedShipRowColArr.push([nextRow, col]);
        if (currentPlacements[nextRow] && currentPlacements[nextRow][col]) {
          return invalidMove();
        }
      }
    } else {
      return invalidMove();
    }
  }

  return {
    ...prevState,
    shipPlacements: newPlacements,
    shipsPlaced: shipPlacementSuccessful,
  };
};

export const removeShip = (prevState, action) => {
  const shipToRemove = action.ship;
  const currentShipPlacements = prevState.shipsPlaced[shipToRemove];

  const updatededPlacements = currentShipPlacements.reduce((acc, pos) => {
    acc[pos[0]][pos[1]] = undefined;
    return acc;
  }, prevState.shipPlacements);

  return {
    ...prevState,
    shipPlacements: updatededPlacements,
    shipsPlaced: {...prevState.shipsPlaced, [shipToRemove]: undefined},
  };
};

export const resetGame = initialState => initialState;

export const updateContext = (prevState, action) => {
  const {
    player_one,
    player_two,
    player_one_attack_placements,
    player_two_attack_placements,
    player_one_ship_placements,
    player_two_ship_placements,
  } = action.data;

  const lastMsg = prevState.lastMsg;
  const newMsg = JSON.stringify(action.data);

  const playerId = prevState.uid; // Changed from initialState.uid
  const myPlayer = playerId === player_one ? 'Player One' : 'Player Two';

  const playerOneShips = player_one_ship_placements || false;
  const playerTwoShips = player_two_ship_placements || false;

  const myAttacks =
    player_one === playerId
      ? player_one_attack_placements
      : player_two_attack_placements;
  const opponentAttacks =
    myAttacks === player_one_attack_placements
      ? player_two_attack_placements
      : player_one_attack_placements;

  const shipsCommitted =
    player_one === playerId ? playerOneShips : playerTwoShips;
  const opponentCommittedShips =
    player_two === playerId ? playerOneShips : playerTwoShips;

  const startGame = shipsCommitted && opponentCommittedShips;
  const lastTurn = prevState.turn;

  if (!prevState.gameOver && lastMsg !== newMsg && !startGame) {
    return {
      ...prevState,
      shipsCommitted,
      opponentShipsCommitted: opponentCommittedShips,
      player: myPlayer,
      turn: lastTurn,
    };
  }

  if (!prevState.gameOver && lastMsg !== newMsg && startGame) {
    const nextTurn = lastTurn === 'Player One' ? 'Player Two' : 'Player One';

    const newView = myPlayer === nextTurn ? 'A' : 'P';

    return {
      ...prevState,
      myAttackPlacements: myAttacks,
      opponentAttackPlacements: opponentAttacks,
      turn: nextTurn,
      shipsCommitted,
      opponentShipsCommitted: opponentCommittedShips,
      player: myPlayer,
      gameStarted: startGame,
      lastMsg: newMsg,
      view: newView,
    };
  }
  return prevState;
};

export const changeView = prevState => {
  const currentView = prevState.view;
  const view = currentView === 'P' ? 'A' : 'P';
  return {...prevState, view};
};

export const joinGame = (prevState, action) => {
  const matchID = action.matchID;
  return {...prevState, matchID};
};

export const commitShips = prevState => ({...prevState, shipsCommitted: true});

export const gameOver = prevState => {
  const lastTurn = prevState.turn;
  const winner = lastTurn === 'Player One' ? 'Player Two' : 'Player One';
  Alert.alert('Game Over', `${winner} Wins!`);
  return {...prevState, gameOver: true, winner, turn: 'Game Over!'};
};

export const createAttacksObj = arr => {
  const attacksObj = {};
  if (arr && Array.isArray(arr)) {
    arr.forEach(attack => {
      const row = attack.row;
      const col = attack.col;
      const hit = attack.hit ? attack.hit.name : 'miss';
      attacksObj[row] = {
        ...attacksObj[row],
        [col]: hit,
      };
    });
  }
  return attacksObj;
};
