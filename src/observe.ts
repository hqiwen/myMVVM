import Dep from "./dep";

export function observe(value: object): Observer;
export function observe(value: number | string | boolean | null): void;
export function observe(value) {
    if (!value || typeof value !== "object") return;
    return new Observer(value).walk()
}

interface ObserverInit{
    value: object;
    dep: Dep;
}

class Observer implements ObserverInit{
    value: object;
    dep: Dep;
    constructor(value: object) {
        this.value = value;
    }
    walk() {
        let obj = this.value;
        Object.keys(obj).forEach(key => {
            this.observeProperty(obj, key, obj[key]);
        });
        return this as Observer;
    }
    //代理data的属性，让访问时自动添加Watcher，更新时自动更新函数
    private observeProperty(obj : object, key: string, val: any) {
        let dep = new Dep();
        let childOb = observe(val);
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function() {
                if (Dep.target) {
                    dep.depend();
                }
                if (childOb) {
                    childOb.dep.depend();
                }
                return val;
            },
            set: function(newVal) {
                if (val === newVal || (newVal !== newVal && val !== val)) {
                    return;
                }
                val = newVal;
                childOb = observe(newVal);
                dep.notify();
            }
        });
    }
}