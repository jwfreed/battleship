import React, { useContext, useCallback } from 'react';
import GameContext from '../../Context/GameContext';
import Ship from '../../Components/Ship/Ship';

import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  Button,
  Text,
} from 'react-native';

const styles = StyleSheet.create({
  currentOrientation: {
    fontSize: 18,
    fontWeight: "500",
    padding: 8,
  },
  orientation: {
    display: "flex",
    flexDirection: "row",
  }
})

const ShipSelect = () => {
  const { ships, selectedShip, placementOrientation, dispatch } = useContext(GameContext);

  const doSelectShip = useCallback((ship) => {
    dispatch({ type: 'SELECT_SHIP', ship });
  }, [dispatch]);

  const doChangeShipOrientation = () => {
    dispatch({ type: 'CHANGE_SHIP_ORIENTATION' });
  };

  const renderShips = useCallback(() => (
    ships.map((ship) => (
      <Ship
        key={ship.name}
        ship={ship}
        selected={selectedShip && ship.name === selectedShip.name}
        onPress={doSelectShip}
      />
    ))
  ), [ships, selectedShip, doSelectShip]);

  return (
    <SafeAreaView>
      <View>
        {renderShips()}
      </View>
      <View style={styles.orientation}>
        <Button
          onPress={doChangeShipOrientation}
          title="Orientation:"
        />
        <Text style={styles.currentOrientation}>
          {placementOrientation === 'H' ? 'Horizontal' : 'Vertical'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ShipSelect;
