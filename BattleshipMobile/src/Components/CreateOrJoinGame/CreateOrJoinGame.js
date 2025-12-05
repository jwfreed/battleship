import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import GameContext from '../../Context/GameContext';
import { API_URL } from '../../constants';

const CreateOrJoinGame = () => {
  const { uid, dispatch } = useContext(GameContext);
  const [joinMatch, setJoinMatch] = useState('');

  const createGame = async () => {
    console.log('Creating game with UID:', uid);
    
    if (!uid) {
      Alert.alert('Error', 'User ID not initialized. Please restart the app.');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: uid }),
      });
      
      const data = await response.json();
      console.log('Server response:', data);
      const matchID = data.data.id;
      
      if (matchID) {
        dispatch({ type: 'JOIN_GAME', matchID });
        Alert.alert('Success', 'Share Match ID with your opponent: ' + matchID);
      } else {
        throw new Error('No match ID returned from server');
      }
    } catch (error) {
      console.error('Error creating game:', error);
      Alert.alert('Error', 'Error creating game: ' + error.message);
    }
  };

  const joinGame = () => {
    if (joinMatch !== '') {
      dispatch({ type: 'JOIN_GAME', matchID: joinMatch });
      return;
    };
    Alert.alert('Warning', 'Enter a match Id to join a match');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={createGame}>
        <Text style={styles.buttonText}>Create a New Match</Text>
      </TouchableOpacity>
      
      <View style={styles.joinContainer}>
        <TextInput
          style={styles.input}
          value={joinMatch}
          placeholder="Enter Match ID"
          onChangeText={setJoinMatch}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={joinGame}>
          <Text style={styles.buttonText}>Join an Existing Match</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  joinContainer: {
    width: '100%',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
});

export default CreateOrJoinGame;
