import React, { useContext, useState } from 'react';
import GameContext from '../../Context/GameContext';

import {
  SafeAreaView,
  TextInput,
  Button,
  Keyboard,
  StyleSheet,
} from 'react-native';

const CreateOrJoinGame = () => {
  const { uid, dispatch } = useContext(GameContext);
  const [joinMatch, setJoinMatch] = useState('');

  const createGame = async () => {
    const matchID = await fetch('http://localhost:3001/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid: uid }),
    }).then((res) => res.json()).then((data) => data.data.id).catch(console.error);
    dispatch({ type: 'JOIN_GAME', matchID });
  };

  const joinGame = () => {
    if (joinMatch !== '') {
      dispatch({ type: 'JOIN_GAME', matchID: joinMatch });
      return;
    }
    alert('enter a match Id to join a match');
  };

  return (
    <SafeAreaView style={styles.buttonContainer}>
      <Button
        onPress={createGame}
        title="Create a New Match"
      />
      <Button
        onPress={joinGame}
        title="Join an Existing Match"
      />
      <TextInput
        style={styles.input}
        value={joinMatch}
        placeholder={"Enter Match ID"}
        onChangeText={(text) => setJoinMatch(text)}
        onBlur={Keyboard.dismiss}
      />
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 220,
    backgroundColor: 'white',
  },
  input: {
    height: 50,
    textAlign: "center",
    fontSize: 20
  },
});

export default CreateOrJoinGame;