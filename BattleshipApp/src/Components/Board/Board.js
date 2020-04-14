import React, { useContext, useCallback } from 'react';
import Tile from '../Tile/Tile';
import PropTypes from 'prop-types';
import GameContext from '../../Context/GameContext';

import {
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';

const Board = ({ doAttackTile, opponentAttacks, myAttacks }) => {
  const { boardRows, boardCols, dispatch } = useContext(GameContext);

  const doPlaceShip = useCallback((row, col) => {
    dispatch({ type: 'PLACE_SHIP', row, col });
  }, [dispatch]);

  const doAttack = useCallback((row, col) => {
    doAttackTile(row, col);
  }, [doAttackTile]);

  return (
    <SafeAreaView className="board">
      <ScrollView>
        {
          boardRows.map((rv, rowIndex) => (
            <View key={`row-${rowIndex}`} className="boardRow">
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
      </ScrollView>
    </SafeAreaView>
  );
};

Board.propTypes = {
  doAttackTile: PropTypes.func.isRequired,
  opponentAttacks: PropTypes.object,
  myAttacks: PropTypes.object,
};

export default Board;
