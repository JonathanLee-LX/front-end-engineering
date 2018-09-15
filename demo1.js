var glob = require('glob');
var path = require('path')
var chunks = getCommonsChunk('**/*.js', 'src/js/page/');
console.log(chunks)

function getCommonsChunk(globPath, pathDir) {
    var files = glob.sync(globPath);
    var entries = [],
        entry, dirname, basename, extname;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        entries.push(basename);
    }
    return entries;
}