import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]||'dist');
http.createServer((req,res)=>{let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return}let file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file)){res.writeHead(404).end('Not found');return}res.setHeader('Content-Type',({'html':'text/html','css':'text/css','js':'text/javascript','png':'image/png','jpg':'image/jpeg','jpeg':'image/jpeg','svg':'image/svg+xml','pdf':'application/pdf'})[file.split('.').pop()]||'application/octet-stream');fs.createReadStream(file).pipe(res)}).listen(4321,'127.0.0.1',()=>console.log('http://127.0.0.1:4321'));
