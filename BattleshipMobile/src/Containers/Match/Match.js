import React, {useContext, useMemo, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Clipboard,
} from 'react-native';
import useWebSocket from '../../hooks/useWebSocket';
import Board from '../../Components/Board/Board';
import ShipSelect from '../ShipSelect/ShipSelect';
import GameContext from '../../Context/GameContext';
import {createAttacksObj} from '../../Context/GameActions';
import {SOCKET_URL} from '../../constants';
import {theme} from '../../theme';
import {showToast} from '../../Components/Toast/Toast';

// Custom icons
import CrosshairsIcon from '../../assets/icons/Crosshairs.svg';
import AnchorIcon from '../../assets/icons/Anchor.svg';
import RadarIcon from '../../assets/icons/Radar.svg';
import FleetIcon from '../../assets/icons/Fleet.svg';
import ExitIcon from '../../assets/icons/Exit.svg';
import YourTurnIcon from '../../assets/icons/YourTurn.svg';
import OpponentTurnIcon from '../../assets/icons/OpponentTurn.svg';

const ATTACK_RESULT_DELAY = 2000; // 2 seconds

const Match = () => {
  const {
    uid,
    matchID,
    view,
    shipPlacements,
    ships,
    shipsPlaced,
    shipsCommitted,
    myAttackPlacements,
    opponentShipsCommitted,
    opponentAttackPlacements,
    player,
    turn,
    gameOver,
    winner,
    pendingViewChange,
    dispatch,
  } = useContext(GameContext);

  const pendingViewTimeoutRef = useRef(null);

  const socketUrl = `${SOCKET_URL}/${matchID}`;
  const {sendMessage, lastMessage, readyState} = useWebSocket(socketUrl);

  const isConnected = useMemo(() => readyState === 1, [readyState]);

  useEffect(() => {
    if (isConnected) {
      const authMessage = JSON.stringify({action: 'AUTH', uid});
      sendMessage(authMessage);
    }
  }, [isConnected, sendMessage, uid]);

  useEffect(() => {
    if (lastMessage && lastMessage.data) {
      const msg = JSON.parse(lastMessage.data);
      dispatch({type: 'UPDATE_CONTEXT', data: msg});
    }
  }, [lastMessage, dispatch]);

  // Handle delayed view change after attack result
  useEffect(() => {
    if (pendingViewChange) {
      // Clear any existing timeout
      if (pendingViewTimeoutRef.current) {
        clearTimeout(pendingViewTimeoutRef.current);
      }

      pendingViewTimeoutRef.current = setTimeout(() => {
        dispatch({type: 'APPLY_PENDING_VIEW'});
      }, ATTACK_RESULT_DELAY);
    }

    return () => {
      if (pendingViewTimeoutRef.current) {
        clearTimeout(pendingViewTimeoutRef.current);
      }
    };
  }, [pendingViewChange, dispatch]);

  const doResetGame = () => dispatch({type: 'RESET_GAME'});

  const doChangeView = () => dispatch({type: 'CHANGE_VIEW'});

  const copyToClipboard = useCallback((text, label) => {
    Clipboard.setString(text);
    showToast(`${label} copied to clipboard`, 'success');
  }, []);

  const doCommitShips = () => {
    const numberOfShipsPlaced = Object.keys(shipsPlaced).length;
    if (numberOfShipsPlaced < ships.length) {
      return showToast('You must position all ships in your fleet.', 'warning');
    }
    const placeShipsMessage = JSON.stringify({
      action: 'SHIP_PLACEMENTS',
      placements: shipPlacements,
      uid,
      turn,
    });
    showToast('Ships Deployed!', 'success');
    return sendMessage(placeShipsMessage);
  };

  const doAttackTile = (row, col) => {
    if (player !== turn) {
      return showToast("It's not your turn", 'warning');
    }
    const placeAttackMessage = JSON.stringify({
      action: 'ATTACK',
      row,
      col,
      uid,
      turn,
    });
    return sendMessage(placeAttackMessage);
  };

  const myAttacks = useMemo(
    () => createAttacksObj(myAttackPlacements),
    [myAttackPlacements],
  );

  const opponentAttacks = useMemo(
    () => createAttacksObj(opponentAttackPlacements),
    [opponentAttackPlacements],
  );

  const getTurnMeta = () => {
    if (!turn) {
      return {label: 'WAITING FOR OPPONENT', Icon: OpponentTurnIcon};
    }
    return turn === player
      ? {label: 'YOUR TURN', Icon: YourTurnIcon}
      : {label: "OPPONENT'S TURN", Icon: OpponentTurnIcon};
  };

  const {label: turnLabel, Icon: TurnIcon} = getTurnMeta();

  return (
    <SafeAreaView style={styles.container}>
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <TouchableOpacity style={styles.statusItem} onPress={() => copyToClipboard(matchID, 'Match ID')}>
          <Text style={styles.statusLabel}>MATCH ID</Text>
          <Text style={styles.statusValue}>{matchID}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statusItem} onPress={() => copyToClipboard(uid, 'Player ID')}>
          <Text style={styles.statusLabel}>PLAYER ID</Text>
          <Text style={styles.statusValue}>{uid}</Text>
        </TouchableOpacity>
        <View style={styles.connectionIndicator}>
          <View
            style={[styles.connectionDot, isConnected && styles.connected]}
          />
          <Text style={styles.connectionText}>
            {isConnected ? 'LIVE' : 'CONNECTING'}
          </Text>
        </View>
      </View>

      {/* Turn Indicator */}
      <View style={styles.turnContainer}>
        <View
          style={[styles.turnIndicator, turn === player && styles.yourTurn]}>
          <View style={styles.turnRow}>
            {TurnIcon ? (
              <View style={styles.turnIcon}>
                <TurnIcon
                  width={18}
                  height={18}
                  fill={theme.colors.primary}
                  stroke={theme.colors.primary}
                />
              </View>
            ) : null}
            <Text style={styles.turnLabel}>{turnLabel}</Text>
          </View>
        </View>
        <View style={styles.playerBadge}>
          <Text style={styles.playerText}>{player || 'JOINING...'}</Text>
        </View>
      </View>

      {/* Game Board */}
      <View style={styles.boardSection}>
        <View style={styles.viewLabel}>
          {view === 'P' ? (
            <FleetIcon width={20} height={20} fill={theme.colors.primary} stroke={theme.colors.primary} />
          ) : (
            <RadarIcon width={20} height={20} fill={theme.colors.primary} stroke={theme.colors.primary} />
          )}
          <Text style={styles.viewLabelText}>
            {view === 'P' ? 'YOUR FLEET' : 'ATTACK MAP'}
          </Text>
        </View>
        <Board
          doAttackTile={doAttackTile}
          myAttacks={myAttacks}
          opponentAttacks={opponentAttacks}
        />
      </View>

      {/* Action Controls */}
      <View style={styles.controls}>
        {!shipsCommitted ? (
          <TouchableOpacity
            style={[styles.button, styles.commitButton]}
            onPress={doCommitShips}>
            <AnchorIcon width={18} height={18} fill={theme.colors.background} stroke={theme.colors.background} />
            <Text style={styles.buttonText}>DEPLOY FLEET</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.viewButton]}
            onPress={doChangeView}>
            {view === 'P' ? (
              <CrosshairsIcon width={18} height={18} fill={theme.colors.background} stroke={theme.colors.background} />
            ) : (
              <AnchorIcon width={18} height={18} fill={theme.colors.background} stroke={theme.colors.background} />
            )}
            <Text style={styles.buttonText}>
              {view === 'P' ? 'ATTACK VIEW' : 'FLEET VIEW'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={doResetGame}>
          <ExitIcon width={18} height={18} fill="#fecaca" stroke="#fecaca" />
          <Text style={styles.resetButtonText}>EXIT</Text>
        </TouchableOpacity>
      </View>

      {!shipsCommitted && (
        <View style={styles.shipSelectContainer}>
          <ShipSelect />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginRight: theme.spacing.s,
  },
  statusValue: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  connectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.error,
    marginRight: theme.spacing.xs,
  },
  connected: {
    backgroundColor: theme.colors.success,
  },
  connectionText: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  turnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
  },
  turnIndicator: {
    flex: 1,
    backgroundColor: theme.colors.surfaceLight,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.layout.borderRadiusSmall,
    marginRight: theme.spacing.s,
  },
  yourTurn: {
    backgroundColor: theme.colors.primaryDark,
  },
  turnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  turnIcon: {
    marginRight: 6,
  },
  turnLabel: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  playerBadge: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.layout.borderRadiusSmall,
  },
  playerText: {
    color: theme.colors.text,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  boardSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
  },
  viewLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: theme.spacing.s,
  },
  viewLabelText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    gap: theme.spacing.s,
  },
  button: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderRadius: theme.layout.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...theme.shadows.small,
  },
  commitButton: {
    flex: 1,
    backgroundColor: theme.colors.success,
  },
  viewButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  resetButton: {
    flexDirection: 'row',
    backgroundColor: '#7f1d1d',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#991b1b',
    gap: 6,
  },
  buttonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  resetButtonText: {
    color: '#fecaca',
    fontSize: 14,
    fontWeight: 'bold',
  },
  shipSelectContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.layout.borderRadiusLarge,
    borderTopRightRadius: theme.layout.borderRadiusLarge,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});

export default Match;
