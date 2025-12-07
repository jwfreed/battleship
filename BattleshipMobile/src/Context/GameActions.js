import React from 'react';
import {Alert} from 'react-native';
import {initialState} from './GameContext';
import {showToast} from '../Components/Toast/Toast';
import HitIcon from '../assets/icons/Hit.svg';
import MissIcon from '../assets/icons/Miss.svg';

const toastWithIcon = (message, type, IconComponent) =>
  showToast(
    message,
    type,
    2500,
    IconComponent ? (
      <IconComponent width={18} height={18} fill="#0a0f1a" stroke="#0a0f1a" />
    ) : null,
  );

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
    showToast('Ships already placed and committed', 'warning');
    return prevState;
  }

  if (!selectedShip.name && !prevState.shipsCommitted) {
    // if no selected ship
    showToast('Select a ship first', 'warning');
    return prevState;
  }

  if (prevState.shipsPlaced[selectedShip.name] && !prevState.shipsCommitted) {
    // if ship is already on the board
    showToast('Ship is already on the board', 'warning');
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
    showToast('Cannot place ship here', 'warning');

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
    turn: serverTurn,
    my_ship_placements,
  } = action.data;

  // Exclude my_ship_placements from comparison since it's only sent on AUTH
  const msgForComparison = {...action.data};
  delete msgForComparison.my_ship_placements;
  const lastMsg = prevState.lastMsg;
  const newMsg = JSON.stringify(msgForComparison);

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

  // If we received ship placements from server (on rejoin), restore them
  let shipPlacements = prevState.shipPlacements;
  let shipsPlaced = prevState.shipsPlaced;

  if (my_ship_placements && Object.keys(prevState.shipPlacements).length === 0) {
    shipPlacements = my_ship_placements;
    shipsPlaced = {};
    // Reconstruct shipsPlaced from placements
    Object.keys(my_ship_placements).forEach(row => {
      Object.keys(my_ship_placements[row]).forEach(col => {
        const ship = my_ship_placements[row][col];
        if (ship && ship.name) {
          if (!shipsPlaced[ship.name]) {
            shipsPlaced[ship.name] = [];
          }
          shipsPlaced[ship.name].push([parseInt(row, 10), parseInt(col, 10)]);
        }
      });
    });
  }

  const startGame = shipsCommitted && opponentCommittedShips;
  
  // Parse server turn to display format
  let currentTurn = prevState.turn;
  if (serverTurn) {
    currentTurn = serverTurn === 'player_one' ? 'Player One' : 'Player Two';
  }

  if (!prevState.gameOver && lastMsg !== newMsg && !startGame) {
    return {
      ...prevState,
      shipPlacements,
      shipsPlaced,
      shipsCommitted,
      opponentShipsCommitted: opponentCommittedShips,
      player: myPlayer,
      turn: currentTurn,
    };
  }

  if (!prevState.gameOver && lastMsg !== newMsg && startGame) {
    const isMyTurn = myPlayer === currentTurn;

    // Check if there was a new attack (compare attack counts)
    const prevMyAttackCount = prevState.myAttackPlacements?.length || 0;
    const prevOpponentAttackCount = prevState.opponentAttackPlacements?.length || 0;
    const newMyAttackCount = myAttacks?.length || 0;
    const newOpponentAttackCount = opponentAttacks?.length || 0;

    let lastAttackResult = null;
    let pendingViewChange = null;
    
    // Determine if this is the first update after both players committed (game just started)
    const gameJustStarted = !prevState.gameStarted && startGame;

    // I just attacked (my attack count increased)
    if (newMyAttackCount > prevMyAttackCount && myAttacks?.length > 0) {
      const lastAttack = myAttacks[myAttacks.length - 1];
      const wasHit = lastAttack.hit && lastAttack.hit.name;
      lastAttackResult = {
        type: 'my_attack',
        hit: wasHit,
        shipName: wasHit ? lastAttack.hit.name : null,
      };
      // Show result, then switch to fleet view after delay
      pendingViewChange = 'P';
      toastWithIcon(
        wasHit
          ? `HIT! You hit their ${lastAttack.hit.name}!`
          : 'MISS - Your shot missed.',
        wasHit ? 'success' : 'info',
        wasHit ? HitIcon : MissIcon,
      );
    }
    // Opponent just attacked me (opponent attack count increased)
    else if (newOpponentAttackCount > prevOpponentAttackCount && opponentAttacks?.length > 0) {
      const lastAttack = opponentAttacks[opponentAttacks.length - 1];
      const wasHit = lastAttack.hit && lastAttack.hit.name;
      lastAttackResult = {
        type: 'opponent_attack',
        hit: wasHit,
        shipName: wasHit ? lastAttack.hit.name : null,
      };
      // Show result, then switch to attack view after delay
      pendingViewChange = 'A';
      toastWithIcon(
        wasHit
          ? `HIT! They hit your ${lastAttack.hit.name}!`
          : 'MISS - Their shot missed.',
        wasHit ? 'error' : 'info',
        wasHit ? HitIcon : MissIcon,
      );
    }
    
    // Set initial view when game starts: attack view if it's my turn
    const initialView = gameJustStarted ? (isMyTurn ? 'A' : 'P') : prevState.view;

    return {
      ...prevState,
      shipPlacements,
      shipsPlaced,
      myAttackPlacements: myAttacks,
      opponentAttackPlacements: opponentAttacks,
      turn: currentTurn,
      shipsCommitted,
      opponentShipsCommitted: opponentCommittedShips,
      player: myPlayer,
      gameStarted: startGame,
      lastMsg: newMsg,
      lastAttackResult,
      pendingViewChange,
      view: pendingViewChange ? prevState.view : initialView,
    };
  }
  return prevState;
};

