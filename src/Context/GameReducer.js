import * as GameActions from './GameActions';
import { initialState } from './GameContext';

const GameReducer = (prevState, action) => {
  switch (action.type) {
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
    default:
      return prevState;
  }
};

export default GameReducer;
