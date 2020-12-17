const { check_blur, check_glare, check_face } = require('./imageCheck');
const { check_blur_base64, check_glare_base64, check_face_base64 } = require('./imageCheck');
const { initWorker} = require('./mrz');

exports.check_blur = check_blur;
exports.check_glare = check_glare;
exports.check_face = check_face;

exports.check_blur_base64 = check_blur_base64;
exports.check_glare_base64 = check_glare_base64;
exports.check_face_base64 = check_face_base64;


exports.initMRZ = initWorker;
