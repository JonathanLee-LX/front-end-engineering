const path = require('path');
const fs = require('fs');
const vm = require('vm');


/**
 *定义一个Module函数对象，每个模块都是一个Module对象
 * @param {String} path 模块的绝对路径
 */
function Module(path) {
    this.id = path;
    this.exports = {}; // 当前模块的导出对象
    this.loaded = false; // 标记，表示当前模块是否被加载过了
}

Module.wrapper = [
    "(function (exports, require, module, __dirname, __filename) {",
    "\n})"
];

// 根据模块路径进行缓存的模块对象
Module._cacheModule = {};

//  处理不同文件后缀名的方法
Module._extensions = {
    ".js": function (module) {
        // 读取 js 文件，返回文件的内容
        let script = fs.readFileSync(module.id, "utf8");

        // 给  js 文件的内容增加一个闭包环境
        let fn = Module.wrapper[script];

        // 创建虚拟机，将我们创建的 js 函数执行，将 this 指向模块实例的 exports 属性
        vm.runInThisContext(fn).call(
            module.exports,
            module.exports,
            req,
            module
        );

        // 返回模块实例上的 exports 属性（即模块的内容）
        return module.exports;
    },
    ".json": function (module) {
        // .json 文件的处理相对简单，将读出的字符串转换成对象即可
        return JSON.parse(fs.readFileSync(module.id, "utf8"));
    }
};


/**
 *为了防止和Node的全局函数require冲突，创建一个req全局函数
 * @param {*} moduleId
 */
function req(moduleId) {
    let p = Module._resolveFileName(moduleId);
    //  生成一个新的模块
    let module = new Module(p);
}

/**
 *_resolveFileName方法用来将req函数中的传入的参数moduleId解析成带后缀名的绝对路径
 *
 * @param {String} moduleId
 */
Module._resolveFileName = function(moduleId) {
    let p = path.resolve(moduleId);

    if(!/\.\w+$/.test(p)){
        let arr = Object.keys(Module._extensions);

        for(let i = 0; i < arr.length; i++){
            let file = p + arr[i];
            try{
                fs.accessSync(file);
                return file;
            }catch(err) {
                if(i >= arr.length) throw new Error("not found module");
            }
        }
    }else {
        return p;
    }
}

/*
* @param {String} moduleId
*/
function req(moduleId) {
    // 将 req 传入的参数处理成绝对路径
    let p = Module._resolveFileName(moduleId);

    if(Module._cacheModule[p]){
        return Module._cacheModule[p].exports;
    }
    // 生成一个新的模块
    let module = new Module(p);

    // ********** 下面为新增代码 **********
    // 加载模块
    let content = module.load(p);

    // 将加载过的模块对象缓存起来，并打上标记
    Module._cacheModule[p] = module;
    module.loaded = true;

    // 将加载后返回的内容赋值给模块实例的 exports 属性上
    module.exports = content;

    // 最后返回 模块实例的 exports 属性，即加载模块的内容
    return module.exports;
    // ********** 上面为新增代码 **********
}

// 模块加载的方法
Module.prototype.load = function (filepath) {
    // 判断加载的文件是什么后缀名
    let ext = path.extname(filepath);

    // 根据不同的后缀名处理文件内容，参数是当前实例
    let content = Module._extensions[ext](this);

    // 将处理后的结果返回
    return content;
};


const  a = req('./a.js')
console.log(a);
