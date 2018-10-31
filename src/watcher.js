import Dep from "./dep"

export class Watcher {
    /**
   *Creates an instance of Watcher.
   * @param {*} vm instance of mvvm
   * @param {*} expOrFn isDirective(attrName){let exp = attr.name}
   * @param {*} cb function (value, oldValue) {
                  updateFn && updateFn(node, value, oldValue);
                }
   * @memberof Watcher
   */
    constructor(vm, expOrFn, cb) {
        this.vm = vm
        this.expOrFn = expOrFn.trim()
        this.cb = cb
        this.depIds = []

        if (typeof expOrFn === "function") {
            this.getter = expOrFn
        } else {
            this.getter = this.parseGetter(expOrFn)
        }

        this.value = this.get()
    }
    update() {
        this.run()
    }
    run() {
        let newValue = this.get()
        let oldValue = this.value
        if (newValue === oldValue) return
        this.value = newValue
        this.cb.call(this.vm, newValue, oldValue)
    }
    get() {
        Dep.target = this
        let value = this.getter.call(this.vm, this.vm)
        Dep.target = null
        return value
    }
    addDep(dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this)
            this.depIds[dep.id] = dep
        }
    }
    parseGetter(exp) {
        if (/[^/w.$]/.test(exp)) return
        let exps = exp.split(".")

        return function(obj) {
            for (let i = 0; i < exps.length; i++) {
                if (!obj) return
                obj = obj[exps[i]]
            }
            return obj
        }
    }
}

