import React, { useContext, useMemo, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { toast, Flip } from 'react-toastify';
import Board from '../../Components/Board/Board';
import ShipSelect from '../ShipSelect/ShipSelect';
import GameContext from '../../Context/GameContext';
import { createAttacksObj } from './matchService';
import FleetHealth from '../../Components/FleetHealth/FleetHealth';
import 'react-toastify/dist/ReactToastify.css';
import './Match.css';

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
    opponentShipsCommitted,
    opponentAttackPlacements,
    player,
    turn,
    gameOver,
    winner,
    dispatch
  } = useContext(GameContext);

  toast.configure({
    transition: Flip,
    autoClose: 1500,
  });

  const socketUrl = `${process.env.REACT_APP_SOCKET_URL}/${matchID}`;
  const [sendMessage, lastMessage, readyState] = useWebSocket(socketUrl);

  const isConnected = useMemo(() => readyState === 1, [readyState]);

  useEffect(() => {
    if (isConnected) {
      const authMessage = JSON.stringify({ action: 'AUTH', uid });
      sendMessage(authMessage);
    }
    if (isConnected && player) toast.info(`${player} Connected`);
    if (!isConnected && !player) toast.error('Player disconnected')
  }, [isConnected, sendMessage, player, uid]);

  useEffect(() => {
    if (lastMessage && lastMessage.data) {
      const msg = JSON.parse(lastMessage.data);
      dispatch({ type: 'UPDATE_CONTEXT', data: msg });
    }
  }, [lastMessage, dispatch]);

  const doResetGame = () => dispatch({ type: 'RESET_GAME' });

  const doChangeView = () => dispatch({ type: 'CHANGE_VIEW' })


  const doCommitShips = () => {
    const numberOfShipsPlaced = Object.keys(shipsPlaced).length;
    if (numberOfShipsPlaced < ships.length) {
      return toast.warn('You must position all ships in your fleet.')
    }

    const placeShipsMessage = JSON.stringify({ action: 'SHIP_PLACEMENTS', placements: shipPlacements, uid, turn });

    toast.success('Ships Placed');
    return sendMessage(placeShipsMessage);
  };

  const doAttackTile = (row, col) => {
    if (player !== turn) {
      return toast.warn('it\'s not your turn');
    }

    const placeAttackMessage = JSON.stringify({ action: 'ATTACK', row, col, uid, turn });
    return sendMessage(placeAttackMessage);
  };

  const myAttacks = useMemo(() => createAttacksObj(myAttackPlacements), [myAttackPlacements]);

  const opponentAttacks = useMemo(() => createAttacksObj(opponentAttackPlacements), [opponentAttackPlacements]);

  return (
    <div className="game">
      <div className="match-info-container">
        <h4 className="match-info-text">Match ID:</h4>
        <p className="match-info-text match-info-data">{matchID}</p>
        <h4 className="match-info-text">Turn: </h4>
        <p className="match-info-text match-info-data">
          {
            turn
            || (!opponentShipsCommitted && 'Waiting for ships to be positioned')
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
        <FleetHealth opponentAttacks={opponentAttacks} />
        {shipsCommitted && !gameOver && (
          <div>
            <h4 className="view-text">
              {turn === player ? `Man your battlestations, ${player}!` : `${player}, brace for impact!`}
            </h4>
            <p className="view-text">
              {view === 'P' ? 'Your Fleet' : 'Select Attack Target'}
            </p>
          </div>
        )}
        {!shipsCommitted && (
          <div>
            <h4>Position your Fleet for Battle</h4>
          </div>
        )}
        {gameOver && <h1>{winner} Wins!</h1>}
        <FleetHealth myAttacks={myAttacks} />
      </div>
      <Board doAttackTile={doAttackTile} myAttacks={myAttacks} opponentAttacks={opponentAttacks} />
    </div>
  );
};

export default Match;
