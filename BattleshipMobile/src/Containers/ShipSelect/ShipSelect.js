import React, { useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import GameContext from '../../Context/GameContext';
import Ship from '../../Components/Ship/Ship';

const ShipSelect = () => {
  const { ships, selectedShip, placementOrientation, dispatch } = useContext(GameContext);

  const doSelectShip = useCallback((ship) => {
    dispatch({ type: 'SELECT_SHIP', ship });
  }, [dispatch]);

  const doChangeShipOrientation = () => {
    dispatch({ type: 'CHANGE_SHIP_ORIENTATION' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.orientationContainer}>
        <TouchableOpacity style={styles.orientationButton} onPress={doChangeShipOrientation}>
          <Text style={styles.buttonText}>Toggle Orientation</Text>
        </TouchableOpacity>
        <Text style={styles.orientationText}>
          {placementOrientation === 'H' ? 'Horizontal' : 'Vertical'}
        </Text>
      </View>
      
      <ScrollView style={styles.shipsList}>
        {ships.map((ship) => (
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  orientationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orientationButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  orientationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  shipsList: {
    flex: 1,
  },
});

export default ShipSelect;
