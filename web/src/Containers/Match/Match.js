import React, { useContext, useMemo, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import Board from '../../Components/Board/Board';
import ShipSelect from '../ShipSelect/ShipSelect';
import GameContext from '../../Context/GameContext';
import { createAttacksObj } from '../../Containers/Match/matchService';
import { FleetHealth } from '../../Components/FleetHealth/FleetHealth';
import './Match.css';
import { gameOver } from '../../Context/GameActions';

export const Match = () => {
  const {
    uid,
    matchID,
    view,
    shipPlacements,
    ships,
    shipsPlaced,
    shipsCommitted,
    myAttackPlacements,
    opponentAttackPlacements,
    player,
    turn,
    dispatch
  } = useContext(GameContext);

  const socketUrl = `ws://localhost:3001/match/${matchID}`;
  const [sendMessage, lastMessage, readyState] = useWebSocket(socketUrl);

  const isConnected = useMemo(() => readyState === 1, [readyState]);

  useEffect(() => {
    if (isConnected) {
      const authMessage = JSON.stringify({ action: 'AUTH', uid: uid });
      sendMessage(authMessage);
    }
  }, [isConnected, sendMessage, uid]);

  useEffect(() => {
    if (lastMessage && lastMessage.data) {
      const msg = JSON.parse(lastMessage.data);
      dispatch({ type: 'UPDATE_CONTEXT', data: msg });
    };
  }, [lastMessage, dispatch])

  const doResetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const doChangeView = () => {
    dispatch({ type: 'CHANGE_VIEW' })
  };

  const doCommitShips = () => {
    const numberOfShipsPlaced = Object.keys(shipsPlaced).length;
    if (numberOfShipsPlaced === ships.length) {
      const placeShipsMessage = JSON.stringify({ action: 'SHIP_PLACEMENTS', placements: shipPlacements, uid: uid, turn: turn });
      sendMessage(placeShipsMessage);
    } else {
      alert('You must position all ships in your fleet.');
    };
  };

  const doAttackTile = (row, col) => {
    if (player !== turn) {
      alert('better take cover your adversary is about to attack!')
      return;
    };
    const placeAttackMessage = JSON.stringify({ action: 'ATTACK', row: row, col: col, uid: uid, turn: turn });
    sendMessage(placeAttackMessage);
  };

  const myAttacks = useMemo(() => {
    return createAttacksObj(myAttackPlacements);
  }, [myAttackPlacements]);

  const opponentAttacks = useMemo(() => {
    return createAttacksObj(opponentAttackPlacements);
  }, [opponentAttackPlacements]);

  return (
    <div className="game">
      <div className="match-info-container">
        <h4 className="match-info-text">Match ID:</h4>
        <p className="match-info-text match-info-data">{matchID}</p>
        <h4 className="match-info-text">Turn: </h4>
        <p className="match-info-text match-info-data">{turn}</p>
      </div>
      {view === 'P' && !shipsCommitted && <ShipSelect />}
      <div className="reset-view-div">
        <button className="reset-btn" onClick={doResetGame}>Reset Game</button>
        {shipsCommitted && <button className="view-btn" onClick={doChangeView}>{view === 'P' ? 'Attack View' : 'Fleet View'}</button>}
        {!shipsCommitted && <button className="commit-ships-btn" onClick={doCommitShips}>Commit Ships</button>}
      </div>
      <div className="board-info">
        <FleetHealth opponentAttacks={opponentAttacks} />
        {
          shipsCommitted
            ?
            (<div>
              <h4 className="view-text">{turn === player ? 'Man your battlestations!' : 'Brace for impact!'}</h4>
              <p className="view-text">{view === 'P' ? 'Your Fleet' : 'Select Attack Target'}</p>
            </div>)
            :
            (<div>
              <h4>Position your Fleet for Battle</h4>
            </div>)
        }
        {!gameOver && <h1>Game Over!</h1>}
        <FleetHealth myAttacks={myAttacks} />
      </div>
      <Board doAttackTile={doAttackTile} myAttacks={myAttacks} opponentAttacks={opponentAttacks} />
    </div>
  );
};
