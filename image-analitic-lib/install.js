var fs = require('fs')
var public_dir = process.cwd() + '/../../public/'
if (fs.existsSync(public_dir)) {
    fs.copyFileSync(__dirname + '/facefinder', public_dir + 'facefinder');
    fs.copyFileSync(__dirname + '/opencv.js', public_dir + 'opencv.js');
    fs.copyFileSync(__dirname + '/mrz/mrz-worker.bundle-min-wrapped.js', public_dir + 'mrz-worker.bundle-min-wrapped.js');

    var indexHTMLFile = public_dir + 'index.html';
    if (fs.existsSync(indexHTMLFile)) {
        var contents = fs.readFileSync(indexHTMLFile, 'utf-8');
        if (!contents.includes(`<script src="opencv.js"></script>`)) {
            contents = contents + `<script src="opencv.js"></script>`;
            fs.writeFileSync(indexHTMLFile, contents);
        }

        if (!contents.includes(`<script src="mrz-worker.bundle-min-wrapped.js"></script>`)) {
            contents = contents.replace('<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />',
                '<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />\n    <script src="mrz-worker.bundle-min-wrapped.js"></script>')
            fs.writeFileSync(indexHTMLFile, contents);
        }
    }
}
