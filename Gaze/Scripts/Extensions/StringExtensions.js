String.IsNullOrEmpty = (str) => !str;
String.IsNullOrWhiteSpace = (s) => String.IsNullOrEmpty(s) || s.replace(/\s/g, '').length < 1;
;
Object.defineProperty(String.prototype, "ExtendedPrototype", {
    configurable: true,
    enumerable: false,
    writable: true,
    value: function (key, value) {
        let me = this;
        Object.defineProperty(key, me, {
            configurable: true,
            enumerable: false,
            writable: true,
            value: value
        });
    }
});
//# sourceMappingURL=StringExtensions.js.map