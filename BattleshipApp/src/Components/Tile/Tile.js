import React, { useContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../Context/GameContext';

import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

const Tile = ({ row, col, onPress, onAttack, myAttacks, opponentAttacks }) => {
  const { shipPlacements, view } = useContext(GameContext);

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
    <TouchableOpacity className="tile attack-view" onPress={doAttack}>
      <Text>
        {attackAttempts || '-'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: 40,
    height: 40,
    borderColor: "black",
  }
})

Tile.propTypes = {
  row: PropTypes.number,
  col: PropTypes.number,
  myAttacks: PropTypes.object,
  opponentAttacks: PropTypes.object,
  onPress: PropTypes.func.isRequired,
  onAttack: PropTypes.func.isRequired,
};

export default Tile;