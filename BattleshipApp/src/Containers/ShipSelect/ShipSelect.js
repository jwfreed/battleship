import React, { useContext, useCallback } from 'react';
import GameContext from '../../Context/GameContext';
import Ship from '../../Components/Ship/Ship';

import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

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
      <View className="orientation-div">
        <TouchableOpacity className="orientation-btn" onPress={doChangeShipOrientation}>
          <Text>
            Orientation
          </Text>
        </TouchableOpacity>
        <Text className="current-orientation">
          {placementOrientation === 'H' ? 'Horizontal' : 'Vertical'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ShipSelect;
