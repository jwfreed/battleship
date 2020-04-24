import React, { useContext, useCallback } from 'react';
import Tile from '../Tile/Tile';
import PropTypes from 'prop-types';
import GameContext from '../../Context/GameContext';

import {
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

const Board = ({ doAttackTile, opponentAttacks, myAttacks }) => {
  const { boardRows, boardCols, dispatch } = useContext(GameContext);
  const windowWidth = useWindowDimensions().width;

  const styles = StyleSheet.create({
    grid: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
      width: windowWidth,
    }
  });

  const doPlaceShip = useCallback((row, col) => {
    dispatch({ type: 'PLACE_SHIP', row, col });
  }, [dispatch]);

  const doAttack = useCallback((row, col) => {
    doAttackTile(row, col);
  }, [doAttackTile]);

  const tiles = () => boardRows.map((rv, rowIndex) => (
    boardCols.map((cv, colIndex) => (
      <Tile
        key={`${rowIndex}-${colIndex}`}
        row={rowIndex}
        col={colIndex}
        onPress={doPlaceShip}
        onAttack={doAttack}
        myAttacks={myAttacks}
        opponentAttacks={opponentAttacks} />
    ))
  ));

  return (
    <SafeAreaView style={styles.grid}>
      {tiles()}
    </SafeAreaView>
  );
};

Board.propTypes = {
  doAttackTile: PropTypes.func.isRequired,
  opponentAttacks: PropTypes.object,
  myAttacks: PropTypes.object,
};


export default Board;
