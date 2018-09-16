define('a', function(require, exports, module) {
    exports.getTime = function () {
        return Date.now();
    }
})