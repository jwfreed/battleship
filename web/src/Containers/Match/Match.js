import React, { useContext, useMemo, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import Board from '../../Components/Board/Board';
import ShipSelect from '../ShipSelect/ShipSelect';
import GameContext from '../../Context/GameContext';
import { createAttacksObj } from './matchService';
import { FleetHealth } from '../../Components/FleetHealth/FleetHealth';
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
    dispatch,
  } = useContext(GameContext);

  const socketUrl = `${process.env.REACT_APP_SOCKET_URL}/${matchID}`;
  const [sendMessage, lastMessage, readyState] = useWebSocket(socketUrl);

  const isConnected = useMemo(() => readyState === 1, [readyState]);

  useEffect(() => {
    if (isConnected) {
      const authMessage = JSON.stringify({ action: 'AUTH', uid });
      sendMessage(authMessage);
    }
  }, [isConnected, sendMessage, uid]);

  useEffect(() => {
    if (lastMessage && lastMessage.data) {
      const msg = JSON.parse(lastMessage.data);
      dispatch({ type: 'UPDATE_CONTEXT', data: msg });
    }
  }, [lastMessage, dispatch]);

  const doResetGame = () => dispatch({ type: 'RESET_GAME' });

  const doChangeView = () => dispatch({ type: 'CHANGE_VIEW' });

  const doCommitShips = () => {
    const numberOfShipsPlaced = Object.keys(shipsPlaced).length;
    if (numberOfShipsPlaced < ships.length) {
      return alert('You must position all ships in your fleet.'); // eslint-disable-line
    }

    const placeShipsMessage = JSON.stringify({ action: 'SHIP_PLACEMENTS', placements: shipPlacements, uid, turn });
    return sendMessage(placeShipsMessage);
  };

  const doAttackTile = (row, col) => {
    if (player !== turn) {
      return alert('it\'s not your turn'); // eslint-disable-line
    }

    const placeAttackMessage = JSON.stringify({ action: 'ATTACK', row, col, uid, turn });
    return sendMessage(placeAttackMessage);
  };

  const myAttacks = useMemo(() => createAttacksObj(myAttackPlacements), [myAttackPlacements]);

  const opponentAttacks = useMemo(
    () => createAttacksObj(opponentAttackPlacements),
    [opponentAttackPlacements],
  );

  return (
    <div className="game">
      <div className="match-info-container">
        <h4 className="match-info-text">Match ID:</h4>
        <p className="match-info-text match-info-data">{matchID}</p>
        <h4 className="match-info-text">Turn: </h4>
        <p className="match-info-text match-info-data">
          {
            turn
            || (!opponentShipsCommitted && 'Waiting for ships placements')
            || 'Opponent placed his ships, waiting for you'
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
            {view === 'P' ? 'Attack View' : 'Fleet View'}
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
        {shipsCommitted && (
          <div>
            <h4 className="view-text">
              {turn === player ? 'Man your battlestations!' : 'Brace for impact!'}
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
        {gameOver && <h1>Game Over!</h1>}
        <FleetHealth myAttacks={myAttacks} />
      </div>
      <Board doAttackTile={doAttackTile} myAttacks={myAttacks} opponentAttacks={opponentAttacks} />
    </div>
  );
};

export default Match;
