import React, { useContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../Context/GameContext';

import {
  Button,
  TouchableOpacity,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

const Tile = ({ row, col, onPress, onAttack, myAttacks, opponentAttacks }) => {
  const { shipPlacements, view } = useContext(GameContext);
  const windowWidth = useWindowDimensions().width;

  const styles = StyleSheet.create({
    tile: {
      width: windowWidth / 10,
      height: windowWidth / 10,
      borderColor: "black",
      alignItems: "center",
    }
  });

  const doPress = useCallback(() => {
    onPress(row, col);
  }, [row, col, onPress]);

  const doAttack = useCallback(() => {
    onAttack(row, col);
  }, [row, col, onAttack]);

  const placedShip = useMemo(() => (
    shipPlacements[row] && shipPlacements[row][col]
  ), [row, col, shipPlacements]);

  const opponentAttempts = useMemo(() => (
    opponentAttacks[row] && opponentAttacks[row][col]
  ), [row, col, opponentAttacks]);

  const attackAttempts = useMemo(() => (
    myAttacks[row] && myAttacks[row][col]
  ), [row, col, myAttacks]);

  if (view === 'P') {
    return (
      <TouchableOpacity style={styles.tile} onPress={doPress}>
        <Text>
          {(placedShip && placedShip.name) || (opponentAttempts && '*') || '-'}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.tile} onPress={doAttack}>
      <Text>
        {attackAttempts || '-'}
      </Text>
    </TouchableOpacity>
  );
};


Tile.propTypes = {
  row: PropTypes.number,
  col: PropTypes.number,
  myAttacks: PropTypes.object,
  opponentAttacks: PropTypes.object,
  onPress: PropTypes.func.isRequired,
  onAttack: PropTypes.func.isRequired,
};

export default Tile;