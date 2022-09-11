
    module.exports.iterify = function iterify(obj) {
        obj[Symbol.iterator] = function () {
            return this;
        };
    }
