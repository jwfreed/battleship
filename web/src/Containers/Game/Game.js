import React, { useReducer, useEffect, lazy, Suspense, useCallback } from 'react';
import { CreateOrJoinGame } from '../../Components/CreateOrJoinGame/CreateOrJoinGame';
import GameContext, { localState, initialState } from '../../Context/GameContext';
import GameReducer from '../../Context/GameReducer';
import './Game.css';

// Lazy load Match component for code splitting
const Match = lazy(() => import('../Match/Match').then(module => ({ default: module.Match })));

// Loading fallback component
const MatchLoadingFallback = () => (
  <div className="loading-container">
    <p>Loading match...</p>
  </div>
);

const Game = () => {
  const [state, dispatch] = useReducer(GameReducer, localState || initialState);

  // Debounce localStorage writes to avoid excessive writes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const parsedState = JSON.stringify(state);
      localStorage.setItem('state', parsedState);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [state]);

  return (
    <div className="game game-container">
      <p>Hi, I'm Jon Freed. Repo: <a href="https://github.com/jwfreed/battleship">github.com/jwfreed/battleship</a></p>
      <header className="title">BATTLESHIP</header>
      <GameContext.Provider value={{ ...state, dispatch }}>
        {state.matchID ? (
          <Suspense fallback={<MatchLoadingFallback />}>
            <Match />
          </Suspense>
        ) : (
          <CreateOrJoinGame />
        )}
      </GameContext.Provider>
    </div>
  );
};

export default Game;
