import { Watcher } from "./watcher";

let uid = 0;

export default class Dep {
    static target: Watcher;
    id: number;
    private subs: Array<Watcher>;
    construct() {
        uid = uid + 1
        this.id = uid
        this.subs = []
    }
    addSub(sub : Watcher) {
        this.subs.push(sub)
    }
    removeSub(sub: Watcher) {
        let index = this.subs.indexOf(sub)
        if (index !== -1) {
            this.subs.splice(index, 1)
        }
    }
    notify() {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
    depend() {
        Dep.target.addDep(this as Dep);
    }
}