export const applyPendingView = prevState => {
  if (prevState.pendingViewChange) {
    return {
      ...prevState,
      view: prevState.pendingViewChange,
      pendingViewChange: null,
      lastAttackResult: null,
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

export const rejoinMatch = (prevState, action) => {
  const {
    match,
    player_one,
    player_two,
    player_one_ship_placements,
    player_two_ship_placements,
    player_one_attack_placements,
    player_two_attack_placements,
    turn: serverTurn,
    my_ship_placements,
  } = action.data;

  const playerId = prevState.uid;
  const myPlayer = playerId === player_one ? 'Player One' : 'Player Two';

  const shipsCommitted =
    playerId === player_one ? player_one_ship_placements : player_two_ship_placements;
  const opponentCommittedShips =
    playerId === player_two ? player_one_ship_placements : player_two_ship_placements;

  const myAttacks =
    player_one === playerId
      ? player_one_attack_placements
      : player_two_attack_placements;
  const opponentAttacks =
    myAttacks === player_one_attack_placements
      ? player_two_attack_placements
      : player_one_attack_placements;

  let currentTurn = null;
  if (serverTurn) {
    if (serverTurn === 'player_one') currentTurn = 'Player One';
    else if (serverTurn === 'player_two') currentTurn = 'Player Two';
  }

  const startGame = shipsCommitted && opponentCommittedShips;

  // Reconstruct shipsPlaced from my_ship_placements
  let shipPlacements = {};
  let shipsPlaced = {};

  if (my_ship_placements) {
    shipPlacements = my_ship_placements;
    // Reconstruct shipsPlaced from placements
    Object.keys(my_ship_placements).forEach(row => {
      Object.keys(my_ship_placements[row]).forEach(col => {
        const ship = my_ship_placements[row][col];
        if (ship && ship.name) {
          if (!shipsPlaced[ship.name]) {
            shipsPlaced[ship.name] = [];
          }
          shipsPlaced[ship.name].push([parseInt(row, 10), parseInt(col, 10)]);
        }
      });
    });
  }

  console.log('Rejoining match:', {
    match,
    myPlayer,
    shipsCommitted,
    opponentCommittedShips,
    currentTurn,
    shipPlacements,
    shipsPlaced,
  });

  showToast('Welcome back! Rejoined match.', 'success');

  return {
    ...prevState,
    matchID: match,
    player: myPlayer,
    shipPlacements,
    shipsPlaced,
    shipsCommitted: !!shipsCommitted,
    opponentShipsCommitted: !!opponentCommittedShips,
    myAttackPlacements: myAttacks || [],
    opponentAttackPlacements: opponentAttacks || [],
    turn: currentTurn,
    gameStarted: startGame,
    view: startGame ? (myPlayer === currentTurn ? 'A' : 'P') : 'P',
  };
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
