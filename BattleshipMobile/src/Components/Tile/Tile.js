import React, {useContext, useCallback, useMemo, memo} from 'react';
import {TouchableOpacity, StyleSheet, View, Dimensions} from 'react-native';
import GameContext from '../../Context/GameContext';
import {theme} from '../../theme';

// Import ship SVGs for lookup by name
import Carrier from '../../assets/Carrier.svg';
import Battleship from '../../assets/Battleship.svg';
import Cruiser from '../../assets/Cruiser.svg';
import Submarine from '../../assets/sub.svg';
import Destroyer from '../../assets/Destroyer.svg';

// Map ship names to their SVG components
const shipIcons = {
  Carrier,
  Battleship,
  Cruiser,
  Submarine,
  Destroyer,
};

const {width: screenWidth} = Dimensions.get('window');
const TILE_SIZE = Math.min(Math.floor((screenWidth - 60) / 10), 36); // Max 36, responsive to screen

const Tile = memo(({row, col, onClick, onAttack, myAttacks, opponentAttacks}) => {
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
    // Look up ship icon by name instead of using placedShip.img (which may be serialized as string)
    const ShipIcon = placedShip ? shipIcons[placedShip.name] : null;
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
});

const styles = StyleSheet.create({
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
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
    padding: 2,
  },
  hitMarker: {
    width: TILE_SIZE * 0.55,
    height: TILE_SIZE * 0.55,
    borderRadius: TILE_SIZE * 0.275,
    backgroundColor: theme.colors.hit,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.explosion,
  },
  hitInner: {
    width: TILE_SIZE * 0.2,
    height: TILE_SIZE * 0.2,
    borderRadius: TILE_SIZE * 0.1,
    backgroundColor: theme.colors.gold,
  },
  missMarker: {
    width: TILE_SIZE * 0.3,
    height: TILE_SIZE * 0.3,
    borderRadius: TILE_SIZE * 0.15,
    backgroundColor: theme.colors.miss,
    opacity: 0.6,
  },
});

export default Tile;
