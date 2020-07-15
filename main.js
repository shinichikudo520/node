// 使用严格模式
'use strict';

// 1.3 引入模块
let node = require('./node');
let calcRes = node.calculator(1, 2);
console.log('计算结果：', calcRes);
node.saying();

// 3. 基础模块
// 3.1 global,node中的唯一个全局对象
// console.log('global',global);
// 3.2 process,代表当前node.js的进程
// console.log('process',process);
console.log('当前工作的目录', process.cwd());
/**
 * a. node.js是单线程模型，不断执行响应事件的js函数，直到没有响应事情的函数可执行，则退出
 * b. 想要在下一次事件响应中执行的代码，可以调用process.nextTick();
 * c. nextTick()不是立即执行，而是等下一次事件循环
 */
process.nextTick(function () {
    console.log('后执行...');
});
console.log('先执行...');
// 监听node退出事件
process.on('exit', function (code) {
    console.log(111111111111);
    console.log('node exit：', code);
});

// 4. 判断js的执行环境
if (typeof window === 'undefined') {
    console.log('正处于：node.js');
} else {
    console.log('正处于：browser...');
}

// 5. fs(内置模块)：文件系统模块，负责读写文件,同时提供了异步和同步的方法
const fs = require('fs');
// 5.1 异步读取文件
// a. 注意读取文件的路径
// b. 文件编码注意为utf-8
// 注意:node.js中回调函数的写法通常是err错误信息在前，实际数据在后的写法
fs.readFile('sample.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log('读取文件失败：', err);
    } else {
        console.log('读取文件成功：', data);
    }
});
// 5.2 读取二进制文件，如读取一个图片文件
fs.readFile('sample.jpg', function (err, data) {
    if (err) {
        console.log('读取文件失败：', err);
    } else {
        console.log('读取文件成功：', data);
        console.log('文件大小：', data.length + 'bytes');
        // 当读取二进制文件时，不传入文件编码时，回调函数的data参数将返回一个Buffer
        // 在node.js中，Buffer对象是一个包含零个或者任意个字节的数组（注意与Array不同）
        // Buffer可以转换为string
        // let text = data.toString('utf-8');
        // console.log('Buffer转换为String',text);
        // string转换为Buffer
        // let buf = Buffer.from(text,'utf-8');
        // console.log(buf);
    }
});
// 5.3 同步读取文件
try {
    let data = fs.readFileSync('sample.jpg', 'utf-8');
    console.log('同步读取文件...');
} catch (error) {
    console.log('同步读取文件出错：', error);
}
// 5.4 异步写入文件
// 参数说明：
// 第一个参数为文件名
// 第二个参数为数据，如果传入的是string，则默认按utf-8写入文本文件，如果是buffer，则写入二进制文件
// 第三个参数为回调函数，返回写入成功与否
// 注意，如果文件重名，则会覆盖内容
let content = '这是异步写入文件的内容...';
fs.writeFile('output.txt', content, function (err) {
    if (err) {
        console.log('写入文件失败...', err);
    } else {
        console.log('写入文件：ok!');
    }
});
// 5.5 同步写入文件
let content2 = '这是同步写入文件的内容...';
fs.writeFileSync('output1.txt', content2);

// 5.6 stat：获取文件大小，创建时间的等信息
fs.stat('sample.txt', function (err, data) {
    if (err) {
        console.log('获取文件信息失败：', err);
    } else {
        // 是否是文件
        let isFile = data.isFile();
        console.log('isFile：', isFile);
        // 是否是目录
        let isDirectory = data.isDirectory()
        console.log('isDirectory：', isDirectory);
        if (isFile) {
            // 文件大小
            console.log('size：', data.size);
            // 创建时间：date对象
            console.log('create time:', data.birthtime);
            // 修改时间：date对象
            console.log('modified time:', data.mtime);
        }

    }
});
// 5.7 同步读取文件信息
let stat = fs.statSync('sample.txt');
console.log('同步读取文件信息：', stat);

// 6. stream：node.js提供仅在服务区端可用的模块，目的是支持'流'这种数据结构
// node.js中流也是一个对象，响应流的事件
// 6.1 流的形式读取文件
// 打开一个流
let rs = fs.createReadStream('sample.txt', 'utf-8');
// data事件表示流的数据已经可以读取了
// 注意，data事件可能会多次，每次传递的chunk是流的一部分数据
rs.on('data', function (chunk) {
    console.log('数据流的data事件...', chunk);
});
// end事件表示这个流已经到末尾了，没有数据可以读取了
rs.on('end', function () {
    console.log('数据流的end事件...');
});
// error事件表示出错
rs.on('error', function (err) {
    console.log('数据流的error事件...', err);
})
// 6.2 流的形式写入文件
// 创建一个写入流，如果文件不存在会创建一个新文件
let ws = fs.createWriteStream('output2.txt', 'utf-8');
// write()写入内容
ws.write('使用stream写入文本数据...\n');
ws.write('END...\n');
// 结束写入
ws.end();

// 7. pipe：将两个数据流串起来
// 当readable流读取完毕后，会自动将所有数据写入目标文件里，实际上就是一个复制文件的程序
let ws1 = fs.createWriteStream('copied.txt');
rs.pipe(ws1, { end: false });

// 8. 解析url的模块,url.parse()；
const url = require('url');
console.log(url.parse('http://user:pass@host.com:8080/path/to/file?query=string#hash'));
// 9. 处理本地文件目录path模块
const path = require('path');
// 解析当前目录
let workDir = path.resolve('.');
console.log('path解析，当前目录........', workDir);
// 组合文件路径
let fileUrl = path.join(workDir, 'main.js');
console.log('拼接文件路径：.............', fileUrl);


// 10. http：提供request和response对象
// request：封装了http请求，可以拿到所有http请求的信息
// response：封装了http响应，可以把http响应返回给浏览器
const http = require('http');
var root = path.resolve(process.argv[2] || '.');
console.log('static root dir:' + root);
// 创建一个http server
let server = http.createServer(function (request, response) {
    // console.log(request.method + ':' + request.url);
    // response.writeHead(200,{'Content-Type':'text/html'});
    // response.end('<h1>hello world!</h1>');
    // 获得请求url的path，类似 '/css/bootstrap.css':
    let pathName = url.parse(request.url).pathname;
    // 获取到本地文件路径,，类似 '/srv/www/css/bootstrap.css':
    let filePath = path.join(root, pathName);
    // 读取文件状态
    fs.stat(filePath, function (err, stats) {
        if (err) {
            // 错误响应
            response.writeHead(404);
            response.end('404 Not Found');
        } else {
            // 请求的是 / 根目录，自动匹配到index.html活着default.html
            if(stats.isDirectory()){
                let index = filePath + '/index.html';
                let df = filePath + '/default.html';
                // 查找文件
                if(fs.existsSync(index)){
                    filePath = index;
                }else{
                    filePath = df;
                }
            }
             // 成功响应
             response.writeHead(200);
             // 没有必要手动读取文件内容。由于response对象本身是一个Writable Stream，直接用pipe()方法就实现了自动读取文件内容并输出到HTTP响应。
             fs.createReadStream(filePath).pipe(response);
        }
    });
});
// 让服务器监听8000端口
server.listen(8000);
console.log('Server is running at http://127.0.0.1:8000/');

// 访问 http://127.0.0.1:8000/index.html

// 11. crypto：提供通用的加密和哈希算法
const crypto = require('crypto');
const  md5 = crypto.createHash('md5');
md5.update('hello world!');
md5.update('hello node.js!');
console.log('md5加密.....',md5.digest('hex'));


