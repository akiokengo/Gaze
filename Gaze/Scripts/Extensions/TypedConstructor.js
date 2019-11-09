var Gaze;
(function (Gaze) {
    class TypedFactory {
        constructor(_ctor) {
            this._ctor = _ctor;
        }
        CreateInstance() {
            return new this._ctor();
        }
    }
    Gaze.TypedFactory = TypedFactory;
})(Gaze || (Gaze = {}));
//# sourceMappingURL=TypedConstructor.js.map