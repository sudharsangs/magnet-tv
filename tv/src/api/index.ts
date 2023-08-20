import {getDeviceId} from 'react-native-device-info';

const API_URL = "http://192.168.0.105:3006/"



export const getQrCode = async () => {
    const deviceId = await getDeviceId()
    const url = `${API_URL}api/v1/qr`
    console.log("url",url)
    return fetch(url,{
        headers: {
            'X-Device-Id': deviceId
        }
    }).then(res => res.json()).then(json => {
        console.log(json)
        return json
    }).catch(err => {
        console.log(err)
        return err
    })
}

