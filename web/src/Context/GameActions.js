import { toast, Flip, Zoom } from 'react-toastify';
import { initialState } from './GameContext';
import 'react-toastify/dist/ReactToastify.css';

export const selectShip = (prevState, action) => {
  const ship = action.ship;
  const selectedShip = { name: ship.name, size: ship.size, img: ship.img };
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
  const placedShipRowColArr = [];
  let shipPlacementSuccessful = {
    ...prevState.shipsPlaced,
    [selectedShip.name]: placedShipRowColArr,
  };

  if (prevState.shipsCommitted) {
    setTimeout(() => {
      toast.warn('Ships already placed and committed', {
        transition: Flip,
        autoClose: 2000,
        position: 'top-left',
      });
    }, 0);
    return prevState;
  }

  if (!selectedShip.name && !prevState.shipsCommitted) {
    // if no selected ship
    setTimeout(() => {
      toast.warn('Select a ship first', {
        transition: Flip,
        autoClose: 2000,
        position: 'top-left',
      });
    }, 0);
    return prevState;
  }

  if (prevState.shipsPlaced[selectedShip.name] && !prevState.shipsCommitted) {
    // if ship is already on the board
    setTimeout(() => {
      toast.warn('Ship is already on the board\nSelect another ship', {
        transition: Flip,
        autoClose: 2000,
        position: 'top-left',
      });
    }, 0);
    return prevState;
  }

  const noOverflow = (rowOrCol) => {
    const shipLength = parseInt(selectedShip.size, 10);
    const arg = parseInt(rowOrCol, 10);
    const boardLength = parseInt(initialState.boardCols.length, 10);
    if (boardLength - arg >= shipLength) return true;
    return false;
  };

  const invalidMove = () => {
    setTimeout(() => {
      toast.warn('cannot place ships off board or on occupied tile', {
        transition: Flip,
        autoClose: 2000,
        position: 'top-left',
      });
    }, 0);

    newPlacements = { ...currentPlacements };
    shipPlacementSuccessful = { [selectedShip.name]: false };
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
    }
    if (!noOverflow(row)) {
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
    shipsPlaced: { ...prevState.shipsPlaced, [shipToRemove]: undefined },
  };
};

export const resetGame = () => initialState;

/* eslint-disable camelcase */
export const updateContext = (prevState, action) => {
  const {
    player_one,
    player_two,
    player_one_attack_placements,
    player_two_attack_placements,
    player_one_ship_placements,
    player_two_ship_placements,
    turn: serverTurn,
  } = action.data;

  console.log('updateContext called with:', {
    player_one,
    player_two,
    serverTurn,
    prevState_player: prevState.player,
    prevState_uid: prevState.uid,
  });

  const lastMsg = prevState.lastMsg;
  const newMsg = JSON.stringify(action.data);
  
  console.log('Message comparison:', {
    lastMsg,
    newMsg,
    areSame: lastMsg === newMsg,
  });

  const playerId = prevState.uid;
  const myPlayer = playerId === player_one ? 'Player One' : 'Player Two';

  const playerOneShips = player_one_ship_placements || false;
  const playerTwoShips = player_two_ship_placements || false;

  const myAttacks = player_one === playerId
    ? player_one_attack_placements
    : player_two_attack_placements;
  const opponentAttacks = myAttacks === player_one_attack_placements
    ? player_two_attack_placements
    : player_one_attack_placements;

  const shipsCommitted = player_one === playerId ? playerOneShips : playerTwoShips;
  const opponentCommittedShips = player_two === playerId ? playerOneShips : playerTwoShips;

  const startGame = shipsCommitted && opponentCommittedShips;
  
  let currentTurn = prevState.turn;
  if (serverTurn) {
    if (serverTurn === 'player_one') currentTurn = 'Player One';
    else if (serverTurn === 'player_two') currentTurn = 'Player Two';
  }

  console.log('Calculated state:', {
    myPlayer,
    shipsCommitted,
    opponentCommittedShips,
    startGame,
    currentTurn,
    serverTurn,
  });

  if (!prevState.gameOver && lastMsg !== newMsg && !startGame) {
    console.log('Returning state: game not started yet');
    return {
      ...prevState,
      shipsCommitted,
      opponentShipsCommitted: opponentCommittedShips,
      player: myPlayer,
      turn: currentTurn,
      lastMsg: newMsg,
    };
  }

  if (!prevState.gameOver && lastMsg !== newMsg && startGame) {
    const newView = myPlayer === currentTurn ? 'A' : 'P';
    console.log('Returning state: game in progress', { 
      newView, 
      currentTurn, 
      myPlayer,
      comparison: `${myPlayer} === ${currentTurn} = ${myPlayer === currentTurn}`,
      myAttacksLength: myAttacks?.length,
      opponentAttacksLength: opponentAttacks?.length,
    });

    return {
      ...prevState,
      myAttackPlacements: myAttacks || [],
      opponentAttackPlacements: opponentAttacks || [],
      turn: currentTurn,
      shipsCommitted,
      opponentShipsCommitted: opponentCommittedShips,
      player: myPlayer,
      gameStarted: startGame,
      lastMsg: newMsg,
      view: newView,
    };
  }
  
  if (!prevState.gameOver && lastMsg === newMsg) {
    console.log('Returning state: same message');
    return prevState;
  }
  
  console.log('Returning state: default fallback');
  return prevState;
};
/* eslint-enable camelcase */

export const changeView = (prevState) => {
  const currentView = prevState.view;
  const view = currentView === 'P' ? 'A' : 'P';
  return { ...prevState, view };
};

export const joinGame = (prevState, action) => {
  const matchID = action.matchID;
  return { ...prevState, matchID };
};

export const commitShips = (prevState) => ({ ...prevState, shipsCommitted: true });

export const gameOver = (prevState) => {
  const lastTurn = prevState.turn;
  const winner = lastTurn === 'Player One' ? 'Player Two' : 'Player One';
  setTimeout(() => {
    toast.info(`${winner} Wins!`, {
      autoClose: false,
      transition: Zoom,
    });
  }, 0);
  return { ...prevState, gameOver: true, winner, turn: 'Game Over!' };
};
