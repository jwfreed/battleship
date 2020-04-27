import React, { useContext, memo, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../Context/GameContext';
import { shipHits } from './fleetHealthService';

import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-between"
  }
})

const FleetHealth = memo((attacks) => {
  const { ships, player, dispatch } = useContext(GameContext);
  const title = (Object.keys(attacks).includes('myAttacks') && 'Opponent Fleet Health') || `${player} Fleet Health`;

  const hits = shipHits(attacks);
  const fleet = ships.map((ship, i) => {
    if (hits && hits[ship.name]) {
      return <Text key={i}>{ship.name}: {ship.size - hits[ship.name]}</Text>;
    };
    return <Text key={i}>{ship.name}: {ship.size}</Text>;
  });

  const victory = useMemo(() => {
    const defeatedShips = [];
    ships.forEach((ship) => {
      defeatedShips.push(ship.size - hits[ship.name] === 0);
    });
    return !defeatedShips.includes(false)
  }, [hits, ships]);

  useEffect(() => {
    victory && dispatch({ type: 'VICTORY' });
  }, [victory, dispatch]);

  return (
    <View style={styles.container}>
      <Text>
        {title}
        <Text>
          {fleet}
        </Text>
      </Text>
    </View>
  );
});

FleetHealth.propTypes = {
  attacks: PropTypes.object,
};

export default FleetHealth;