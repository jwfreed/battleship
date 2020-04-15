import React, { useContext, useState } from 'react';
import GameContext from '../../Context/GameContext';

import {
  SafeAreaView,
  TextInput,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

const CreateOrJoinGame = () => {
  const { uid, dispatch } = useContext(GameContext);
  const [joinMatch, setJoinMatch] = useState();

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
    };
    alert('enter a match Id to join a match');
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <TouchableOpacity onPress={createGame}>
            <Text>Create a New Match</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={joinGame}>
            <Text>Join an Existing Match</Text>
          </TouchableOpacity>
          <TextInput
            type="text"
            value={joinMatch}
            placeholder="Enter Match ID"
            onChange={(text) => setJoinMatch(text)}
            onBlur={Keyboard.dismiss}
            returnKeyType='go'
          />
        </View>
      </ScrollView>
    </SafeAreaView >
  );
};

export default CreateOrJoinGame;