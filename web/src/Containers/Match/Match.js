import React, { useContext, useMemo, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import Board from '../../Components/Board/Board';
import ShipSelect from '../ShipSelect/ShipSelect';
import GameContext from '../../Context/GameContext';

export const Match = () => {
  const { uid, matchID, view, shipPlacements, dispatch } = useContext(GameContext);

  const [message, setMessage] = useState('');

  const socketUrl = `ws://localhost:3001/match/${matchID}`;
  const [sendMessage, lastMessage, readyState] = useWebSocket(socketUrl);

  const isConnected = useMemo(() => readyState === 1, [readyState]);

  useEffect(() => {
    if (isConnected) {
      const authMessage = JSON.stringify({ action: 'auth', id: uid });
      sendMessage(authMessage)
    }
  }, [isConnected, sendMessage, uid]);

  useEffect(() => {
    if (lastMessage && lastMessage.data) {
      if (lastMessage.data === 'hit!' || lastMessage.data === 'miss!' || lastMessage.data === 'opponent connected') {
        setMessage(lastMessage.data);
      } else {
        const data = JSON.parse(lastMessage.data);
        console.log(data)
        dispatch({ type: 'ATTACK', action: data });
      };
    };
  }, [lastMessage, dispatch])

  const doResetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const doChangeView = () => {
    dispatch({ type: 'CHANGE_VIEW' })
  };

  const doCommitShips = () => {
    const placeShipsMessage = JSON.stringify({ action: 'shipPlacement', placements: shipPlacements });
    sendMessage(placeShipsMessage);
  };

  const doAttackTile = (row, col) => {
    const placeAttackMessage = JSON.stringify({ action: 'attackPlacement', attackPlacement: [row, col] });
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
      <div>{message}</div>
      <Board doAttackTile={doAttackTile} />
    </div>
  );
};