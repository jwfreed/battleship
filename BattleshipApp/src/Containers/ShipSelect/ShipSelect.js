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
    fontSize: 17,
    color: "purple",
  },
  currentOrientation: {
    fontSize: 17,
    fontWeight: "500",
  },
  orientation: {
    display: "flex",
    flexDirection: "row",
    padding: 3,
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
        <TouchableOpacity onPress={doChangeShipOrientation}>
          <Text style={styles.orientationBtn}>
            Orientation:
          </Text>
        </TouchableOpacity>
        <Text style={styles.currentOrientation}>
          {placementOrientation === 'H' ? ' Horizontal' : ' Vertical'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ShipSelect;
