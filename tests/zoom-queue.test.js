const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');
for (const [name, applied] of [['queueTransform', 'applyTransform'], ['yQueueTransform', 'yApplyTransform']]) {
  const flag = name === 'queueTransform' ? 'transformQueued' : 'yTransformQueued';
  const source = html.match(new RegExp(`let ${flag}=false;\\s*function ${name}\\(\\)\\{[\\s\\S]*?\\n\\}`))?.[0];
  assert.ok(source, `${name} exists`);
  const frames = [];
  let writes = 0;
  const context = {requestAnimationFrame: callback => frames.push(callback), [applied]: () => writes++};
  vm.runInNewContext(source, context);
  context[name]();
  context[name]();
  assert.equal(frames.length, 1, `${name} coalesces events`);
  frames.shift()();
  assert.equal(writes, 1);
  context[name]();
  assert.equal(frames.length, 1, `${name} accepts next frame`);
}
console.log('zoom queues OK');

const near = {style:{visibility:''}}, far = {style:{visibility:''}};
const cull = {
  graphPaintItems:[[near,0,0,10,10],[far,500,0,510,10]],
  graphView:undefined, wrap:{clientWidth:100,clientHeight:100}, scale:1, tx:0, ty:0
};
vm.runInNewContext(html.slice(html.indexOf('function cullGraph('),html.indexOf('function applyTransform(){')),cull);
cull.cullGraph();
assert.equal(far.style.visibility,'hidden');
cull.tx=-500;
cull.cullGraph(true);
assert.equal(near.style.visibility,''); // 平滑轉場途中的舊視角仍可見
cull.cullGraph();
assert.equal(near.style.visibility,'hidden');
assert.equal(far.style.visibility,'');
console.log('graph culling OK');
