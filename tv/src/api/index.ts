import {getDeviceId} from 'react-native-device-info';

export const API_URL = "http://192.168.0.105:3006/"



export const fetchQrCode = async () => {
    const deviceId = await getDeviceId()
    const url = `${API_URL}api/v1/qr`
    return fetch(url,{
        headers: {
            'X-Device-Id': deviceId
        }
    }).then(res => res.json()).then(json => {
        return json
    }).catch(err => {
        return err
    })
}

