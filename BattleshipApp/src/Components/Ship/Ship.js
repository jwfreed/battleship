import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../Context/GameContext';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

const styles = StyleSheet.create({
  shipName: {
    fontSize: 17,
    paddingHorizontal: 5,
    paddingBottom: 2,
  },
});

const Ship = ({ ship, selected, onPress }) => {
  const { shipsPlaced, dispatch } = useContext(GameContext);

  const doResetShip = (ship) => {
    dispatch({ type: 'REMOVE_SHIP', ship });
  };

  const shipOnBoard = useMemo(() => {
    const shipPlacement = shipsPlaced[ship.name];
    return !!shipPlacement;
  }, [ship.name, shipsPlaced]);

  return (
    <View>
      <TouchableOpacity onPress={() => onPress(ship)}>
        <Text style={styles.shipName}>
          {ship.name} {selected ? '*' : ''} -  Length: {ship.size} Tiles
        </Text>
      </TouchableOpacity>
      {shipOnBoard && <TouchableOpacity onPress={() => doResetShip(ship.name)}><Text style={styles.shipName}>Reset {ship.name}</Text></TouchableOpacity>}
    </View>
  )
};

Ship.propTypes = {
  ship: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

export default Ship;
