import React, { useContext, useMemo, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import Board from '../../Components/Board/Board';
import ShipSelect from '../ShipSelect/ShipSelect';
import GameContext from '../../Context/GameContext';
import { createAttacksObj } from './matchService';
import FleetHealth from '../../Components/FleetHealth/FleetHealth';

import {
  StyleSheet,
  SafeAreaView,
  View,
  Button,
  Text,
} from 'react-native';

const styles = StyleSheet.create({
  btns: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
  }
})

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

  const socketUrl = `ws://localhost:3001/match/${matchID}`;
  const [sendMessage, lastMessage, readyState] = useWebSocket(socketUrl);

  const isConnected = useMemo(() => readyState === 1, [readyState]);

  useEffect(() => {
    if (isConnected) {
      const authMessage = JSON.stringify({ action: 'AUTH', uid });
      sendMessage(authMessage);
    }
    if (isConnected && player) alert(`${player} Connected`);
    if (!isConnected && !player) alert('Player disconnected');
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
      return alert('You must position all ships in your fleet.');
    }

    const placeShipsMessage = JSON.stringify({ action: 'SHIP_PLACEMENTS', placements: shipPlacements, uid, turn });

    alert('Ships Placed');
    return sendMessage(placeShipsMessage);
  };

  const doAttackTile = (row, col) => {
    if (player !== turn) {
      return alert('it\'s not your turn');
    }

    const placeAttackMessage = JSON.stringify({ action: 'ATTACK', row, col, uid, turn });
    return sendMessage(placeAttackMessage);
  };

  const myAttacks = useMemo(() => createAttacksObj(myAttackPlacements), [myAttackPlacements]);

  const opponentAttacks = useMemo(() => createAttacksObj(opponentAttackPlacements), [opponentAttackPlacements]);

  return (
    <SafeAreaView>
      <View >
        <Text >Match ID: {matchID}</Text>
        <Text>
          Turn: {
            turn
            || (!opponentShipsCommitted && 'Waiting for ships to be positioned')
            || 'Opponent placed ships, waiting for you'
          }
        </Text>
      </View>
      {view === 'P' && !shipsCommitted && <ShipSelect />}
      <View style={styles.btns}>
        <Button
          onPress={doResetGame}
          title="Reset Game"
        />
        {shipsCommitted && (
          <Button
            onPress={doChangeView}
            title={view === 'P' ? 'Attack View' : 'Fleet View'}
          />
        )}
        {!shipsCommitted && (
          <Button onPress={doCommitShips}
            title="Commit Ships"
          />
        )}
      </View>
      <View>
        {shipsCommitted && !gameOver && (
          <View>
            <Text>
              {turn === player ? `Man your battlestations, ${player}!` : `${player}, brace for impact!`}
            </Text>
            <Text>
              {view === 'P' ? 'Your Fleet' : 'Select Attack Target'}
            </Text>
          </View>
        )}
        {!shipsCommitted && (
          <View>
            <Text>Position your Fleet for Battle</Text>
          </View>
        )}
        <Text>
          {gameOver && <h1>{winner} Wins!</h1>}
        </Text>
      </View>
      <View>
        <FleetHealth myAttacks={myAttacks} />
        <FleetHealth opponentAttacks={opponentAttacks} />
      </View>
      <Board doAttackTile={doAttackTile} myAttacks={myAttacks} opponentAttacks={opponentAttacks} />
    </SafeAreaView>
  );
};



export default Match;
