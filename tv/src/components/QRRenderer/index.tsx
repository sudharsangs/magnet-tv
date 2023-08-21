import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { fetchQrCode } from '../../api';

export const QRRenderer = () => {
  const [deviceInfo,setDeviceInfo] = useState<any>(null)

  const getQrCode = async ():Promise<any> => {
    try {
         const response = await fetchQrCode()
         setDeviceInfo(response?.device)
    } catch (error) {
        setDeviceInfo(null)
    }
   
  }


  useEffect(() => {
    getQrCode()
  },[])


  return (
    <LinearGradient colors={['#0e1c26', '#2a454b', '#294861']} style={styles.linearGradient}>
      <Text style={styles.infoTextStyles}>Scan the QR code below to input the magnet link for streaming the torrent.</Text>
      <View style={styles.qrWrapperStyles}>
        <Image
          style={styles.imageStyles}
          source={{uri: deviceInfo?.qrCodeUrl}}
      /> 
      </View>
      <Text style={styles.linkTextStyles}>{deviceInfo?.qrFormUrl}</Text>
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
  },
  imageStyles: {
    width: '100%', 
    height: '100%'
  }
})
