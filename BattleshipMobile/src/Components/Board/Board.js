import React, {useContext, useCallback, memo} from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import Tile from '../Tile/Tile';
import GameContext from '../../Context/GameContext';
import {theme} from '../../theme';

const {width: screenWidth} = Dimensions.get('window');
const TILE_SIZE = Math.min(Math.floor((screenWidth - 60) / 10), 36);
const LABEL_WIDTH = 24;

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const Board = memo(({doAttackTile, opponentAttacks, myAttacks}) => {
  const {boardRows, boardCols, dispatch} = useContext(GameContext);

  const doPlaceShip = useCallback(
    (row, col) => {
      dispatch({type: 'PLACE_SHIP', row, col});
    },
    [dispatch],
  );

  const doAttack = useCallback(
    (row, col) => {
      doAttackTile(row, col);
    },
    [doAttackTile],
  );

  return (
    <View style={styles.boardWrapper}>
      {/* Column Numbers */}
      <View style={styles.colLabels}>
        <View style={styles.cornerCell} />
        {boardCols.map((_, colIndex) => (
          <View key={`col-${colIndex}`} style={styles.labelCell}>
            <Text style={styles.labelText}>{colIndex + 1}</Text>
          </View>
        ))}
      </View>

      {/* Grid with Row Labels */}
      <View style={styles.gridContainer}>
        {boardRows.map((rv, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.rowContainer}>
            <View style={styles.rowLabelCell}>
              <Text style={styles.labelText}>{LETTERS[rowIndex]}</Text>
            </View>
            <View style={styles.row}>
              {boardCols.map((cv, colIndex) => (
                <Tile
                  key={`${rowIndex}-${colIndex}`}
                  row={rowIndex}
                  col={colIndex}
                  onClick={doPlaceShip}
                  onAttack={doAttack}
                  myAttacks={myAttacks}
                  opponentAttacks={opponentAttacks}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  boardWrapper: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.s,
    borderRadius: theme.layout.borderRadius,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    ...theme.shadows.medium,
  },
  colLabels: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  cornerCell: {
    width: LABEL_WIDTH,
    height: 20,
  },
  labelCell: {
    width: TILE_SIZE,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: 'bold',
  },
  gridContainer: {
    borderWidth: 1,
    borderColor: theme.colors.gridLine,
    backgroundColor: theme.colors.waterDark,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  rowLabelCell: {
    width: LABEL_WIDTH,
    height: TILE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
});

export default Board;
