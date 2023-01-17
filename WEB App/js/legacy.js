if (typeof Array.prototype.find != "function") {
    Array.prototype.find = function (predicate) {
        for (var i = 0, value; i < this.length; i++) {
            value = this[i];
            if (predicate.call(this, value)) return value;
        }
        return undefined;
    }
}