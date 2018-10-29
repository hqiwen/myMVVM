export class Dep{
    uid = 0;
    target = null;
    construct() {
        this.id = Dep.uid + 1;
        //watchers
        this.subs = [];
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
        Dep.target.addDep(this);
    }
};