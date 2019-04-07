import Dep from "./dep";

export function observe(value) {
    if (!value || typeof value !== "object") {
        return
    }
    return new Observer(value).walk()
}

class Observer {
    constructor(value) {
        this.value = value
    }
    walk() {
        let obj = this.value
        Object.keys(obj).forEach(key => {
            this.observeProperty(obj, key, obj[key])
        })
        return obj;
    }
    observeProperty(obj, key, val) {
        let dep = new Dep()
        let childOb = observe(val)
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function () {
                if (Dep.target) {
                    dep.depend()
                }
                if (childOb) {
                    childOb.dep.depend()
                }
                return val
            },
            set: function (newVal) {
                if (val === newVal || (newVal !== newVal && val !== val)) {
                    return
                }
                val = newVal
                childOb = observe(newVal)
                dep.notify()
            }
        })
    }
}
