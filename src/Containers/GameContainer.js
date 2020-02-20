import React, { useReducer } from 'react'
import GameContext, { initialState, GameReducer } from '../Context/GameContext'
import Board from '../Components/Board/Board'
import ShipSelect from './ShipSelect/ShipSelect'

import './GameContainer.css'

const App = () => {
  const [state, dispatch] = useReducer(GameReducer, initialState);

  return (
    <div className="game">
      <header className="title">Battleship</header>
      <GameContext.Provider value={{ ...state, dispatch }}>
        <ShipSelect />
        <Board />
      </GameContext.Provider>
    </div>
  )
}

export default App;