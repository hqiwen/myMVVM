# myMVVM

## 用法

```html
<div id="app">
    <p>hello {{world}}<p>
    <button x-on:click="handleClick" />
</div>
```

```js
import MVVM from "MVVM"

const vm = new MVVM({
    el:"#app",
    data:{
        world:"world"
    },
    methods:{
        handleClick(){
            this.data = "mvvm"
        }
    }
})
```