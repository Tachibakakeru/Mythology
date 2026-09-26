// Optional local diagnostic: node tests/entry-performance.mjs
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, basename, resolve } from 'node:path';

const chrome = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const profile = mkdtempSync(join(tmpdir(), 'mythology-entry-'));
const port = 19339;
const child = spawn(chrome, ['--headless=new', '--no-first-run', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'http://127.0.0.1:7788/'], { stdio: 'ignore' });
let socket;
try {
  let target;
  for (let i = 0; i < 80; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.type === 'page' && t.url.startsWith('http://127.0.0.1:7788/')); if (target) break; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (!target) throw new Error('Chrome remote debugging did not start');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  let nextId = 0;
  const pending = new Map();
  const pageErrors = [];
  socket.addEventListener('message', ev => {
    const msg = JSON.parse(ev.data);
    if (msg.method === 'Runtime.exceptionThrown') pageErrors.push(msg.params.exceptionDetails.text);
    if (!msg.id || !pending.has(msg.id)) return;
    const { resolve, reject } = pending.get(msg.id); pending.delete(msg.id);
    msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
  });
  const request = async (method, params = {}) => {
    const id = ++nextId;
    const reply = new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    socket.send(JSON.stringify({ id, method, params }));
    return reply;
  };
  const evaluate = async expression => {
    const result = await request('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  await request('Runtime.enable');
  for (let i = 0; i < 100 && await evaluate('typeof openChina') !== 'function'; i++) await new Promise(resolve => setTimeout(resolve, 100));
  if (await evaluate('typeof openChina') !== 'function') throw new Error('Mythology page did not initialize');
  if (process.env.WAIT_IDLE_FONT === '1') await evaluate('document.fonts.ready');
  if (process.env.PROFILE === '1') { await request('Profiler.enable'); await request('Profiler.start'); }
  const result = await evaluate(`(async () => {
    const segments = {};
    for (const name of ['layoutNodes', 'renderGraph', 'fitInitial']) {
      const original = window[name];
      window[name] = function(...args) { const start = performance.now(); try { return original.apply(this, args); } finally { segments[name] = { count: (segments[name]?.count || 0) + 1, totalMs: (segments[name]?.totalMs || 0) + Math.round(performance.now() - start) }; } };
    }
    const start = performance.now();
    openChina();
    const sync = performance.now() - start;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await new Promise(resolve => setTimeout(resolve, 300));
    return { syncMs: Math.round(sync), twoFrameMs: Math.round(performance.now() - start - 300), segments, nodes: Object.keys(nodes).length, groups: GROUPS.length, relations: UNIONS.length };
  })()`);
  console.log(JSON.stringify(result, null, 2));
  const integrity = await evaluate(`(() => {
    const ids=CN_NODE_DEFS.map(n=>n[0]), known=new Set(ids), seen=new Set();
    const duplicates=ids.filter(id=>seen.has(id)||!(seen.add(id)));
    const missingGroups=CN_GROUPS.flatMap(([name,members])=>members.filter(id=>!known.has(id)).map(id=>name+':'+id));
    const missingRelations=CN_UNIONS.flatMap(u=>[u.parent,...(u.spouses||[]),...(u.children||[])].filter(id=>id&&!known.has(id)));
    const added=[...CN_REDBOY_IDS,...CN_CHECHI_IDS,...CN_BIGAN_IDS,...CN_BAOLIAN_IDS,...CN_XIAOQIAN_IDS,...CN_PAINTED_SKIN_IDS];
    const missingSources=added.filter(id=>!CN_NODE_SOURCES[id]?.length||CN_NODE_SOURCES[id].some(key=>!CN_SOURCE_LIBRARY[key]));
    const missingRendered=added.filter(id=>!stage.querySelector('.node[data-id="'+id+'"]'));
    const overlap=added.flatMap(id=>{
      const a=nodes[id]; return Object.values(nodes).filter(b=>b.id!==id&&a.px<b.px+NODE_W-2&&a.px+NODE_W>b.px+2&&a.py<b.py+b.h-2&&a.py+a.h>b.py+2).map(b=>id+':'+b.id);
    });
    const groupBoxes=CN_GROUPS.slice(-6).map(([name])=>({name,boxed:!![...stage.querySelectorAll('.groupbox')].find(el=>el.textContent.includes(name))}));
    return {duplicates,missingGroups,missingRelations,missingSources,missingRendered,overlap,groupBoxes};
  })()`);
  integrity.pageErrors = pageErrors;
  console.log(JSON.stringify(integrity, null, 2));
  if (Object.values(integrity).some(value=>Array.isArray(value)&&value.length&&typeof value[0]==='string')) process.exitCode=1;
  const sharedRender = await evaluate(`(() => { const out={}; for(const key of ['buddhism','japan']) { openPantheon(key); out[key]={data:Object.keys(nodes).length,rendered:stage.querySelectorAll('.node').length}; } return out; })()`);
  console.log(JSON.stringify({sharedRender,pageErrors}, null, 2));
  if (Object.values(sharedRender).some(v=>!v.data||v.data!==v.rendered)||pageErrors.length) process.exitCode=1;
  if (process.env.PROFILE === '1') {
    const { profile } = await request('Profiler.stop');
    const counts = new Map();
    for (const id of profile.samples || []) counts.set(id, (counts.get(id) || 0) + 1);
    const hot = profile.nodes.map(n => ({ name: n.callFrame.functionName || '(anonymous)', line: n.callFrame.lineNumber + 1, samples: counts.get(n.id) || 0 }))
      .sort((a, b) => b.samples - a.samples).slice(0, 12);
    console.log(JSON.stringify(hot, null, 2));
  }
} finally {
  socket?.close();
  child.kill();
  if (dirname(resolve(profile)) === resolve(tmpdir()) && basename(profile).startsWith('mythology-entry-')) {
    await new Promise(resolve => child.once('exit', resolve));
    rmSync(profile, { recursive: true, force: true });
  }
}
