define('b', ['require', 'exports', 'a'], function (require, exports, a) {
    exports.test = function () {
        return {
            time: a.getTime()
        }
    }
})