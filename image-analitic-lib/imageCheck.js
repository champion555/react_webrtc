var pico = require('./pico')
var math = require('mathjs');
function _check_blur(src, cv = window.cv) {
    let blured = false;

    let gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY, 0);

    let dst = new cv.Mat();
    let men = new cv.Mat();
    let menO = new cv.Mat();

    cv.Laplacian(gray, dst, cv.CV_64F, 1, 1, 0, cv.BORDER_DEFAULT);
    cv.meanStdDev(dst, menO, men);

    if (men.data64F[0] > 14) {
        blured = true;
    }
    var bValue = men.data64F[0];
    src.delete();
    gray.delete();
    dst.delete();
    men.delete();
    menO.delete();

    return { b: blured, value: bValue }
}

export function check_blur(img_elem, cv = window.cv) {
    let src = cv.imread(img_elem);
    return _check_blur(src);
}

export async function check_blur_base64(base64text, cv = window.cv) {
    const base64data = base64text.replace('data:image/jpeg;base64', '').replace('data:image/png;base64', '');//Strip image type prefix
    const buffer = Buffer.from(base64data, 'base64');

    const src = cv.imdecode(buffer); //Image is now represented as Mat
    return await _check_blur(src);
}


function _check_glare(src, cv = window.cv) {
    let glared = false;

    let gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY, 0);
    let threshed = new cv.Mat();
    cv.threshold(gray, threshed, 200, 255, cv.THRESH_BINARY);

    let a = new Array()
    for (var i of threshed.data) {
        a.push(i)
    }

    if (math.variance(a) > 5000 && math.variance(a) < 8500) {
        glared = true;
    }

    src.delete();
    gray.delete();
    threshed.delete();

    return glared;
}

export function check_glare(img_elem, cv = window.cv) {
    let src = cv.imread(img_elem);
    return _check_glare(src);
}

export async function check_glare_base64(base64text, cv = window.cv) {
    const base64data = base64text.replace('data:image/jpeg;base64', '').replace('data:image/png;base64', '');//Strip image type prefix
    const buffer = Buffer.from(base64data, 'base64');

    const src = cv.imdecode(buffer); //Image is now represented as Mat
    return _check_glare(src);
}

async function _check_face(src, cv = window.cv) {
    let faced = false;

    let facedValue = 0;
    
    let gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY, 0);

    var facefinder_classify_region = function (r, c, s, pixels, ldim) { return -1.0; };
    var cascadeurl = 'facefinder';

    await fetch(cascadeurl).then(async function (response) {

        await response.arrayBuffer().then(function (buffer) {
            var bytes = new Int8Array(buffer);
            facefinder_classify_region = pico.unpack_cascade(bytes);


            var image = {
                "pixels": gray.data,
                "nrows": gray.rows,
                "ncols": gray.cols,
                "ldim": gray.cols
            }
            var params = {
                "shiftfactor": 0.1,
                "minsize": 30,
                "maxsize": 720,
                "scalefactor": 1.1
            }

            var dets = pico.run_cascade(image, facefinder_classify_region, params);
            var dets = pico.cluster_detections(dets, 0.2);

            let qthresh = 5.0;
            let n = 0;

            for (var i = 0; i < dets.length; ++i) {
                if (dets[i][3] > qthresh) {
                    n = n + 1;
                }
            }

            facedValue = n;
            if (n >= 1) {
                faced = true;
            }
        })
    })

    return { f: faced, value: facedValue };
}

export async function check_face(img_elem, cv = window.cv) {
    let src = cv.imread(img_elem);
    return await _check_face(src);
}

export async function check_face_base64(base64text, cv = window.cv) {
    const base64data = base64text.replace('data:image/jpeg;base64', '').replace('data:image/png;base64', '');//Strip image type prefix
    const buffer = Buffer.from(base64data, 'base64');

    const src = cv.imdecode(buffer); //Image is now represented as Mat
    return await _check_face(src);
}
