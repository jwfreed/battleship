import React, { useContext, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import useWebSocket from '../../hooks/useWebSocket';
import Board from '../../Components/Board/Board';
import ShipSelect from '../ShipSelect/ShipSelect';
import GameContext from '../../Context/GameContext';
import { createAttacksObj } from '../../Context/GameActions';
import { SOCKET_URL } from '../../constants';

const Match = () => {
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

  const socketUrl = `${SOCKET_URL}/${matchID}`;
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

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
      return Alert.alert('Warning', 'You must position all ships in your fleet.');
    }
    const placeShipsMessage = JSON.stringify({ action: 'SHIP_PLACEMENTS', placements: shipPlacements, uid, turn });
    Alert.alert('Success', 'Ships Placed');
    return sendMessage(placeShipsMessage);
  };

  const doAttackTile = (row, col) => {
    if (player !== turn) {
      return Alert.alert('Warning', 'It\'s not your turn');
    }
    const placeAttackMessage = JSON.stringify({ action: 'ATTACK', row, col, uid, turn });
    return sendMessage(placeAttackMessage);
  };

  const myAttacks = useMemo(() => createAttacksObj(myAttackPlacements), [myAttackPlacements]);

  const opponentAttacks = useMemo(() => createAttacksObj(opponentAttackPlacements), [opponentAttackPlacements]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Match ID: {matchID}</Text>
        <Text style={styles.headerText}>Player: {player}</Text>
        <Text style={styles.headerText}>Turn: {turn || 'Waiting...'}</Text>
      </View>

      <Board
        doAttackTile={doAttackTile}
        myAttacks={myAttacks}
        opponentAttacks={opponentAttacks}
      />

      <View style={styles.controls}>
        {!shipsCommitted && (
          <TouchableOpacity style={styles.button} onPress={doCommitShips}>
            <Text style={styles.buttonText}>Commit Ships</Text>
          </TouchableOpacity>
        )}
        
        {shipsCommitted && (
          <TouchableOpacity style={styles.button} onPress={doChangeView}>
            <Text style={styles.buttonText}>
              View: {view === 'P' ? 'My Fleet' : 'Attacks'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={doResetGame}>
          <Text style={styles.buttonText}>Reset Game</Text>
        </TouchableOpacity>
      </View>

      {!shipsCommitted && (
        <View style={styles.shipSelectContainer}>
          <ShipSelect />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    marginBottom: 5,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#ff3b30',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  shipSelectContainer: {
    flex: 1,
  },
});

export default Match;
