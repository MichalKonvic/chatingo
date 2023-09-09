class Cache {
    private data: {
        [key: string]: unknown
    } = {}
    public set<T>(key: string, value: T) {
        this.data[key] = value;
    }
    get<T>(key: string): T | undefined;
    get<T>(key: string, init?: T): T;
    get<T>(key: string, init?: T) {
        if (!this.data[key]) {
            if (init) {
                this.set(key, init)
                return init as T;
            }
            return undefined;
        }
        return this.data[key] as T;
    }
    public has(key: string): boolean {
        return this?.data[key] ? true : false
    }
}
declare global {
    // eslint-disable-next-line no-var
    var cache: Cache;
}

let cache: Cache;
if (!global.cache) {
    global.cache = new Cache();
}
// eslint-disable-next-line prefer-const
cache = global.cache;

export default cache;
