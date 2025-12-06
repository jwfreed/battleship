import React, { useContext, useMemo, useEffect, useCallback, memo } from 'react';
import useWebSocket from 'react-use-websocket';
import { toast, ToastContainer, Flip } from 'react-toastify';
import Board from '../../Components/Board/Board';
import ShipSelect from '../ShipSelect/ShipSelect';
import GameContext from '../../Context/GameContext';
import { createAttacksObj } from './matchService';
import FleetHealth from '../../Components/FleetHealth/FleetHealth';
import 'react-toastify/dist/ReactToastify.css';
import './Match.css';

export const Match = memo(() => {
  const {
    uid,
    matchID,
    view,
    shipPlacements,
    ships,
    shipsPlaced,
    shipsCommitted,
    myAttackPlacements,
    opponentShipsCommitted,
    opponentAttackPlacements,
    player,
    turn,
    gameOver,
    winner,
    pendingViewChange,
    dispatch
  } = useContext(GameContext);

  const socketUrl = `${import.meta.env.VITE_SOCKET_URL}/${matchID}`;
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const isConnected = useMemo(() => readyState === 1, [readyState]);

  useEffect(() => {
    if (isConnected) {
      const authMessage = JSON.stringify({ action: 'AUTH', uid });
      sendMessage(authMessage);
    }
  }, [isConnected, sendMessage, uid]);

  // Separate effect for connection status notifications
  useEffect(() => {
    if (isConnected && player) {
      toast.info(`${player} Connected`);
    }
    // Only show disconnect if we previously had a player and connection
    if (!isConnected && player) {
      toast.error('Player disconnected');
    }
  }, [isConnected, player]);

  useEffect(() => {
    if (lastMessage && lastMessage.data) {
      const msg = JSON.parse(lastMessage.data);
      dispatch({ type: 'UPDATE_CONTEXT', data: msg });
    }
  }, [lastMessage, dispatch]);

  // Handle delayed view change after attack results are shown
  useEffect(() => {
    if (pendingViewChange) {
      const timer = setTimeout(() => {
        dispatch({ type: 'APPLY_PENDING_VIEW' });
      }, 2000); // 2 second delay to see attack result
      return () => clearTimeout(timer);
    }
  }, [pendingViewChange, dispatch]);

  const doResetGame = useCallback(() => dispatch({ type: 'RESET_GAME' }), [dispatch]);

  const doChangeView = useCallback(() => dispatch({ type: 'CHANGE_VIEW' }), [dispatch]);

  const doCommitShips = useCallback(() => {
    const numberOfShipsPlaced = Object.keys(shipsPlaced).length;
    if (numberOfShipsPlaced < ships.length) {
      return toast.warn('You must position all ships in your fleet.')
    }
    const placeShipsMessage = JSON.stringify({ action: 'SHIP_PLACEMENTS', placements: shipPlacements, uid });
    toast.success('Ships Placed');
    return sendMessage(placeShipsMessage);
  }, [shipsPlaced, ships, shipPlacements, uid, sendMessage]);

  const doAttackTile = useCallback((row, col) => {
    console.log('doAttackTile called', { row, col, player, turn, comparison: player === turn });
    if (player !== turn) {
      return toast.warn('it\'s not your turn');
    }
    const placeAttackMessage = JSON.stringify({ action: 'ATTACK', row, col, uid });
    console.log('Sending attack message:', placeAttackMessage);
    return sendMessage(placeAttackMessage);
  }, [player, turn, uid, sendMessage]);

  const myAttacks = useMemo(() => createAttacksObj(myAttackPlacements), [myAttackPlacements]);

  const opponentAttacks = useMemo(() => createAttacksObj(opponentAttackPlacements), [opponentAttackPlacements]);

  // Add defensive check to prevent blank screen
  if (!matchID) {
    return <div className="game">Loading match...</div>;
  }

  return (
    <div className="game">
      <p className="ready-player">{`Ready ${player || 'Loading...'}`}</p>
      <div className="match-info-container">
        <h4 className="match-info-text">Match ID:</h4>
        <p className="match-info-text match-info-data" >{matchID}</p>
        <h4 className="match-info-text">Turn: </h4>
        <p className="match-info-text match-info-data">
          {
            turn
            || (!opponentShipsCommitted && 'Awaiting all players to position ships')
            || 'Opponent placed ships, waiting for you'
          }
        </p>
      </div>
      {view === 'P' && !shipsCommitted && <ShipSelect />}
      <div className="reset-view-div">
        <button className="reset-btn" onClick={doResetGame}>
          Reset Game
        </button>
        {shipsCommitted && (
          <button className="view-btn" onClick={doChangeView}>
            {view === 'P' ? 'Attack' : 'View Fleet'}
          </button>
        )}
        {!shipsCommitted && (
          <button className="commit-ships-btn" onClick={doCommitShips}>
            Commit Ships
          </button>
        )}
      </div>
      <div className="board-info">
        <div className="game-prompt">
          {!gameOver && (
            <div>
              {shipsCommitted && opponentShipsCommitted &&
                (<h4 className="view-text">
                  {turn === player ? `Man your battlestations, ${player}!` : `${player}, brace for impact!`}
                </h4>) ||
                <p className="view-text">The quiet before the storm...</p>
              }
              {shipsCommitted &&
                <div className="fleet-health-container">
                  <FleetHealth opponentAttacks={opponentAttacks} />
                  <FleetHealth myAttacks={myAttacks} />
                </div>
              }
              <p className="view-text">
                {view === 'P' ? 'Fleet View' : 'Select Attack Target'}
              </p>
            </div>
          )}
          {gameOver && <h1>{winner} Wins!</h1>}
        </div>
      </div>
      <Board doAttackTile={doAttackTile} myAttacks={myAttacks} opponentAttacks={opponentAttacks} />
      <ToastContainer
        transition={Flip}
        autoClose={1500}
        position="top-center"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
});

Match.displayName = 'Match';

export default Match;
