import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import GameContext from '../../Context/GameContext';
import {API_URL} from '../../constants';
import {theme} from '../../theme';

const {width} = Dimensions.get('window');

const CreateOrJoinGame = () => {
  const {uid, dispatch} = useContext(GameContext);
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
        body: JSON.stringify({uid: uid}),
      });

      const data = await response.json();
      console.log('Server response:', data);
      const matchID = data.data.id;

      if (matchID) {
        dispatch({type: 'JOIN_GAME', matchID});
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
      dispatch({type: 'JOIN_GAME', matchID: joinMatch});
      return;
    }
    Alert.alert('Warning', 'Enter a match Id to join a match');
  };

  return (
    <View style={styles.container}>
      {/* Decorative radar circles */}
      <View style={styles.radarContainer}>
        <View style={[styles.radarCircle, styles.radarCircle1]} />
        <View style={[styles.radarCircle, styles.radarCircle2]} />
        <View style={[styles.radarCircle, styles.radarCircle3]} />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titleIcon}>⚓</Text>
        <Text style={styles.title}>BATTLESHIP</Text>
        <Text style={styles.subtitle}>COMMAND YOUR FLEET</Text>
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.button} onPress={createGame}>
          <Text style={styles.buttonText}>CREATE NEW MATCH</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.joinContainer}>
          <TextInput
            style={styles.input}
            value={joinMatch}
            placeholder="Enter Match ID"
            placeholderTextColor={theme.colors.textSecondary}
            onChangeText={setJoinMatch}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.secondaryButton} onPress={joinGame}>
            <Text style={styles.secondaryButtonText}>JOIN MATCH</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.l,
    backgroundColor: theme.colors.background,
  },
  radarContainer: {
    position: 'absolute',
    top: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarCircle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 999,
    opacity: 0.15,
  },
  radarCircle1: {
    width: width * 0.5,
    height: width * 0.5,
  },
  radarCircle2: {
    width: width * 0.7,
    height: width * 0.7,
  },
  radarCircle3: {
    width: width * 0.9,
    height: width * 0.9,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  titleIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.s,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: theme.colors.primary,
    letterSpacing: 6,
    textShadowColor: theme.colors.primaryGlow,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.s,
    letterSpacing: 4,
    fontWeight: '600',
  },
  card: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.layout.borderRadiusLarge,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.large,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.layout.borderRadius,
    width: '100%',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.l,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  orText: {
    color: theme.colors.textMuted,
    marginHorizontal: theme.spacing.m,
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 2,
  },
  joinContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
    padding: theme.spacing.m,
    borderRadius: theme.layout.borderRadius,
    marginBottom: theme.spacing.m,
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 2,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.layout.borderRadius,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default CreateOrJoinGame;
