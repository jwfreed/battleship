import React, { useContext, useMemo, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import Board from '../../Components/Board/Board';
import ShipSelect from '../ShipSelect/ShipSelect';
import GameContext from '../../Context/GameContext';
import { createAttacksObj } from '../../Containers/Match/matchService';
import { FleetHealth } from '../../Components/FleetHealth/FleetHealth';
import './Match.css';

export const Match = () => {
  const { uid, matchID, view, shipPlacements, ships, shipsCommitted, myAttackPlacements, opponentAttackPlacements, player, turn, status, dispatch } = useContext(GameContext);

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
    if (Object.keys(shipPlacements).length === ships.length) {
      const placeShipsMessage = JSON.stringify({ action: 'SHIP_PLACEMENTS', placements: shipPlacements, uid: uid });
      sendMessage(placeShipsMessage);
    };
    return;
  };

  const doAttackTile = (row, col) => {
    if (player !== turn) {
      alert('gotta reload bro')
      return;
    };
    const placeAttackMessage = JSON.stringify({ action: 'ATTACK', row: row, col: col, uid: uid });
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
      {view === 'P' && !shipsCommitted && <ShipSelect />}
      <div className="match-info-container">
        <h4 className="match-info-text">Match ID:</h4>
        <p className="match-info-text match-info-data">{matchID}</p>
        <h4 className="match-info-text">{status}</h4>
        <h4 className="match-info-text">Turn: </h4>
        <p className="match-info-text match-info-data">{turn}</p>
      </div>
      <div className="reset-view-div">
        <button className="reset-btn" onClick={doResetGame}>Reset Game</button>
        <button className="view-btn" onClick={doChangeView}>{view === 'P' ? 'Attack View' : 'Fleet View'}</button>
        {!shipsCommitted && <button className="commit-ships-btn" onClick={doCommitShips}>Commit Ships</button>}
      </div>
      <div>{view === 'P' ? <p className="view-text">Your Fleet</p> : <p className="view-text">Select Target Tile</p>}</div>
      <div className="board-info">
        <FleetHealth opponentAttacks={opponentAttacks} />
        <Board doAttackTile={doAttackTile} myAttacks={myAttacks} opponentAttacks={opponentAttacks} />
        <FleetHealth myAttacks={myAttacks} />
      </div>
    </div>
  );
};
