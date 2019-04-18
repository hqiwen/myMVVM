import Dep from "./dep";
import MVVM from "./mvvm";

export class Watcher {
    vm: MVVM
    cb: Function;
    expOrFn: Function | String;
    depIds: Array<Dep>;
    getter: Function;
    value: number | string | boolean;
    constructor(vm: MVVM, expOrFn: String | Function, cb: Function) {
        this.vm = vm
        this.expOrFn = expOrFn
        this.cb = cb
        this.depIds = []

        if (typeof expOrFn === "function") {
            this.getter = expOrFn
        } else {
            this.getter = this.parseGetter(expOrFn.trim());
        }

        this.value = this.get()
    }
    update() {
        this.run()
    }
    addDep(dep: Dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this as Watcher)
            this.depIds[dep.id] = dep
        }
    }
   private run() {
        let newValue = this.get()
        let oldValue = this.value
        if (newValue === oldValue) return
        this.value = newValue
        this.cb.call(this.vm, newValue, oldValue)
    }
    private get() {
        Dep.target = this as Watcher
        let value = this.getter.call(this.vm, this.vm)
        Dep.target = null
        return value
    }
   private parseGetter(exp): Function {
        if (/[^/w.$]/.test(exp)) return
        let exps = exp.split(".")

        return function (obj: MVVM) {
            for (let i = 0; i < exps.length; i++) {
                if (!obj) return
                obj = obj[exps[i]]
            }
            return obj
        }
    }
}