import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { getQrCode } from '../../api';

export const QRRenderer = () => {
  useEffect(() => {
    const response = getQrCode()
    console.log("resp",response)
  },[])
  return (
    <LinearGradient colors={['#0e1c26', '#2a454b', '#294861']} style={styles.linearGradient}>
      <Text style={styles.infoTextStyles}>Scan the QR code below to input the magnet link for streaming the torrent.</Text>
      <View style={styles.qrWrapperStyles}>
        <Text>QRRenderer</Text> 
      </View>
      <Text style={styles.linkTextStyles}>https://localhost:3000/uiwuei</Text>
    </LinearGradient>
  )
}

const  styles = StyleSheet.create({
  linearGradient: {
    width: '100%',
    height: '100%',
    padding: 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  infoTextStyles: {
    color: "#E7E7E7",
    marginTop: 10,
    marginBottom: 10,
    fontSize: 22,
    width: 450,
    textAlign: "center"
  },
  qrWrapperStyles: {
    height: 300, 
    width: 300,
    borderRadius: 4,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  linkTextStyles: {
    color: "#1A8FE3",
    marginTop: 10,
    marginBottom: 10,
    fontSize: 18
  }
})
