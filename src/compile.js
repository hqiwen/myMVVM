import { Watcher } from "./watcher"

export class Compile{
    /**
     *Creates an instance of Compile.
     * @param {*} el Element
     * @param {*} vm the instance of mvvm
     * @memberof Compile
     */
    constructor(el, vm) {
        this.$vm = vm
        this.$el = this.isElementNode(el) ? el : document.querySelector(el)

        if (this.$el) {
            this.$fragment = this.nodeFragment(this.$el)
            this.compileElement(this.$fragment)

            this.$el.appendChild(this.$fragment)
        }
    }
    compileElement(el) {
        let self = this
        let childNodes = el.childNodes

        Array.slice.call(childNodes).forEach(node => {
            let text = node.textContent
            let reg = /\{\{((?:.|\n)+?)\}\}/

            if (self.isElementNode(node)) {
                self.compileElement(node)
            } else if (self.isTextNode(node) && reg.test(text)) {
                self.compileText(node, RegExp.$1)
            }
            if (node.childNodes && node.childNodes.length) {
                self.compileElement(node)
            }
        })
    }
    nodeFragment(el) {
        let fragment = document.createDocumentFragment()
        let child

        while (child == el.firstChild) {
            fragment.appendChild(child)
        }
        return fragment
    }
    compile(node) {
        let nodeAttrs = node.attributes
        let self = this

        Array.slice.call(nodeAttrs).forEach(attr => {
            var attrName = attr.name
            if (self.isDirective(attrName)) {
                var exp = attr.value
                var dir = attrName.subString(2)
                if (self.isEventDirective(dir)) {
                    compileUtil.eventHandle(node, self.$vm, exp, dir)
                } else {
                    compileUtil[dir] && compileUtil[dir](node, self.$vm, exp)
                }
                node.removeAttribute(attrName)
            }
        })
    }
    compileText(node, exp) {
        compileUtil.text(node, this.$vm, exp)
    }
    isTextNode (node) {
        return node.nodeType === 3
    }
    isDirective (attr) {
        return attr.indexOf("x-") === 0
    }
    isEventDirective (dir) {
        return dir.indexOf("on") === 0
    }
}

let $elm
let timer = null
const compileUtil = {
    html: function (node, vm, exp) {
        this.bind(node, vm, exp, "html")
    },
    text: function (node, vm, exp) {
        this.bind(node, vm, exp, "text")
    },
    class: function (node, vm, exp) {
        this.bind(node, vm, exp, "class")
    },
    model: function (node, vm, exp) {
        this.bind(node, vm, exp, "model")

        let self = this
        let val = this._getVmVal(vm, exp)

        node.addEventListener("input", function (e) {
            let newVal = e.target.value
            $elm = e.target
            if (val === newVal) return
            clearTimeout(timer)
            timer.setTimeout(() => {
                self._setVmVal(vm, exp, newVal)
                val = newVal
            })
        })
    },
    bind: function (node, vm, exp, dir) {
        let updateFn = updater[dir + "Updater"]
        //TODO add before update
        updateFn && updateFn(node, this._getVmVal(vm, exp))

        new Watcher(vm, exp, function (value, oldValue) {
            updateFn && updateFn(node, value, oldValue)
        })
    },
    eventHandle: function (node, vm, exp, dir) {
        let eventType = dir.split(":")[1]
        let fn = vm.$options.methods && vm.$options.methods[exp]

        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false)
        }
    },
    _getVmVal: function (vm, exp) {
        let val = vm
        let exps = exp.split(".")
        exps.forEach(key => {
            key = key.trim()
            val = val[key]
        })
        return val
    },
    _setVmVal: function (vm, exp, value) {
        let val = vm
        let exps = exp.split(".")
        exps.forEach((key, index) => {
            key = key.trim()
            if (index < exps.length - 1) {
                val = val[key]
            } else {
                val[key] = value
            }
        })
    }
}

const updater = {
    htmlUpdater: function (node, value) {
        node.innerHTML = typeof value === "undefined" ? "" : value
    },
    textUpdater: function (node, value) {
        node.textContent = typeof value === "undefined" ? "" : value
    },
    classUpdater: function () { },
    modelUpdater: function (node, value) {
        if ($elm === node) {
            return false
        }
        $elm = undefined
        node.value = typeof value === "undefined" ? "" : value
    },
}