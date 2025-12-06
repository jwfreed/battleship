import React, {useReducer, useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import GameContext, {
  loadInitialState,
  initialState,
} from './src/Context/GameContext';
import GameReducer from './src/Context/GameReducer';
import Match from './src/Containers/Match/Match';
import CreateOrJoinGame from './src/Components/CreateOrJoinGame/CreateOrJoinGame';
import {theme} from './src/theme';

const App = () => {
  const [state, dispatch] = useReducer(GameReducer, initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const loadedState = await loadInitialState();
      dispatch({type: 'INITIALIZE', data: loadedState});
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />
      <GameContext.Provider value={{...state, dispatch}}>
        {state.matchID ? <Match /> : <CreateOrJoinGame />}
      </GameContext.Provider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
