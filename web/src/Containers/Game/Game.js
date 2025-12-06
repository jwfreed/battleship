import React, { useReducer, useEffect, lazy, Suspense, useCallback, useState } from 'react';
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
  const [checkingActiveMatch, setCheckingActiveMatch] = useState(true);

  // Check for active match on initial load (for rejoin from another device)
  useEffect(() => {
    const checkActiveMatch = async () => {
      // Skip if already in a match from localStorage
      if (state.matchID) {
        setCheckingActiveMatch(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/active/${state.uid}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          console.log('Found active match, rejoining:', data.data);
          dispatch({ type: 'REJOIN_MATCH', data: data.data });
        }
      } catch (error) {
        console.error('Error checking for active match:', error);
      } finally {
        setCheckingActiveMatch(false);
      }
    };

    checkActiveMatch();
  }, []); // Only run once on mount

  // Debounce localStorage writes to avoid excessive writes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const parsedState = JSON.stringify(state);
      localStorage.setItem('state', parsedState);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [state]);

  if (checkingActiveMatch) {
    return (
      <div className="game game-container">
        <header className="title">BATTLESHIP</header>
        <div className="loading-container">
          <p>Checking for active games...</p>
        </div>
      </div>
    );
  }

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
