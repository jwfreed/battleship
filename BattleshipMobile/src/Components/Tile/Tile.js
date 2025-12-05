import React, { useContext, useCallback, useMemo } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import GameContext from '../../Context/GameContext';

const Tile = ({ row, col, onClick, onAttack, myAttacks, opponentAttacks }) => {
  const { shipPlacements, view } = useContext(GameContext);

  const doClick = useCallback(() => {
    onClick(row, col);
  }, [row, col, onClick]);

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
    const ShipIcon = placedShip ? placedShip.img : null;
    const isHit = opponentAttempts === 'hit' || (opponentAttempts && opponentAttempts !== 'miss');
    const isMiss = opponentAttempts === 'miss';
    
    return (
      <TouchableOpacity 
        style={[
          styles.tile, 
          isHit && styles.hit, 
          isMiss && styles.miss
        ]} 
        onPress={doClick}
      >
        {ShipIcon && (
          <View style={styles.shipContainer}>
             <ShipIcon width="100%" height="100%" fill={isHit ? "red" : "black"} />
          </View>
        )}
      </TouchableOpacity>
    );
  }

  const isHit = attackAttempts === 'hit' || (attackAttempts && attackAttempts !== 'miss');
  const isMiss = attackAttempts === 'miss';

  return (
    <TouchableOpacity 
      style={[
        styles.tile, 
        isHit && styles.hit, 
        isMiss && styles.miss
      ]} 
      onPress={doAttack}
    >
      {attackAttempts && (
        <Text style={styles.attackText}>
          {isHit ? 'X' : 'O'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: 30,
    height: 30,
    borderWidth: 0.5,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f2ff',
  },
  hit: {
    backgroundColor: '#ffcccc',
  },
  miss: {
    backgroundColor: '#cccccc',
  },
  shipContainer: {
    width: '100%',
    height: '100%',
    padding: 2,
  },
  attackText: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export default Tile;
