let uid = 0
Dep.target = null
export default class Dep{
    construct() {
        uid = uid + 1
        this.id = uid
        //watchers
        this.subs = []
    }
    addSub(sub) {
        this.subs.push(sub)
    }
    removeSub(sub) {
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
    //add Watcher 
    //Dep.target : new Watcher
    depend(){
        Dep.target.addDep(this)
    }
}