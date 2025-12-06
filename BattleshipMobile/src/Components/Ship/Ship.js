import React, {useContext, useMemo, useCallback, memo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import GameContext from '../../Context/GameContext';
import {theme} from '../../theme';

const Ship = memo(({ship, selected, onClick}) => {
  const {shipsPlaced, dispatch} = useContext(GameContext);

  const doResetShip = useCallback(
    shipName => {
      dispatch({type: 'REMOVE_SHIP', ship: shipName});
    },
    [dispatch],
  );

  const shipOnBoard = useMemo(() => {
    const shipPlacement = shipsPlaced[ship.name];
    return !!shipPlacement;
  }, [ship.name, shipsPlaced]);

  const ShipIcon = ship.img;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.shipButton,
          selected && styles.selected,
          shipOnBoard && styles.placed,
        ]}
        onPress={() => onClick(ship)}
        activeOpacity={0.8}>
        {/* Status indicator */}
        <View
          style={[
            styles.statusDot,
            shipOnBoard ? styles.statusPlaced : styles.statusPending,
          ]}
        />

        <View style={styles.info}>
          <Text
            style={[
              styles.name,
              selected && styles.selectedText,
              shipOnBoard && styles.placedText,
            ]}>
            {ship.name.toUpperCase()}
          </Text>
          <View style={styles.sizeIndicator}>
            {Array.from({length: ship.size}).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.sizeBlock,
                  selected && styles.sizeBlockSelected,
                  shipOnBoard && styles.sizeBlockPlaced,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.iconContainer}>
          <ShipIcon
            width={36}
            height={36}
            fill={
              selected
                ? theme.colors.background
                : shipOnBoard
                ? theme.colors.success
                : theme.colors.ship
            }
          />
        </View>
      </TouchableOpacity>

      {shipOnBoard && (
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => doResetShip(ship.name)}>
          <Text style={styles.resetText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xs,
  },
  shipButton: {
    flex: 1,
    flexDirection: 'row',
    padding: theme.spacing.s,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.layout.borderRadius,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  selected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  placed: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.surface,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.s,
  },
  statusPending: {
    backgroundColor: theme.colors.warning,
  },
  statusPlaced: {
    backgroundColor: theme.colors.success,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 13,
    color: theme.colors.text,
    letterSpacing: 1,
    marginBottom: 4,
  },
  selectedText: {
    color: theme.colors.background,
  },
  placedText: {
    color: theme.colors.success,
  },
  sizeIndicator: {
    flexDirection: 'row',
    gap: 2,
  },
  sizeBlock: {
    width: 12,
    height: 6,
    backgroundColor: theme.colors.textMuted,
    borderRadius: 2,
  },
  sizeBlockSelected: {
    backgroundColor: theme.colors.background,
  },
  sizeBlockPlaced: {
    backgroundColor: theme.colors.success,
  },
  iconContainer: {
    marginLeft: theme.spacing.s,
  },
  resetButton: {
    marginLeft: theme.spacing.s,
    width: 36,
    height: 36,
    backgroundColor: theme.colors.error,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Ship;
