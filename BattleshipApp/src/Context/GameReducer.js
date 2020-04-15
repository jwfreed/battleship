import * as GameActions from './GameActions';
import { initialState } from './GameContext';

const GameReducer = (prevState, action) => {
  switch (action.type) {
    case 'INITIALIZE':
      console.log(1, action.data)
      return { ...action.data, initialized: true };
    case 'SELECT_SHIP':
      return GameActions.selectShip(prevState, action);
    case 'CHANGE_SHIP_ORIENTATION':
      return GameActions.changeOrientation(prevState, action);
    case 'PLACE_SHIP':
      return GameActions.placeShip(prevState, action);
    case 'REMOVE_SHIP':
      return GameActions.removeShip(prevState, action);
    case 'RESET_GAME':
      return GameActions.resetGame(initialState);
    case 'CHANGE_VIEW':
      return GameActions.changeView(prevState, action);
    case 'UPDATE_CONTEXT':
      return GameActions.updateContext(prevState, action);
    case 'JOIN_GAME':
      return GameActions.joinGame(prevState, action);
    case 'VICTORY':
      return GameActions.gameOver(prevState, action);
    default:
      return prevState;
  }
};

export default GameReducer;
