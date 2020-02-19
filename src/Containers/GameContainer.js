import React, { useReducer } from 'react'
import GameContext, { initialState, GameReducer } from '../Context/GameContext'
import Board from '../Components/Board/Board'

import './GameContainer.css'

const App = () => {
  const [state, dispatch] = useReducer(GameReducer, initialState);

  return (
    <div className='game'>
      <GameContext.Provider value={{ ...state, dispatch }}>
        <Board />
      </GameContext.Provider>
    </div>
  )
}

export default App;