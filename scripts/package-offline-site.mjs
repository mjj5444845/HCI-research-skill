import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(root,'site'),out=path.join(root,'release-dist','AMSC-Research-Site');
if(!fs.existsSync(path.join(source,'index.html')))throw Error('Build site first');
if(fs.existsSync(out))throw Error('Output exists; use a clean build directory');
fs.mkdirSync(out,{recursive:true});const site=path.join(out,'site');fs.cpSync(source,site,{recursive:true});
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const sha=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
let changed=0;
for(const file of walk(site).filter(f=>f.endsWith('.html'))){
 const html=fs.readFileSync(file,'utf8').replace(/href="([^"]*)"/g,(match,href)=>{
  if(/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\?)/i.test(href))return match;
  const at=href.search(/[?#]/),clean=at<0?href:href.slice(0,at),suffix=at<0?'':href.slice(at);
  const target=path.resolve(path.dirname(file),clean||'.');
  if(!fs.existsSync(target)||!fs.statSync(target).isDirectory())return match;
  changed++;return 'href="'+path.relative(path.dirname(file),path.join(target,'index.html')).split(path.sep).join('/')+suffix+'"';
 });fs.writeFileSync(file,html);
}
fs.writeFileSync(path.join(out,'打开研究网站.html'),'<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AMSC研究网站 · 离线入口</title><style>body{font:18px/1.7 system-ui;max-width:760px;margin:10vh auto;padding:24px;color:#183e33}a{color:#176b5b}</style><h1>AMSC研究网站</h1><p><a href="site/index.html">进入网站首页 →</a></p><p><a href="site/program/index.html">研究主线与五阶段成果 →</a></p><p>请先解压整个压缩包并保留site文件夹。无需安装软件；外部论文链接需联网。本包是发布快照，不自动同步。</p><small>版本：'+sha.slice(0,7)+'</small><script>location.replace("site/index.html");</script></html>');
fs.writeFileSync(path.join(out,'使用说明.txt'),'AMSC研究网站 — 离线阅读版\n\n1. 解压整个压缩包。\n2. 双击“打开研究网站.html”。\n3. 保留site文件夹，无需安装Node或启动服务器。\n\n主线、论文库和筛选在本地运行。外部论文来源需要联网。\n此为发布快照，后续更新请重新下载。研究artifact蓝图仍为计划。\nRelease下载权限取决于GitHub仓库权限；本地副本不受GitHub访问控制。\n\n来源提交：'+sha+'\n');
fs.writeFileSync(path.join(out,'release-manifest.json'),JSON.stringify({source_commit:sha,built_at:new Date().toISOString(),entry:'打开研究网站.html',offline:true},null,2));
for(const file of walk(out).filter(f=>f.endsWith('.html'))){
 for(const [,href] of fs.readFileSync(file,'utf8').matchAll(/(?:href|src)="([^"]*)"/g)){
  if(/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href))continue;
  const clean=href.split(/[?#]/)[0];if(!clean)continue;
  const target=path.resolve(path.dirname(file),clean);
  if(!fs.existsSync(target)||fs.statSync(target).isDirectory())throw Error('Invalid offline link '+href+' in '+file);
 }
}
console.log('Offline package ready: '+out+'; '+changed+' links converted.');

