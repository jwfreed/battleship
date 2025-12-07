import {useState, useEffect, useRef, useCallback} from 'react';

const ReadyState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

const useWebSocket = url => {
  const [lastMessage, setLastMessage] = useState(null);
  const [readyState, setReadyState] = useState(ReadyState.CONNECTING);
  const webSocketRef = useRef(null);
  const messageQueueRef = useRef([]);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const shouldReconnectRef = useRef(true);

  useEffect(() => {
    if (!url) {
      return;
    }

    shouldReconnectRef.current = true;

    const connect = () => {
      const ws = new WebSocket(url);
      webSocketRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setReadyState(ReadyState.OPEN);
        reconnectAttemptsRef.current = 0;

        // Send any queued messages
        while (messageQueueRef.current.length > 0) {
          const queuedMessage = messageQueueRef.current.shift();
          console.log('Sending queued WebSocket message:', queuedMessage);
          ws.send(queuedMessage);
        }
      };

      ws.onmessage = event => {
        console.log('WebSocket message received:', event.data);
        setLastMessage({data: event.data});
      };

      ws.onerror = error => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setReadyState(ReadyState.CLOSED);

        if (shouldReconnectRef.current) {
          const attempt = reconnectAttemptsRef.current;
          const delay = Math.min(1000 * 2 ** attempt, 10000);
          reconnectAttemptsRef.current += 1;
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        }
      };
    };

    connect();

    return () => {
      shouldReconnectRef.current = false;
      reconnectAttemptsRef.current = 0;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      // Always close the socket when the hook cleans up so we don't keep
      // around parallel connections (e.g., after fast refresh or a quick remount)
      try {
        webSocketRef.current?.close();
      } catch (e) {
        // ignore
      }
      webSocketRef.current = null;
      messageQueueRef.current = [];
      setReadyState(ReadyState.CLOSED);
    };
  }, [url]);

  const sendMessage = useCallback(message => {
    if (
      webSocketRef.current &&
      webSocketRef.current.readyState === ReadyState.OPEN
    ) {
      console.log('Sending WebSocket message:', message);
      webSocketRef.current.send(message);
    } else {
      // Queue the message to be sent when connection opens
      console.log('WebSocket not ready, queuing message:', message);
      messageQueueRef.current.push(message);
    }
  }, []);

  return {sendMessage, lastMessage, readyState};
};

export default useWebSocket;
