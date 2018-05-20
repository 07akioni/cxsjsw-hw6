const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('请确保 localhost 的 3000 及 8000 端口没有被占用')
console.log('前端将运行在 localhost:8000')
console.log('后端将运行在 localhost:3000')  
console.log('开启后端进程...')
exec(`npm start`, { cwd: path.resolve(__dirname, 'be') }, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
})    
console.log('打开前端开发服务器...')
exec(`npm start`, { cwd: path.resolve(__dirname, 'fe') }, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
})                                                 