import React, {useContext, useCallback, memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import GameContext from '../../Context/GameContext';
import Ship from '../../Components/Ship/Ship';
import {theme} from '../../theme';

const ShipSelect = memo(() => {
  const {ships, selectedShip, placementOrientation, shipsPlaced, dispatch} =
    useContext(GameContext);

  const placedCount = Object.keys(shipsPlaced).length;
  const totalShips = ships.length;

  const doSelectShip = useCallback(
    ship => {
      dispatch({type: 'SELECT_SHIP', ship});
    },
    [dispatch],
  );

  const doChangeShipOrientation = useCallback(() => {
    dispatch({type: 'CHANGE_SHIP_ORIENTATION'});
  }, [dispatch]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>DEPLOY YOUR FLEET</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {placedCount}/{totalShips} SHIPS PLACED
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {width: `${(placedCount / totalShips) * 100}%`},
              ]}
            />
          </View>
        </View>
      </View>

      {/* Orientation Toggle */}
      <TouchableOpacity
        style={styles.orientationButton}
        onPress={doChangeShipOrientation}>
        <Text style={styles.orientationIcon}>
          {placementOrientation === 'H' ? '↔️' : '↕️'}
        </Text>
        <Text style={styles.orientationText}>
          {placementOrientation === 'H' ? 'HORIZONTAL' : 'VERTICAL'}
        </Text>
        <Text style={styles.tapHint}>TAP TO CHANGE</Text>
      </TouchableOpacity>

      {/* Ships List */}
      <ScrollView
        style={styles.shipsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.shipsListContent}>
        {ships.map(ship => (
          <Ship
            key={ship.name}
            ship={ship}
            selected={selectedShip && ship.name === selectedShip.name}
            onClick={doSelectShip}
          />
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.m,
  },
  header: {
    marginBottom: theme.spacing.m,
  },
  title: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: theme.spacing.s,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: 2,
  },
  orientationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceLight,
    padding: theme.spacing.s,
    borderRadius: theme.layout.borderRadius,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  orientationIcon: {
    fontSize: 20,
    marginRight: theme.spacing.s,
  },
  orientationText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  tapHint: {
    color: theme.colors.textMuted,
    fontSize: 10,
    marginLeft: theme.spacing.m,
    letterSpacing: 1,
  },
  shipsList: {
    flex: 1,
  },
  shipsListContent: {
    paddingBottom: theme.spacing.m,
  },
});

export default ShipSelect;
