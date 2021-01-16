import Axios from '../api';
import AxiosVideoLiv from '../videolivenessapi'
import SelfAxios from '../selfService';
import datauritoblob from 'datauritoblob'
import { isMobile } from 'react-device-detect'
function stopMediaTracks(stream) {
  stream.getTracks().forEach(track => {
    track.stop();
  });
}
export function captureUserMedia(callback, deviceId, defaultFaceingMode = 'user', audio = true, videoSizeW, videoH) {

  const videoConstraints = {
    width: { exact: videoSizeW ? videoSizeW : 1280 },
    height: { exact: videoH ? videoH : 720 },
  };
  if (deviceId) {
    videoConstraints.deviceId = { exact: deviceId };
  } else {
    if (isMobile)
      videoConstraints.facingMode = defaultFaceingMode;
  }

  const constraints = {
    video: videoConstraints,
    audio: isMobile ? audio : false,
  };

  if (typeof window.currentStream !== 'undefined') {
    stopMediaTracks(window.currentStream);
  }

  return navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    window.currentStream = stream;
    callback(stream);
    return navigator.mediaDevices.enumerateDevices();
  })
    .then(devices => {
      var cameraList = devices.filter(d => d.kind === 'videoinput')
      return cameraList;
    })
};

var fixedNum = (num) => {
  return ("0" + num).slice(-2);
};

export function durationFormat(mili) {
  let x = mili > 0 ? mili : 0;
  // let ms = x % 1000;
  x = x / 1000;
  x = Math.floor(x);
  const secs = x % 60;

  x = x / 60;
  x = Math.floor(x);
  const mins = x % 60;

  x = x / 60;
  x = Math.floor(x);

  let h = x % 24;
  x = x / 24
  x = Math.floor(x);

  return `${fixedNum(h)}:${fixedNum(mins)}:${fixedNum(secs)}`
}

export function changeCamera(deviceId) {
  const constraints = {
    audio: false,
    video: {
      deviceId: { exact: deviceId },

      width: { exact: 1280 },
      height: { exact: 720 },

      facingMode: "environment"
    },

  };

  if (window.stream) {
    console.error(window.stream)
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }

  return navigator.mediaDevices.getUserMedia(constraints)
};

function getToken() {
  return new Promise((r, reject) => {
    var tokenTime = localStorage.getItem('time')
    var token = localStorage.getItem('token')
    if (token && new Date().getTime() - tokenTime < 1 * 60 * 1000) {
      console.log('token', token)
      return r(token)
    }
    console.log('getting token ...')
    const data = new FormData();
    data.append('api_key', 'Mzc0MTExMjUtNTBmMS00ZTA3LWEwNjktZjQxM2UwNjA3ZGEw');
    data.append('secret_key', 'YTE4YmM5YmYtZjZhYS00MTU5LWI4Y2EtYjQyYTRkNzAxOWZj');

    return Axios.post("/client/authentificate", data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => {
      if (res.data.status === "SUCCESS" && res.data.statusCode === "200") return res.data.api_access_token
      else throw Error("Auth Error")
    }).then(token => {
      console.error(token)
      localStorage.setItem('time', new Date().getTime())
      localStorage.setItem('token', token)

      r(token)
    }).catch(e => {
      reject(e);
    })

  })

}
export function ImageQuality(blobData, prCallback) {

  const data = new FormData();
  data.append('api_key', 'Mzc0MTExMjUtNTBmMS00ZTA3LWEwNjktZjQxM2UwNjA3ZGEw');
  data.append('secret_key', 'YTE4YmM5YmYtZjZhYS00MTU5LWI4Y2EtYjQyYTRkNzAxOWZj');

  return getToken().then(token => {
    var data = new FormData();
    const file = datauritoblob(blobData)

    data.append('image_file', file);

    return Axios.post("ImageQualityCheck", data, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      onUploadProgress: progressEvent => {
        if (prCallback) prCallback(blobData.size, progressEvent.loaded)
      }
    })
  })
}
export function PhotoUpload(blobData, prCallback) {

  const data = new FormData();
  data.append('api_key', 'Mzc0MTExMjUtNTBmMS00ZTA3LWEwNjktZjQxM2UwNjA3ZGEw');
  data.append('secret_key', 'YTE4YmM5YmYtZjZhYS00MTU5LWI4Y2EtYjQyYTRkNzAxOWZj');

  return getToken().then(token => {
    var data = new FormData();
    const file = datauritoblob(blobData)

    data.append('live_image_file_web', file);   

    return Axios.post("faceliveness", data, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      onUploadProgress: progressEvent => {
        if (prCallback) prCallback(blobData.size, progressEvent.loaded)
      }
    })
  })
}
export function VideoChallenge(blobData,challenge1,challenge2,challenge3, prCallback) {
  console.log(challenge1,challenge2,challenge3)
  const data = new FormData();
  data.append('api_key', 'Mzc0MTExMjUtNTBmMS00ZTA3LWEwNjktZjQxM2UwNjA3ZGEw');
  data.append('secret_key', 'YTE4YmM5YmYtZjZhYS00MTU5LWI4Y2EtYjQyYTRkNzAxOWZj');

  return getToken().then(token => {
    var data = new FormData();
    data.append('live_video_file', blobData);

    data.append("challenge_1",String(challenge1));
    data.append("challenge_2",String(challenge2));
    data.append("challenge_3",String(challenge3));

    return Axios.post( "/biomiid/kyx/client/videoChallenges" , data, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      onUploadProgress: progressEvent => {
        // console.log('progressEvent:' + progressEvent.loaded);
        if (prCallback) prCallback(blobData.size, progressEvent.loaded)
      }
    })
  })
}


export function VideoUpload(blobData, isVideo = true, prCallback) {

  const data = new FormData();
  data.append('api_key', 'Mzc0MTExMjUtNTBmMS00ZTA3LWEwNjktZjQxM2UwNjA3ZGEw');
  data.append('secret_key', 'YTE4YmM5YmYtZjZhYS00MTU5LWI4Y2EtYjQyYTRkNzAxOWZj');

  return getToken().then(token => {
    var data = new FormData();

    if (isVideo)
      data.append('live_video_file', blobData);
    else {
      const file = datauritoblob(blobData)
      console.log(file)
      data.append('live_image_file', file);

    }

    return Axios.post(isVideo ? "/videoFaceLiveness" : "photoFaceLiveness", data, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      onUploadProgress: progressEvent => {
        // console.log('progressEvent:' + progressEvent.loaded);
        if (prCallback) prCallback(blobData.size, progressEvent.loaded)
      }
    })
  })
}
export function GetClientDetail(blobData, prCallback) { //parameters: { type, data, id }

  const data = new FormData();
  data.append('api_key', 'Mzc0MTExMjUtNTBmMS00ZTA3LWEwNjktZjQxM2UwNjA3ZGEw');
  data.append('secret_key', 'YTE4YmM5YmYtZjZhYS00MTU5LWI4Y2EtYjQyYTRkNzAxOWZj');

  return getToken().then(token => {
    var data = {
      'clientId': '517414793516'
    }
    return SelfAxios.get("getClientDetails", data, {
      // headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      onUploadProgress: progressEvent => {
        if (prCallback) prCallback(blobData.size, progressEvent.loaded)
      }
    })
  })
}

