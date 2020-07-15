// 使用严格模式
'use strict';

let name = 'node.js';

console.log(`hello ${name}!`);

// 1. 模块
// 1.1 定义模块
function calculator(a,b){
    return a + b;
}
function saying(){
    console.log('汪汪汪...');
}
// 1.2 导出模块
// 方式一：
module.exports = {calculator,saying};
// 方式二：
// exports.calculator = calculator;
// exports.saying = saying;

