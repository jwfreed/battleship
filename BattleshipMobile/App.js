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
import {API_URL} from './src/constants';
import {Toast} from './src/Components/Toast/Toast';

const App = () => {
  const [state, dispatch] = useReducer(GameReducer, initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const loadedState = await loadInitialState();
      dispatch({type: 'INITIALIZE', data: loadedState});
      
      // Check for active match if not already in one
      if (!loadedState.matchID && loadedState.uid) {
        try {
          const response = await fetch(`${API_URL}/match/active/${loadedState.uid}`);
          const data = await response.json();
          
          if (data.success && data.data) {
            console.log('Found active match, rejoining:', data.data);
            dispatch({type: 'REJOIN_MATCH', data: data.data});
          }
        } catch (error) {
          console.error('Error checking for active match:', error);
        }
      }
      
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
        <Toast />
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
