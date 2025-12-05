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

  useEffect(() => {
    if (!url) {
      return;
    }

    const ws = new WebSocket(url);
    webSocketRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setReadyState(ReadyState.OPEN);
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
    };

    return () => {
      if (ws.readyState === ReadyState.OPEN) {
        ws.close();
      }
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
      console.warn('WebSocket not connected, cannot send message');
    }
  }, []);

  return {sendMessage, lastMessage, readyState};
};

export default useWebSocket;
