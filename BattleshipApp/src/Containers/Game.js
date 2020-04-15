import React, { useReducer, useEffect, useContext } from 'react';
import GameReducer from '../Context/GameReducer';
import GameContext, { loadInitialState } from '../Context/GameContext';
import CreateOrJoinGame from '../Components/CreateOrJoinGame/CreateOrJoinGame';
import Match from '../Containers/Match/Match';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const Game = () => {
  const [state, dispatch] = useReducer(GameReducer, {});

  useEffect(() => {
    loadInitialState
      .then(loadedState => dispatch({ type: 'INITIALIZE', data: loadedState }));
  }, []);

  console.log(2, state.initialized)
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View>
            {state.initialized && (
              <GameContext.Provider value={{ ...state, dispatch }}>
                {state.matchID ? <Match /> : <CreateOrJoinGame />}
              </GameContext.Provider>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '800',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default Game;
