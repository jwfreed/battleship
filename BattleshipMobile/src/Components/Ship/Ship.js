import React, { useContext, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import GameContext from '../../Context/GameContext';

const Ship = ({ ship, selected, onClick }) => {
  const { shipsPlaced, dispatch } = useContext(GameContext);

  const doResetShip = (shipName) => {
    dispatch({ type: 'REMOVE_SHIP', ship: shipName });
  };

  const shipOnBoard = useMemo(() => {
    const shipPlacement = shipsPlaced[ship.name];
    return !!shipPlacement;
  }, [ship.name, shipsPlaced]);

  const ShipIcon = ship.img;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.shipButton, selected && styles.selected]} 
        onPress={() => onClick(ship)}
      >
        <View style={styles.info}>
          <Text style={styles.name}>
            {ship.name} {selected ? '*' : ''}
          </Text>
          <Text style={styles.length}>
            Length: {ship.size}
          </Text>
        </View>
        <View style={styles.iconContainer}>
            <ShipIcon width={40} height={40} />
        </View>
      </TouchableOpacity>
      {shipOnBoard && (
        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={() => doResetShip(ship.name)}
        >
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      )}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    width: '100%',
  },
  shipButton: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selected: {
    backgroundColor: '#d0e0ff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  length: {
    fontSize: 12,
    color: '#666',
  },
  iconContainer: {
    marginLeft: 10,
  },
  resetButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#ff3b30',
    borderRadius: 5,
  },
  resetText: {
    color: 'white',
    fontSize: 12,
  }
});

export default Ship;
