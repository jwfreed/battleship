import React, {useEffect, useRef} from 'react';
import {Animated, Text, StyleSheet} from 'react-native';

// Toast state management
let toastRef = null;
let toastTimeout = null;

export const showToast = (message, type = 'info', duration = 2000) => {
  // Defer to avoid calling setState during render
  setTimeout(() => {
    if (toastRef) {
      toastRef.show(message, type, duration);
    }
  }, 0);
};

export const Toast = () => {
  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [type, setType] = React.useState('info');
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    toastRef = {
      show: (msg, toastType, duration) => {
        // Clear any existing timeout
        if (toastTimeout) {
          clearTimeout(toastTimeout);
        }

        setMessage(msg);
        setType(toastType);
        setVisible(true);

        // Animate in
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();

        // Auto dismiss
        toastTimeout = setTimeout(() => {
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: -50,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setVisible(false);
          });
        }, duration);
      },
    };

    return () => {
      toastRef = null;
      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }
    };
  }, [opacity, translateY]);

  if (!visible) {
    return null;
  }

  const backgroundColor =
    {
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#22d3ee',
    }[type] || '#22d3ee';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{translateY}],
          backgroundColor,
        },
      ]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  text: {
    color: '#0a0f1a',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Toast;
