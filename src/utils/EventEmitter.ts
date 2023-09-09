/* eslint-disable @typescript-eslint/no-explicit-any */
type CallbackListener = (...args: any[]) => void
export default class ReEventEmitter {
    private listeners: { [key: string]: CallbackListener[] } = {};

    constructor(public emit: (event: string, ...data: any[]) => void) { }
    on(event: string, callback: CallbackListener) {
        if (!Object.hasOwn(this.listeners, event)) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(callback);

        return this;
    }
    _reEmit(event: string, ...data: any[]) {

        if (!Object.hasOwn(this.listeners, event)) {
            return null;
        }

        for (let i = 0; i < this.listeners[event].length; i++) {
            const callback = this.listeners[event][i];
            callback.call(this, ...data);
        }
    }
}