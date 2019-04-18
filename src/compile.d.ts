import MVVM from "./mvvm";

declare class Compile{
    $vm: MVVM;
    $el: HTMLElement;
    constructor(el: HTMLElement, vm: MVVM);
    private compileElement(el: HTMLElement): void;
    private nodeFragment(el: HTMLElement): DocumentFragment;
}

declare function compileMVVM(el: HTMLElement, vm: MVVM): void;