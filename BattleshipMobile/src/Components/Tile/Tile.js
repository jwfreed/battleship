import React, {useContext, useCallback, useMemo} from 'react';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import GameContext from '../../Context/GameContext';
import {theme} from '../../theme';

const Tile = ({row, col, onClick, onAttack, myAttacks, opponentAttacks}) => {
  const {shipPlacements, view} = useContext(GameContext);

  const doClick = useCallback(() => {
    onClick(row, col);
  }, [row, col, onClick]);

  const doAttack = useCallback(() => {
    onAttack(row, col);
  }, [row, col, onAttack]);

  const placedShip = useMemo(
    () => shipPlacements[row] && shipPlacements[row][col],
    [row, col, shipPlacements],
  );

  const opponentAttempts = useMemo(
    () => opponentAttacks[row] && opponentAttacks[row][col],
    [row, col, opponentAttacks],
  );

  const attackAttempts = useMemo(
    () => myAttacks[row] && myAttacks[row][col],
    [row, col, myAttacks],
  );

  if (view === 'P') {
    const ShipIcon = placedShip ? placedShip.img : null;
    const isHit =
      opponentAttempts === 'hit' ||
      (opponentAttempts && opponentAttempts !== 'miss');
    const isMiss = opponentAttempts === 'miss';

    return (
      <TouchableOpacity
        style={[
          styles.tile,
          placedShip && styles.hasShip,
          isHit && styles.hit,
          isMiss && styles.miss,
        ]}
        onPress={doClick}
        activeOpacity={0.7}>
        {ShipIcon && (
          <View style={styles.shipContainer}>
            <ShipIcon
              width="100%"
              height="100%"
              fill={isHit ? theme.colors.hit : theme.colors.shipPlaced}
            />
          </View>
        )}
        {isMiss && <View style={styles.missMarker} />}
        {isHit && <View style={styles.hitMarker} />}
      </TouchableOpacity>
    );
  }

  const isHit =
    attackAttempts === 'hit' || (attackAttempts && attackAttempts !== 'miss');
  const isMiss = attackAttempts === 'miss';
  const isUntouched = !attackAttempts;

  return (
    <TouchableOpacity
      style={[
        styles.tile,
        isUntouched && styles.attackable,
        isHit && styles.hit,
        isMiss && styles.miss,
      ]}
      onPress={doAttack}
      activeOpacity={0.7}>
      {isHit && (
        <View style={styles.hitMarker}>
          <View style={styles.hitInner} />
        </View>
      )}
      {isMiss && <View style={styles.missMarker} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: 30,
    height: 30,
    borderWidth: 0.5,
    borderColor: theme.colors.gridLine,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.water,
  },
  hasShip: {
    backgroundColor: theme.colors.waterLight,
  },
  attackable: {
    backgroundColor: theme.colors.water,
  },
  hit: {
    backgroundColor: theme.colors.hitGlow,
  },
  miss: {
    backgroundColor: theme.colors.waterDark,
  },
  shipContainer: {
    width: '100%',
    height: '100%',
    padding: 3,
  },
  hitMarker: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.hit,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.explosion,
  },
  hitInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.gold,
  },
  missMarker: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.miss,
    opacity: 0.6,
  },
});

export default Tile;
