import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QRRenderer } from './src/components/QRRenderer';
import {TorrentPlayer} from './src/components/TorrentPlayer';

const Stack = createStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="QRRenderer">
      <Stack.Screen name="QRRenderer" component={QRRenderer} />
      <Stack.Screen name="TorrentPlayer" component={TorrentPlayer} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;


