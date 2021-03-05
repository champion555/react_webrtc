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
export function CheckSessionIdValidation(checkId,applicantId,env, prCallback) {   
 
  const data = {
    clientId:"156952291212",
    checkId: "02e1e86049ce4b63805c40d48d1c8786",
    applicantId: "84ae6948641b4bfb97a7b7ba3bb71ad0",
    env: "SANDBOX"
  }

  return Axios.post("/client/checkSessionIdValidation", JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json'},
    onUploadProgress: progressEvent => {
      if (prCallback) prCallback(progressEvent.loaded)
    }
  })  
}
export function KeyValidation(clientId,checkId,checkKey,env, prCallback) {  
  const data = new FormData();
  data.append('clientId', clientId);
  data.append('checkId', checkId);
  data.append('checkKey',checkKey)
  data.append('env', env);

  return Axios.post("/client/checkSessionIdValidation", data, {
    headers: { 'Content-Type': 'multipart/form-data'},
    onUploadProgress: progressEvent => {
      if (prCallback) prCallback(progressEvent.loaded)
    }
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
export function VaildIDDocumentCheck(blobData,docType,countryCode,mode, prCallback) {
  console.log("backendCall:",blobData)
  console.log("docType:",docType)
  console.log("countryCode:",countryCode)
  console.log("mode",mode)
  const data = new FormData();
  data.append('api_key', 'Mzc0MTExMjUtNTBmMS00ZTA3LWEwNjktZjQxM2UwNjA3ZGEw');
  data.append('secret_key', 'YTE4YmM5YmYtZjZhYS00MTU5LWI4Y2EtYjQyYTRkNzAxOWZj');

  return getToken().then(token => {
    var data = new FormData();
    const file = datauritoblob(blobData)

    data.append('image_file', file);
    data.append("countryCode",String(countryCode));
    data.append("docType",String(docType));  
    data.append("mode", String(mode))

    return Axios.post("/biomiid/cores/mrz_idcheck1", data, {
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

