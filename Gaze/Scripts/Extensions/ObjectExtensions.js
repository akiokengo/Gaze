Object.IsNullOrUndefined = (obj) => {
    if (obj == null)
        return true;
    if (obj === null)
        return true;
    if (typeof obj === 'undefined')
        return true;
    return false;
};
//# sourceMappingURL=ObjectExtensions.js.map