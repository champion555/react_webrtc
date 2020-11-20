import Axios from '../api';
import datauritoblob from 'datauritoblob'
// handle user media capture
export function captureUserMedia(callback, deviceId, facingMode) {  
    var params = {
      audio: false, video: {
        deviceId: deviceId ? { deviceId: { exact: deviceId } } : null,
        width: { exact: 1280 },
        height: { exact: 720 },
        facingMode: facingMode,
        // facingMode: { exact: 'user' },
      }
    }; 
  navigator.getUserMedia(params, callback, (error) => {
    // alert(JSON.stringify(error));
  });
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
      // facingMode:  { exact: 'user' },
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


// export function getCameraList(callbacl) {
//   if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
//     console.log("enumerateDevices() not supported.");
//     return;
//   }

//   // List cameras and microphones.

//   navigator.mediaDevices.enumerateDevices()
//     .then(function (devices) {
//       devices.forEach(function (device) {
//         console.log(device.kind + ": " + device.label +
//           " id = " + device.deviceId);
//       });

//       var cameraList = devices.filter(d => d.kind === 'videoinput')

//       callbacl(cameraList)
//     })
//     .catch(function (err) {
//       console.log(err.name + ": " + err.message);
//     });
// }

function getToken() {
  return new Promise((r, reject) => {


    var tokenTime = localStorage.getItem('time')
    var token = localStorage.getItem('token')

    if (token && new Date().getTime() - tokenTime < 25 * 60 * 1000) {
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
    }).catch(e=>{
      reject(e);
    })

  })

}
export function VideoUpload(blobData, isVideo = true, prCallback) { //parameters: { type, data, id }

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

