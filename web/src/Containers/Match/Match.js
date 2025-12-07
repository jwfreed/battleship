import React, { useContext, useMemo, useEffect, useCallback, memo } from 'react';
import useWebSocket from 'react-use-websocket';
import { toast, ToastContainer, Flip } from 'react-toastify';
import Board from '../../Components/Board/Board';
import ShipSelect from '../ShipSelect/ShipSelect';
import GameContext from '../../Context/GameContext';
import { createAttacksObj } from './matchService';
import FleetHealth from '../../Components/FleetHealth/FleetHealth';
import {
  CrosshairsIcon,
  AnchorIcon,
  RadarIcon,
  FleetIcon,
  ExitIcon,
  HitIcon,
  MissIcon,
  YourTurnIcon,
  OpponentTurnIcon,
} from '../../Components/Icons/Icons';
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
    return <div className="loading-container">Loading match...</div>;
  }

  const getTurnMeta = () => {
    if (!turn) return { label: 'WAITING FOR OPPONENT', Icon: OpponentTurnIcon };
    return turn === player
      ? { label: 'YOUR TURN', Icon: YourTurnIcon }
      : { label: "OPPONENT'S TURN", Icon: OpponentTurnIcon };
  };

  const { label: turnLabel, Icon: TurnIcon } = getTurnMeta();

  return (
    <div className="game">
      {/* Status Bar */}
      <div className="status-bar">
        <div 
          className="status-item" 
          onClick={() => { navigator.clipboard.writeText(matchID); toast.success('Match ID copied!', { autoClose: 1500 }); }}
          title="Click to copy"
        >
          <span className="status-label">MATCH ID</span>
          <span className="status-value">{matchID}</span>
        </div>
        <div 
          className="status-item"
          onClick={() => { navigator.clipboard.writeText(uid); toast.success('Player ID copied!', { autoClose: 1500 }); }}
          title="Click to copy"
        >
          <span className="status-label">PLAYER ID</span>
          <span className="status-value">{uid}</span>
        </div>
        <div className="connection-indicator">
          <div className={`connection-dot ${isConnected ? 'connected' : ''}`} />
          <span className="connection-text">{isConnected ? 'LIVE' : 'CONNECTING'}</span>
        </div>
      </div>

      {/* Turn Indicator */}
      <div className="turn-container">
        <div className={`turn-indicator ${turn === player ? 'your-turn' : ''}`}>
          <div className="turn-label-row">
            {TurnIcon ? <TurnIcon size={18} className="turn-icon" /> : null}
            <p className="turn-label">{turnLabel}</p>
          </div>
        </div>
        <div className="player-badge">
          <p className="player-text">{player || 'JOINING...'}</p>
        </div>
      </div>

      {/* Game Over or Board Section */}
      {gameOver ? (
        <div className="game-over-container">
          <h1 className="game-over-title">🏆 {winner} WINS!</h1>
          <button className="btn commit-btn" onClick={doResetGame}>
            🎮 PLAY AGAIN
          </button>
        </div>
      ) : (
        <>
          {/* Board Section */}
          <div className="board-section">
            <div className="view-label">
              {view === 'P' ? <FleetIcon size={18} /> : <RadarIcon size={18} />}
              <span className="view-label-text">
                {view === 'P' ? 'YOUR FLEET' : 'ATTACK MAP'}
              </span>
            </div>
            <Board doAttackTile={doAttackTile} myAttacks={myAttacks} opponentAttacks={opponentAttacks} />
          </div>

          {/* Fleet Health */}
          {shipsCommitted && (
            <div className="fleet-health-section">
              <FleetHealth opponentAttacks={opponentAttacks} />
              <FleetHealth myAttacks={myAttacks} />
            </div>
          )}

          {/* Controls */}
          <div className="controls">
            {!shipsCommitted ? (
              <button className="btn commit-btn" onClick={doCommitShips}>
                <AnchorIcon size={18} />
                DEPLOY FLEET
              </button>
            ) : (
              <button className="btn view-btn" onClick={doChangeView}>
                {view === 'P' ? <CrosshairsIcon size={18} /> : <AnchorIcon size={18} />}
                {view === 'P' ? 'ATTACK VIEW' : 'FLEET VIEW'}
              </button>
            )}
            <button className="reset-btn" onClick={doResetGame} title="Leave Game">
              <ExitIcon size={16} />
              EXIT
            </button>
          </div>

          {/* Ship Select */}
          {!shipsCommitted && (
            <div className="ship-select-container">
              <ShipSelect />
            </div>
          )}
        </>
      )}

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
