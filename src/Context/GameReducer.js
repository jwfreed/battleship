import * as GameActions from './GameActions';

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
    default:
      return prevState;
  }
};

export default GameReducer;
