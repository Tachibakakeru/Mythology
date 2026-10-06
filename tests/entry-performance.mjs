// Optional local diagnostic: node tests/entry-performance.mjs
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
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
  const miyajidake = await evaluate(`(()=>{
    const out=[];
    for(const lang of ['zh-TW','ja']){
      openPantheon('japan');if(japanLocale!==lang)toggleJapanLocale();
      const ids=['jingu','katsumura','katsuyori'];
      const overlap=ids.flatMap(id=>{const a=nodes[id];return Object.values(nodes).filter(b=>b.id!==id&&a.px<b.px+NODE_W-2&&a.px+NODE_W>b.px+2&&a.py<b.py+b.h-2&&a.py+a.h>b.py+2).map(b=>id+':'+b.id);});
      const boxed=[...stage.querySelectorAll('.groupbox')].some(el=>el.textContent.includes('宮地嶽三柱大神'));
      const searchable=['勝村大神','勝頼大神','勝賴大神','Katsuyori'].every(q=>matchNodes(q).some(n=>ids.includes(n.id)));
      const source=ids.every(id=>JP_NODE_SOURCES[id].includes('miyajidake')&&JP_NODE_NAMES[id].shrine.includes('宮地嶽神社')&&nodes[id].desc.includes('宮地嶽'));
      const relations=JP_UNIONS.filter(u=>u.label==='宮地嶽神社で共に祀る');
      const ritual=relations.length===2&&relations.every(u=>u.marriage==='partner'&&!u.children&&!u.parent);
      const edgeIntrusions=[...svg.querySelectorAll('.edge')].flatMap(path=>{const hits=new Set(),len=path.getTotalLength(),related=Number(path.dataset.uid)<2;for(let s=0;s<=len;s+=8){const p=path.getPointAtLength(s);for(const n of Object.values(nodes))if((related||['katsumura','katsuyori'].includes(n.id))&&p.x>n.px+3&&p.x<n.px+NODE_W-3&&p.y>n.py+3&&p.y<n.py+n.h-3)hits.add(path.dataset.uid+':'+n.id);}return [...hits];});
      highlightGroup(0);const lit=stage.querySelectorAll('.node:not(.dim)').length;
      out.push({lang,overlap,edgeIntrusions,boxed,searchable,source,ritual,lit,name:nodes.katsuyori.name,groups:JP_GROUPS.length,relations:JP_UNIONS.length});
    }
    if(japanLocale!=='zh-TW')toggleJapanLocale();return out;
  })()`);
  console.log(JSON.stringify({miyajidake},null,2));
  if(miyajidake.some(v=>v.overlap.length||v.edgeIntrusions.length||v.lit!==3||!v.boxed||!v.searchable||!v.source||!v.ritual||v.name!==(v.lang==='ja'?'勝頼大神':'勝賴大神')))process.exitCode=1;
  const maya = await evaluate(`(() => {
    openMaya();
    const initialScale=scale, rootRect=stage.querySelector('.node[data-id="maya_note"]').getBoundingClientRect(), wrapRect=wrap.getBoundingClientRect();
    const initialRootVisible=rootRect.left>=wrapRect.left&&rootRect.right<=wrapRect.right&&rootRect.top>=wrapRect.top&&rootRect.bottom<=wrapRect.bottom;
    const initialAllVisible=[...stage.querySelectorAll('.node')].every(el=>{ const a=el.getBoundingClientRect(); return a.left>=wrapRect.left-2&&a.right<=wrapRect.right+2&&a.top>=wrapRect.top-2&&a.bottom<=wrapRect.bottom+2; });
    const creatorSearch=['古庫馬茲','Gukumatz','Gucumatz','Qucumatz','羽蛇神','人類的創造者之一'].every(q=>matchNodes(q).some(n=>n.id==='my_plumed_serpent'));
    const ids=MY_NODE_DEFS.map(n=>n[0]), known=new Set(ids), seen=new Set();
    const duplicates=ids.filter(id=>seen.has(id)||!(seen.add(id)));
    const missingGroups=MY_GROUPS.flatMap(([name,members])=>members.filter(id=>!known.has(id)).map(id=>name+':'+id));
    const missingRelations=MY_UNIONS.flatMap(u=>[u.parent,...(u.spouses||[]),...(u.children||[])].filter(id=>id&&!known.has(id)));
    const missingSources=ids.filter(id=>!MY_NODE_SOURCES[id]?.length||MY_NODE_SOURCES[id].some(key=>!MY_SOURCE_LIBRARY[key]));
    const overlap=Object.values(nodes).flatMap(a=>Object.values(nodes).filter(b=>b.id>a.id&&a.px<b.px+NODE_W-2&&a.px+NODE_W>b.px+2&&a.py<b.py+b.h-2&&a.py+a.h>b.py+2).map(b=>a.id+':'+b.id));
    const boxes=[...stage.querySelectorAll('.groupbox')];
    const unboxed=boxes.filter(el=>el.classList.contains('marker-only')).map(el=>MY_GROUPS[Number(el.dataset.gi)]?.[0]);
    const rendered=stage.querySelectorAll('.node').length;
    focusNode('my_hunahpu');
    const sourceLinks=document.querySelectorAll('#p-sources a').length;
    const farIdx=MY_GROUPS.findIndex(([name])=>name==='跨世代：基采至卡維克');
    highlightGroup(farIdx);
    const lit=stage.querySelectorAll('.node:not(.dim)').length;
    const dim=stage.querySelectorAll('.node.dim').length;
    return {nodes:ids.length,rendered,groups:MY_GROUPS.length,relations:MY_UNIONS.length,initialScale,initialRootVisible,initialAllVisible,creatorSearch,duplicates,missingGroups,missingRelations,missingSources,overlap,boxed:boxes.length-unboxed.length,unboxed,lit,dim,expectedLit:MY_GROUPS[farIdx][1].length,sourceLinks,region:document.querySelector('.myth-icon[onclick="openMaya()"]').dataset.region};
  })()`);
  console.log(JSON.stringify({maya,pageErrors}, null, 2));
  if (maya.nodes!==maya.rendered||maya.sourceLinks<1||maya.region!=='americas'||!maya.initialRootVisible||!maya.initialAllVisible||!maya.creatorSearch||maya.boxed!==maya.groups-5||maya.lit!==maya.expectedLit||maya.dim!==maya.nodes-maya.expectedLit||['duplicates','missingGroups','missingRelations','missingSources','overlap'].some(k=>maya[k].length)||pageErrors.length) process.exitCode=1;
  await request('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  const mayaMobile=await evaluate(`(() => { fitInitial(); const b=wrap.getBoundingClientRect(); return {scale,allVisible:[...stage.querySelectorAll('.node')].every(el=>{const a=el.getBoundingClientRect();return a.left>=b.left-2&&a.right<=b.right+2&&a.top>=b.top-2&&a.bottom<=b.bottom+2;})}; })()`);
  console.log(JSON.stringify({mayaMobile}, null, 2));
  if(!mayaMobile.allVisible) process.exitCode=1;
  await request('Emulation.clearDeviceMetricsOverride');
  const aztec = await evaluate(`(() => {
    openAztec();
    const ids=AZ_NODE_DEFS.map(n=>n[0]), known=new Set(ids), seen=new Set(), bounds=wrap.getBoundingClientRect();
    const duplicates=ids.filter(id=>seen.has(id)||!seen.add(id));
    const malformed=AZ_NODE_DEFS.filter(d=>d.length<7||typeof d[3]!=='string'||!Number.isFinite(d[4])||!Number.isFinite(d[5])||!d[6]).map(d=>d[0]);
    const badStyles=AZ_UNIONS.filter(u=>u.spouses&&!['primary','secondary','partner'].includes(u.marriage)).map(u=>u.label);
    const missingGroups=AZ_GROUPS.flatMap(([name,members])=>members.filter(id=>!known.has(id)).map(id=>name+':'+id));
    const missingRelations=AZ_UNIONS.flatMap(u=>[u.parent,...(u.spouses||[]),...(u.children||[])].filter(id=>id&&!known.has(id)));
    const linked=new Set(AZ_UNIONS.flatMap(u=>[u.parent,...(u.spouses||[]),...(u.children||[])].filter(Boolean)));
    const orphans=ids.filter(id=>!linked.has(id));
    const missingSources=ids.filter(id=>!AZ_NODE_SOURCES[id]?.length||AZ_NODE_SOURCES[id].some(k=>!AZ_SOURCE_LIBRARY[k]));
    const missingPanels=ids.filter(id=>{openPanel(nodes[id]); return !document.querySelector('#p-sources a');});
    const edgeIntrusions=[...svg.querySelectorAll('.edge')].flatMap(path=>{const hits=new Set(),len=path.getTotalLength();for(let s=0;s<=len;s+=8){const p=path.getPointAtLength(s);for(const n of Object.values(nodes))if(p.x>n.px+3&&p.x<n.px+NODE_W-3&&p.y>n.py+3&&p.y<n.py+n.h-3)hits.add(path.dataset.uid+':'+n.id);}return [...hits];});
    closePanel();
    const overlap=Object.values(nodes).flatMap(a=>Object.values(nodes).filter(b=>b.id>a.id&&a.px<b.px+NODE_W-2&&a.px+NODE_W>b.px+2&&a.py<b.py+b.h-2&&a.py+a.h>b.py+2).map(b=>a.id+':'+b.id));
    const boxes=[...stage.querySelectorAll('.groupbox')], markerNames=boxes.filter(el=>el.classList.contains('marker-only')).map(el=>AZ_GROUPS[+el.dataset.gi][0]);
    fitInitial();
    const allVisible=[...stage.querySelectorAll('.node')].every(el=>{const a=el.getBoundingClientRect();return a.left>=bounds.left-2&&a.right<=bounds.right+2&&a.top>=bounds.top-2&&a.bottom<=bounds.bottom+2;});
    const search=[['羽蛇神','az_quetzalcoatl'],['Quetzalcoatl','az_quetzalcoatl'],['惠齊洛波契特利','az_huitzilopochtli'],['五個太陽','az_suns'],['太陽傳說','az_leyenda'],['托皮爾津','az_topiltzin'],['黑曜石蝴蝶','az_itzpapalotl'],['新火典禮','az_new_fire'],['阿茲特蘭','az_aztlan'],['鹽女神','az_huixtocihuatl'],['Huehueteotl','az_xiuhtecuhtli'],['淨化女神','az_tlazolteotl'],['花王','az_xochipilli'],['Centeotl','az_cinteotl'],['二十日名','az_day_signs'],['Tóxcatl','az_toxcatl'],['我們的祖母','az_toci']].every(([q,id])=>matchNodes(q).some(n=>n.id===id));
    const cross=AZ_GROUPS.findIndex(([name])=>name==='跨故事的主要神祇'); highlightGroup(cross);
    const lit=stage.querySelectorAll('.node:not(.dim)').length, expectedLit=AZ_GROUPS[cross][1].length;
    highlightGroup(AZ_GROUPS.findIndex(g=>g[0]==='九位夜主（跨故事神格）'));
    const nightLit=stage.querySelectorAll('.node:not(.dim)').length;
    const newSearch=[['九夜主','az_night_lords'],['山之心','az_tepeyollotl'],['灶火女神','az_chantico'],['寶玉火雞神','az_chalchiuhtotolin'],['墨西哥人圖畫史','az_paintings']].every(([q,id])=>matchNodes(q).some(n=>n.id===id));
    return {nodes:ids.length,rendered:stage.querySelectorAll('.node').length,groups:AZ_GROUPS.length,relations:AZ_UNIONS.length,duplicates,malformed,badStyles,missingGroups,missingRelations,orphans,missingSources,missingPanels,overlap,edgeIntrusions,boxed:boxes.length-markerNames.length,markerNames,allVisible,search,lit,expectedLit,nightLit,newSearch,region:document.querySelector('.myth-icon[onclick="openAztec()"]').dataset.region};
  })()`);
  console.log(JSON.stringify({aztec,pageErrors},null,2));
  if(aztec.nightLit!==9||!aztec.newSearch)process.exitCode=1;
  if(aztec.nodes!==aztec.rendered||aztec.boxed!==aztec.groups-3||aztec.markerNames.length!==3||!aztec.allVisible||!aztec.search||aztec.lit!==aztec.expectedLit||aztec.region!=='americas'||['duplicates','malformed','badStyles','missingGroups','missingRelations','orphans','missingSources','missingPanels','overlap','edgeIntrusions'].some(k=>aztec[k].length)||pageErrors.length) process.exitCode=1;
  const aztecExport=await evaluate(`(async()=>{let saved;const create=URL.createObjectURL,click=HTMLAnchorElement.prototype.click,original=LIVE_EDITS.aztec.az_note;try{LIVE_EDITS.aztec.az_note={name:'匯出驗證 $&'};URL.createObjectURL=blob=>{saved=blob;return 'blob:test';};HTMLAnchorElement.prototype.click=()=>{};await exportHTML();return (await saved.text()).includes('const AZTEC_USER_EDITS = '+JSON.stringify(LIVE_EDITS.aztec)+';');}finally{URL.createObjectURL=create;HTMLAnchorElement.prototype.click=click;if(original)LIVE_EDITS.aztec.az_note=original;else delete LIVE_EDITS.aztec.az_note;}})()`);
  console.log(JSON.stringify({aztecExport},null,2));if(!aztecExport)process.exitCode=1;
  await request('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  const aztecMobile=await evaluate(`(async()=>{clearHighlight();closePanel();fitInitial();const b=wrap.getBoundingClientRect();const allVisible=[...stage.querySelectorAll('.node')].every(el=>{const a=el.getBoundingClientRect();return a.left>=b.left-2&&a.right<=b.right+2&&a.top>=b.top-2&&a.bottom<=b.bottom+2;});focusNode('az_quetzalcoatl');await new Promise(r=>setTimeout(r,1000));const n=stage.querySelector('.node[data-id="az_quetzalcoatl"]').getBoundingClientRect(),p=document.getElementById('panel').getBoundingClientRect();return {allVisible,panelVisible:p.width>0&&p.left>=-2&&p.right<=392,nodeVisible:n.left>=b.left-2&&n.right<=b.right+2&&n.bottom<=p.top+2,sourceLinks:document.querySelectorAll('#p-sources a').length};})()`);
  console.log(JSON.stringify({aztecMobile},null,2));
  if(!aztecMobile.allVisible||!aztecMobile.panelVisible||!aztecMobile.nodeVisible||!aztecMobile.sourceLinks) process.exitCode=1;
  if(process.env.AZTEC_MOBILE_SCREENSHOT){const shot=await request('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});writeFileSync(process.env.AZTEC_MOBILE_SCREENSHOT,Buffer.from(shot.data,'base64'));}
  const mobileFocus={};
  for(const key of ['japan','buddhism','china','maya']){
    await evaluate(`openPantheon('${key}')`);
    await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
    await evaluate('focusNode(NODE_DEFS[0][0])');
    // 大型長圖在 headless Chromium 中可能晚一畫格才提交動畫；等實際矩陣到目標，不猜固定延遲。
    for(let i=0;i<60;i++){
      if(await evaluate('Math.abs(new DOMMatrix(getComputedStyle(stage).transform).a-scale)<0.001'))break;
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    await new Promise(resolve=>setTimeout(resolve,300));
    mobileFocus[key]=await evaluate(`(()=>{const a=stage.querySelector('.node[data-id="'+NODE_DEFS[0][0]+'"]').getBoundingClientRect(),b=wrap.getBoundingClientRect(),p=panel.getBoundingClientRect();return {visible:a.left>=b.left-2&&a.right<=b.right+2&&a.top>=b.top-2&&a.bottom<=p.top+2,left:a.left,right:a.right,top:a.top,bottom:a.bottom,panelTop:p.top};})()`);
  }
  console.log(JSON.stringify({mobileFocus},null,2));if(Object.values(mobileFocus).some(v=>!v.visible))process.exitCode=1;
  await request('Emulation.clearDeviceMetricsOverride');
  if(process.env.AZTEC_SCREENSHOT){
    await request('Emulation.setDeviceMetricsOverride',{width:1600,height:900,deviceScaleFactor:1,mobile:false});
    await evaluate('openAztec();closePanel();highlightGroup(AZ_GROUPS.findIndex(g=>g[0]==="昌蒂科：家火與化犬異文"))');await new Promise(r=>setTimeout(r,1400));
    const shot=await request('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});writeFileSync(process.env.AZTEC_SCREENSHOT,Buffer.from(shot.data,'base64'));
  }
  await evaluate('openMaya()');
  if (process.env.MAYA_INITIAL_SCREENSHOT) {
    await request('Emulation.setDeviceMetricsOverride', { width: 1600, height: 900, deviceScaleFactor: 1, mobile: false });
    await evaluate('clearHighlight(); closePanel(); fitInitial()');
    await new Promise(resolve => setTimeout(resolve, 250));
    const shot=await request('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    writeFileSync(process.env.MAYA_INITIAL_SCREENSHOT, Buffer.from(shot.data,'base64'));
  }
  if (process.env.MAYA_SCREENSHOT) {
    await request('Emulation.setDeviceMetricsOverride', { width: 1600, height: 900, deviceScaleFactor: 1, mobile: false });
    await new Promise(resolve => setTimeout(resolve, 200));
    await evaluate('highlightGroup(0)');
    await new Promise(resolve => setTimeout(resolve, 1400));
    const shot=await request('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    writeFileSync(process.env.MAYA_SCREENSHOT, Buffer.from(shot.data,'base64'));
  }
  if (process.env.MAYA_MOBILE_SCREENSHOT) {
    await request('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await new Promise(resolve => setTimeout(resolve, 200));
    await evaluate("focusNode('my_hunahpu')");
    await new Promise(resolve => setTimeout(resolve, 1400));
    const shot=await request('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    writeFileSync(process.env.MAYA_MOBILE_SCREENSHOT, Buffer.from(shot.data,'base64'));
  }
  // 自有 headless 預覽驗證：模擬已保存檔案的 revision 差異，不改專案檔或使用者偏好。
  await request('Page.navigate',{url:'http://127.0.0.1:7788/tools/preview.html'});
  for(let i=0;i<60;i++){
    if(await evaluate("document.getElementById('preview')?.contentDocument?.querySelector('#stage .node')!==null && !!document.getElementById('preview')?.contentDocument?.querySelector('#stage .node')"))break;
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  const preview=await evaluate(`(async()=>{
    const before=frame.contentDocument.querySelectorAll('#stage .node').length;
    revision='test-previous-revision';await check();
    const reloaded=frame.getAttribute('src').includes('?preview=');
    return {before,reloaded,expected:${aztec.nodes}};
  })()`);
  for(let i=0;i<60;i++){
    if(await evaluate(`document.getElementById("preview")?.contentWindow?.location.search.startsWith('?preview=') && document.getElementById("preview")?.contentDocument?.querySelectorAll("#stage .node").length===${aztec.nodes}`))break;
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  preview.after=await evaluate('frame.contentDocument.querySelectorAll("#stage .node").length');
  preview.status=await evaluate('document.getElementById("status").textContent');
  preview.page=await evaluate('frame.contentDocument.getElementById("japan")?.dataset.pantheon');
  console.log(JSON.stringify({preview},null,2));
  if(preview.before!==preview.expected||preview.after!==preview.expected||!preview.reloaded)process.exitCode=1;
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
