import { compileMVVM } from "./compile";
import { observe } from "./observe";

interface Options{
    el: HTMLElement;
    data: object;
    [key: string]: any;
}

export default class MVVM {
    $options: Options;
    _data: object;
    constructor(options: Options) {
        this.$options = options;
        let data = this._data = this.$options.data;

        Object.keys(data).forEach(key => {
            this._proxyData(key);
        });
        observe(data)
        compileMVVM(options.el || document.body, this as MVVM)
    }
    //MVVM实例代理数据的属性，vm.name = vm.data.name
    _proxyData(key: string): void {
        let self = this as MVVM;
         Object.defineProperty(self, key, {
            configurable: false,
            enumerable: true,
            get: function proxyGetter() {
                return self._data[key];
            },
            set: function proxySetter(newVal) {
                self._data[key] = newVal
            },
        });
    }
}