/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { PaperProvider } from 'react-native-paper';
import { QRRenderer } from './src/components/QRRenderer';



function App(): JSX.Element {

  return (
    <PaperProvider>
      <QRRenderer/>
    </PaperProvider>
  );
}



export default App;
