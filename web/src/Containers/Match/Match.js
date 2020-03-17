import React, { useContext, useMemo, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import Board from '../../Components/Board/Board';
import ShipSelect from '../ShipSelect/ShipSelect';
import GameContext from '../../Context/GameContext';

export const Match = () => {
  const { uid, matchID, view, shipPlacements, dispatch } = useContext(GameContext);

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
    const placeShipsMessage = JSON.stringify({ action: 'SHIP_PLACEMENTS', placements: shipPlacements, uid: uid });
    sendMessage(placeShipsMessage);
  };

  const doAttackTile = (row, col) => {
    const placeAttackMessage = JSON.stringify({ action: 'ATTACK', row: row, col: col, uid: uid });
    sendMessage(placeAttackMessage);
  };

  return (
    <div>
      {view === 'P' && <ShipSelect />}
      <div className="reset-view-div">
        <button className="reset-btn" onClick={doResetGame}>Reset Game</button>
        <button className="view-btn" onClick={doChangeView}>Board View</button>
        <button className="commit-ships-btn" onClick={doCommitShips}>Commit Ships</button>
      </div>
      <div>{view === 'P' ? <p className="view-text">Place Ships</p> : <p className="view-text">Attack</p>}</div>
      <Board doAttackTile={doAttackTile} />
    </div>
  );
};