import React, { useContext, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Tile from '../Tile/Tile';
import GameContext from '../../Context/GameContext';

const Board = ({ doAttackTile, opponentAttacks, myAttacks }) => {
  const { boardRows, boardCols, dispatch } = useContext(GameContext);

  const doPlaceShip = useCallback((row, col) => {
    dispatch({ type: 'PLACE_SHIP', row, col });
  }, [dispatch]);

  const doAttack = useCallback((row, col) => {
    doAttackTile(row, col);
  }, [doAttackTile]);

  return (
    <View style={styles.boardContainer}>
      <ScrollView horizontal>
        <View style={styles.board}>
          {
            boardRows.map((rv, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.row}>
                {boardCols.map((cv, colIndex) => (
                  <Tile
                    key={`${rowIndex}-${colIndex}`}
                    row={rowIndex}
                    col={colIndex}
                    onClick={doPlaceShip}
                    onAttack={doAttack}
                    myAttacks={myAttacks}
                    opponentAttacks={opponentAttacks} />
                ))}
              </View>
            ))
          }
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  board: {
    borderWidth: 1,
    borderColor: '#000',
  },
  row: {
    flexDirection: 'row',
  },
});

export default Board;
