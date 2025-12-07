import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ScrollView,
  Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GameContext from '../../Context/GameContext';
import {API_URL} from '../../constants';
import {theme} from '../../theme';
import {showToast} from '../Toast/Toast';

const {width} = Dimensions.get('window');

const CreateOrJoinGame = () => {
  const {uid, dispatch} = useContext(GameContext);
  const [joinMatch, setJoinMatch] = useState('');
  const [showRejoin, setShowRejoin] = useState(false);
  const [rejoinMatch, setRejoinMatch] = useState('');
  const [rejoinUid, setRejoinUid] = useState('');

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
        showToast('Game created! Share Match ID with opponent.', 'success', 3000);
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
    showToast('Enter a match ID to join', 'warning');
  };

  const copyUid = async () => {
    try {
      await Share.share({
        message: uid,
      });
    } catch (error) {
      showToast(`Player ID: ${uid}`, 'info', 3000);
    }
  };

  const handleRejoinFromOtherDevice = async () => {
    if (!rejoinMatch || !rejoinUid) {
      showToast('Enter both Match ID and Player ID', 'warning');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/match/${rejoinMatch}/rejoin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({uid: rejoinUid}),
      });

      const data = await response.json();

      if (!data.success) {
        Alert.alert('Error', data.message || 'Failed to rejoin match');
        return;
      }

      // Store the UID from the other device
      await AsyncStorage.setItem('uid', rejoinUid);

      // Rejoin with the restored state
      dispatch({type: 'REJOIN_MATCH', data: data.data});
    } catch (error) {
      console.error('Error rejoining match:', error);
      Alert.alert('Error', 'Error rejoining match: ' + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          {/* Player ID Section */}
          <View style={styles.playerIdSection}>
            <Text style={styles.playerIdLabel}>YOUR PLAYER ID</Text>
            <View style={styles.playerIdRow}>
              <Text style={styles.playerId} numberOfLines={1}>
                {uid}
              </Text>
              <TouchableOpacity style={styles.copyBtn} onPress={copyUid}>
                <Text style={styles.copyBtnText}>📋</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.playerIdHint}>
              Save this to rejoin from another device
            </Text>
          </View>

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

          {/* Rejoin from another device */}
          <TouchableOpacity
            style={styles.rejoinToggle}
            onPress={() => setShowRejoin(!showRejoin)}>
            <Text style={styles.rejoinToggleText}>
              {showRejoin ? '▼ Hide' : '▶ Rejoin from another device'}
            </Text>
          </TouchableOpacity>

          {showRejoin && (
            <View style={styles.rejoinContainer}>
              <TextInput
                style={styles.input}
                value={rejoinMatch}
                placeholder="Match ID"
                placeholderTextColor={theme.colors.textSecondary}
                onChangeText={setRejoinMatch}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                value={rejoinUid}
                placeholder="Player ID from other device"
                placeholderTextColor={theme.colors.textSecondary}
                onChangeText={setRejoinUid}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.rejoinButton}
                onPress={handleRejoinFromOtherDevice}>
                <Text style={styles.rejoinButtonText}>REJOIN MATCH</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
  playerIdSection: {
    alignItems: 'center',
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.layout.borderRadius,
    marginBottom: theme.spacing.m,
  },
  playerIdLabel: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: theme.spacing.xs,
  },
  playerIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s,
  },
  playerId: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    maxWidth: width * 0.5,
  },
  copyBtn: {
    padding: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 4,
  },
  copyBtnText: {
    fontSize: 16,
  },
  playerIdHint: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: theme.spacing.xs,
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
  rejoinToggle: {
    marginTop: theme.spacing.l,
    paddingTop: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  rejoinToggleText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  rejoinContainer: {
    marginTop: theme.spacing.m,
  },
  rejoinButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.warning,
    padding: theme.spacing.m,
    borderRadius: theme.layout.borderRadius,
    width: '100%',
    alignItems: 'center',
  },
  rejoinButtonText: {
    color: theme.colors.warning,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default CreateOrJoinGame;
