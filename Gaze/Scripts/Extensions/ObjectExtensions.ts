interface ObjectConstructor {
    IsNullOrUndefined(obj: any): boolean;
    IsPromise(obj: any): boolean;
    NameOf(name: any): string;
}

Object.IsNullOrUndefined = (obj: any) => {
    if (obj == null) return true;
    if (obj === null) return true;
    if (typeof obj === 'undefined') return true;
    return false;
};
