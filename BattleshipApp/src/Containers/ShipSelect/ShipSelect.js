import React, { useContext, useCallback } from 'react';
import GameContext from '../../Context/GameContext';
import Ship from '../../Components/Ship/Ship';

import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

const styles = StyleSheet.create({
  orientationBtn: {
    fontSize: 18,
    color: "purple",
  },
  currentOrientation: {
    fontSize: 18,
    fontWeight: "500",
    textDecorationLine: "underline",
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
      <View>
        <TouchableOpacity onPress={doChangeShipOrientation}>
          <Text style={styles.orientationBtn}>
            Change Orientation
          </Text>
        </TouchableOpacity>
        <Text style={styles.currentOrientation}>
          {placementOrientation === 'H' ? 'Horizontal' : 'Vertical'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ShipSelect;
