const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const element=()=>({dataset:{},style:{},children:[],append(...items){this.children.push(...items);},addEventListener(){}});
const context=vm.createContext({document:{createElement:element},japanLocale:'zh-TW',location:{hostname:'example.com'}});
vm.runInContext(fs.readFileSync(path.join(root,'assets/fgo/catalog.js'),'utf8'),context);
const images=vm.runInContext('FGO_IMAGES',context);
assert.equal(images.length,114);
assert.equal(new Set(images.map(im=>im.key)).size,111);
const files=new Set(images.map(im=>im.src)),hashes=new Set();
assert.equal(files.size,106);
for(const im of images){
  assert.match(im.key,/^[a-z]+:[a-z0-9_]+$/);
  assert.match(im.src,/^assets\/fgo\/[a-z0-9_-]+\.(png|jpg|webp)$/);
  assert.ok(im.name&&im.note&&im.imageSource);
  assert.ok(vm.runInContext('FGO_IMAGE_SOURCES',context).has(im.source));
}
for(const file of files){
  const bytes=fs.readFileSync(path.join(root,file));
  assert.ok(bytes.length>1000,file);
  hashes.add(crypto.createHash('sha256').update(bytes).digest('hex'));
}
assert.equal(hashes.size,106,'no redundant image files');
const figures=element();context.figures=figures;
vm.runInContext("appendFgoFigures('japan:yamatotakeru',figures)",context);
assert.equal(figures.children.length,1,'public hostname renders without private overlay');
assert.equal(figures.children[0].dataset.fgo,'comparison');
assert.match(figures.children[0].children[0].src,/^assets\/fgo\//);
context.japanLocale='ja';context.figures=element();
vm.runInContext("appendFgoFigures('japan:hoderi',figures)",context);
assert.match(context.figures.children[0].children[1].children[0].textContent,/FGO参照画像/);
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.ok(index.includes('<script src="assets/fgo/catalog.js"></script>'));
assert.ok(!index.includes('private-media/fgo/'));
const preview=fs.readFileSync(path.join(root,'tools/preview.html'),'utf8');
assert.ok(!preview.includes('private-media/fgo/'));
console.log('FGO assets OK: 114 entries / 111 nodes / 106 unique files; public host and Japanese captions');
