import { AppRegistry } from 'react-native';
import Game from './src/Containers/Game';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => Game);
