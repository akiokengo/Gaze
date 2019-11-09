interface Array<T> {
    Where(predicate: (value: T) => boolean): Array<T>;
    FirstOrDefault(predicate?: (x: T) => boolean): T;
    LastOrDefault(predicate?: (x: T) => boolean): T;
}
"Where".ExtendedPrototype(
    Array.prototype,
    function (predicate: (value: any) => boolean) {
        let me: Array<any> = this;
        return me.filter(value => predicate(value));
    }
);
"FirstOrDefault".ExtendedPrototype(
    Array.prototype,
    function (predicate?: (x: any) => boolean) {
        let me: Array<any> = this;

        if (predicate) {
            me = me.filter(x => predicate(x));
        }
        return 0 < me.length ? me[0] : null;
    }
);
