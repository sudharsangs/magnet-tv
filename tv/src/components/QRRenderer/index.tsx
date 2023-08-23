import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import EventSource, { EventSourceListener } from "react-native-sse";
import { API_URL, fetchQrCode } from '../../api';
import { getDeviceId } from 'react-native-device-info';

export const QRRenderer = () => {
  const [deviceInfo,setDeviceInfo] = useState<any>(null)

  const getQrCode = async ():Promise<any> => {
    try {
         const response = await fetchQrCode()
         setDeviceInfo(response?.device)
         console.log(response?.device)
    } catch (error) {
        setDeviceInfo(null)
    }
   
  }


  useEffect(() => {
    getQrCode()
  },[])

  useEffect(() => {
    const url = `${API_URL}api/v1/magnet`
    const deviceId = getDeviceId()
    const es = new EventSource(url, {
      headers: {
        'X-Device-Id': deviceId
      },
    });

    const listener: EventSourceListener = (event) => {
      console.log("event",event)
      if (event.type === "open") {
        console.log("Open SSE connection.");
      } else if (event.type === "message") {
        console.log(event.data)
      } else if (event.type === "error") {
        console.error("Connection error:", event.message);
      } else if (event.type === "exception") {
        console.error("Error:", event.message, event.error);
      }
    };

    es.addEventListener("open", listener);
    es.addEventListener("message", listener);
    es.addEventListener("error", listener);

    return () => {
      es.removeAllEventListeners();
      es.close();
    };
  }, []);


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
