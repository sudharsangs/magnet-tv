/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';


import { QRRenderer } from './src/components/QRRenderer';



function App(): JSX.Element {

  return (
    <View>
      <QRRenderer/>
    </View>
  );
}



export default App;
