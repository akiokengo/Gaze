"Where".ExtendedPrototype(Array.prototype, function (predicate) {
    let me = this;
    return me.filter(value => predicate(value));
});
"FirstOrDefault".ExtendedPrototype(Array.prototype, function (predicate) {
    let me = this;
    if (predicate) {
        me = me.filter(x => predicate(x));
    }
    return 0 < me.length ? me[0] : null;
});
//# sourceMappingURL=EnumerableExtensions.js.map