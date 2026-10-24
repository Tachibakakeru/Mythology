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
    if (msg.method === 'Runtime.exceptionThrown') pageErrors.push(msg.params.exceptionDetails.exception?.description||msg.params.exceptionDetails.text);
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
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  await request('Runtime.enable');
  for (let i = 0; i < 100 && await evaluate('typeof openChina') !== 'function'; i++) await new Promise(resolve => setTimeout(resolve, 100));
  if (await evaluate('typeof openChina') !== 'function') throw new Error('Mythology page did not initialize');
  if(pageErrors.length)throw new Error(pageErrors.join('\n'));
  const aliasSearch=await evaluate(`(()=>{
    homeSearchPages=buildHomeSearchPages();
    const failures=[];let identities=0,aliases=0,targets=0;
    for(const page of homeSearchPages){
      const defs=page.key==='yokai'?YOKAI_DEFS:PANTHEONS[page.key].defs;
      const objects=Object.fromEntries(defs.map(d=>[d[0],{id:d[0]}]));
      for(const record of page.records.filter(r=>!r.related)){
        for(const name of new Set(record.identities.filter(Boolean))){
          identities++;
          if(!searchPageNodes(page.key,objects,name).some(h=>h.node.id===record.nodeIds[0]&&h.kind==='direct'))failures.push([page.key,record.nodeIds[0],name]);
        }
      }
      for(const [id,list] of Object.entries({...SEARCH_ALIAS_ADDITIONS[page.key],...LEGEND_PERSON_VARIANTS[page.key]})){
        targets++;aliases+=list.length;
        if(!list.every(a=>PANTHEONS[page.key].names[id].aliases.includes(a)))failures.push([page.key,id,'aliases missing']);
      }
      for(const r of page.records.filter(r=>r.related))if(r.identities.some(Boolean)&&!searchPageNodes(page.key,objects,r.identities.find(Boolean)).length)failures.push([page.key,r.label,'no related target']);
    }
    const bw=Object.fromEntries(PANTHEONS.beowulf.defs.map(d=>[d[0],{id:d[0]}]));
    const hit=q=>searchPageNodes('beowulf',bw,q).find(h=>h.node.id==='bw_sigemund');
    const distinction=hit('齊格飛')?.kind==='mention'&&hit('齊格蒙德')?.kind==='direct'&&!PANTHEONS.beowulf.names.bw_sigemund.aliases.includes('齊格飛');
    const spelling=[['Sigurðr','Sigurdr'],['Æschere','Aeschere'],['Ongenþēow','Ongentheow'],['Hızır','Hizir'],['Mīkāʾēl','Mikael']].every(([a,b])=>normalizePageSearch(a)===normalizePageSearch(b));
    const correctCupid=!GR_NODE_NAMES.zeus.aliases.includes('丘比特')&&GR_NODE_NAMES.eros.aliases.includes('邱比特');
    return {pages:homeSearchPages.length,identities,targets,aliases,failures,distinction,spelling,correctCupid};
  })()`);
  console.log(JSON.stringify({aliasSearch},null,2));
  if(aliasSearch.failures.length||!aliasSearch.distinction||!aliasSearch.spelling||!aliasSearch.correctCupid)process.exitCode=1;
  if(process.env.AUDIT_ALIASES==='1')for(const row of await evaluate(`Object.entries(PANTHEONS).map(([k,p])=>({key:k,nodes:p.defs.length,withAliases:p.defs.filter(d=>p.names[d[0]]?.aliases?.length).length,missing:p.defs.filter(d=>!d[7]&&!p.names[d[0]]?.aliases?.length).slice(0,12).map(d=>[d[0],d[1],d[2]])}))`))console.log('ALIAS_AUDIT '+JSON.stringify(row));
  const uniqueLogos=await evaluate(`(()=>{
    const normalize=s=>s.trim().replaceAll(String.fromCharCode(0xfe0f),'');
    const cards=[...document.querySelectorAll('#wheel .myth-icon')].map(c=>({page:c.querySelector('.label').textContent,logo:normalize(c.querySelector('.glyph').textContent)||c.querySelector('.glyph svg')?.outerHTML||''}));
    const headers=Object.entries(PANTHEONS).map(([page,p])=>({page,logo:normalize(p.title.split(' ')[0])}));
    headers.push({page:'yokai',logo:normalize(JP_UI['zh-TW'].yokaiTitle.split(' ')[0])});
    const duplicates=items=>items.filter((a,i)=>!a.logo||items.some((b,j)=>j<i&&a.logo===b.logo)).map(a=>a.page);
    const changed=['nibelungen','beowulf','cid'].every(k=>cards.some(c=>c.page===LEGENDS[k].title.slice(LEGENDS[k].title.indexOf(' ')+1)&&c.logo===normalize(PANTHEONS[k].title.split(' ')[0])));
    return {cards:cards.length,headers:headers.length,duplicateCards:duplicates(cards),duplicateHeaders:duplicates(headers),changed};
  })()`);
  console.log(JSON.stringify({uniqueLogos},null,2));
  if(uniqueLogos.duplicateCards.length||uniqueLogos.duplicateHeaders.length||!uniqueLogos.changed)process.exitCode=1;
  const homeSearch=await evaluate(`(async()=>{
    const keys=['kalevala','ulster','fianna','mabinogion','manas','dede','mwindo','panji','hangtuah'];
    const input=q=>{homeSearchInput.value=q;homeSearchInput.dispatchEvent(new Event('input',{bubbles:true}))};
    const key=k=>homeSearchInput.dispatchEvent(new KeyboardEvent('keydown',{key:k,bubbles:true,cancelable:true}));
    const back=async()=>{closeJapan();await new Promise(r=>setTimeout(r,330))};
    const registered=keys.every(k=>LEGENDS[k]&&PANTHEONS[k]&&allWheelCards.some(c=>c.dataset.legend===k));
    input('日本');const existing=homeSearchMatches.some(p=>p.key==='japan')&&homeSearchMatches.some(p=>p.key==='yokai');
    input('Cú Chulainn');const accents=homeSearchMatches.some(p=>p.key==='ulster');
    const pagesFor=q=>{input(q);return homeSearchMatches.map(p=>p.key)};
    const allPages=homeSearchPages.length===Object.keys(PANTHEONS).length+1&&new Set(homeSearchPages.map(p=>p.key)).size===homeSearchPages.length;
    const everyPageContent=Object.entries(PANTHEONS).every(([k,p])=>pagesFor(p.defs.find(d=>!d[7])?.[1]||p.defs[0][1]).includes(k));
    const people=pagesFor('天照大神').includes('japan')&&homeSearchResults.textContent.includes('符合：天照大御神')&&pagesFor('Amaterasu').includes('japan');
    const events=pagesFor('那伽蛇祭').includes('india');
    const objects=pagesFor('八咫鏡').includes('japan');
    const places=pagesFor('宮地嶽神社').includes('japan');
    const descriptions=pagesFor('禊洗左眼時誕生').includes('japan')&&homeSearchResults.textContent.includes('內容提及：');
    const crossPages=pagesFor('庫丘林');const multiple=crossPages.includes('celtic')&&crossPages.includes('ulster')&&new Set(crossPages).size===crossPages.length;
    const fallen=pagesFor('路西法');const subpages=fallen.includes('angels')&&fallen.includes('demons')&&pagesFor('河童').includes('yokai');
    const indexedWithoutRendering=Object.keys(nodes).length===0&&document.querySelectorAll('#stage .node').length===0;
    const warmIndex=homeSearchPages;const t=performance.now();pagesFor('天照大神');const cached=homeSearchPages===warmIndex;const warmMs=Math.round(performance.now()-t);
    const oldEdit=LIVE_EDITS.japan.amaterasu;
    let edits=false;
    try{LIVE_EDITS.japan.amaterasu={...oldEdit,name:'首頁測試天照名',aliases:['首頁測試天照別稱']};homeSearchInput.dispatchEvent(new Event('focus'));edits=pagesFor('首頁測試天照別稱').includes('japan')&&homeSearchResults.textContent.includes('首頁測試天照名')}
    finally{if(oldEdit)LIVE_EDITS.japan.amaterasu=oldEdit;else delete LIVE_EDITS.japan.amaterasu;homeSearchPages=null;}
    input('神話');const count=homeSearchMatches.length,index=wheelIndex;
    key('ArrowUp');const up=homeSearchIndex===count-1;key('ArrowDown');const down=homeSearchIndex===0;
    const keyboard=up&&down&&wheelIndex===index&&homeSearchInput.getAttribute('aria-activedescendant')===homeSearchResults.firstElementChild.id;
    const selection=homeSearchIndex;homeSearchInput.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',isComposing:true,bubbles:true}));
    const ime=homeSearchIndex===selection&&document.getElementById('home').style.display!=='none';
    key('Escape');const escape=homeSearchResults.hidden&&homeSearchInput.getAttribute('aria-expanded')==='false';
    input('不存在的頁面xyz');const noResult=homeSearchMatches.length===0&&!!homeSearchResults.querySelector('.home-search-empty');
    input('<img src=x onerror=alert(1)>');const safe=!homeSearchResults.querySelector('img,script');
    homeSearchClear.click();const clear=homeSearchInput.value===''&&homeSearchResults.hidden&&homeSearchClear.hidden;
    input('神話');document.querySelector('#home h1').click();const outside=homeSearchResults.hidden;
    const opened=[];
    for(const k of keys){
      input(k);const i=homeSearchMatches.findIndex(p=>p.key===k);
      if(i<0){opened.push(false);continue}homeSearchResults.children[i].click();
      await new Promise(r=>setTimeout(r,330));opened.push(currentPantheon===k&&document.getElementById('home').style.display==='none');await back();
    }
    input('河童');homeSearchResults.children[homeSearchMatches.findIndex(p=>p.key==='yokai')].click();
    const yokaiOpened=document.getElementById('yokai').style.display==='block'&&document.getElementById('home').style.display==='none';
    closeYokai();await new Promise(r=>setTimeout(r,330));
    input('路西法');homeSearchResults.children[homeSearchMatches.findIndex(p=>p.key==='demons')].click();
    const demonOpened=currentPantheon==='demons';await back();
    const saved=[...hiddenRegions],storage=localStorage.getItem(REGION_FILTER_KEY);
    let hiddenRegion=false;
    try{
      hiddenRegions=new Set(presentRegions);applyRegionFilter();input('漢都亞');const before=localStorage.getItem(REGION_FILTER_KEY);
      key('Enter');await new Promise(r=>setTimeout(r,330));
      hiddenRegion=currentPantheon==='hangtuah'&&WHEEL_N===0&&localStorage.getItem(REGION_FILTER_KEY)===before;await back();
    }finally{hiddenRegions=new Set(saved);applyRegionFilter();if(storage===null)localStorage.removeItem(REGION_FILTER_KEY);else localStorage.setItem(REGION_FILTER_KEY,storage)}
    homeSearchClear.click();
    return {registered,existing,accents,allPages,everyPageContent,people,events,objects,places,descriptions,multiple,subpages,indexedWithoutRendering,cached,warmMs,edits,keyboard,ime,escape,noResult,safe,clear,outside,allNineOpened:opened.every(Boolean),yokaiOpened,demonOpened,hiddenRegion};
  })()`);
  console.log(JSON.stringify({homeSearch},null,2));if(Object.entries(homeSearch).some(([k,v])=>k!=='warmMs'&&!v))process.exitCode=1;
  const aliasUI=await evaluate(`(async()=>{
    homeSearchInput.value='齊格';renderHomeSearch();
    const homepage=homeSearchMatches.some(p=>p.key==='beowulf');
    openHomeSearchResult(homeSearchMatches.findIndex(p=>p.key==='beowulf'));
    searchInput.value='齊格飛';showSearchResults();
    const row=searchResults.querySelector('[data-id="bw_sigemund"]');
    const mention=!!row&&row.textContent.includes('非此人物的別名');
    row?.click();
    const panel=document.getElementById('panel').textContent.includes('齊格蒙德');
    const source=!!document.querySelector('#p-sources a[href*="editions.mml.ox.ac.uk"]');
    searchInput.value='Sigmund';showSearchResults();
    const direct=!!searchResults.querySelector('[data-id="bw_sigemund"]')&&!searchResults.querySelector('[data-id="bw_sigemund"]').textContent.includes('非此人物');
    closeJapan();await new Promise(r=>setTimeout(r,330));
    homeSearchClear.click();
    return {homepage,mention,panel,source,direct};
  })()`);
  console.log(JSON.stringify({aliasUI},null,2));if(Object.values(aliasUI).some(v=>!v))process.exitCode=1;
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
  const portraits=await evaluate(`(async()=>{
    const entries=Object.entries(NODE_PORTRAITS).filter(([key])=>key.startsWith('japan:'));
    const loaded=await Promise.all(entries.map(([,src])=>new Promise(resolve=>{const im=new Image();im.onload=()=>resolve(im.naturalWidth===256&&im.naturalHeight===256);im.onerror=()=>resolve(false);im.src=src})));
    const failures=[];
    for(const [key,src] of entries){
      const id=key.slice(6),card=stage.querySelector('.node[data-id="'+id+'"]');
      if(!nodes[id]||!card?.classList.contains('has-portrait')||!card.style.getPropertyValue('--node-portrait').includes(src)){failures.push(id);continue}
      openPanel(nodes[id]);
      const figures=document.querySelector('#panel .p-figs');
      if(!figures?.textContent.includes('原創節點插畫・非史料形象')||![...figures.querySelectorAll('img')].some(im=>im.getAttribute('src')===src&&im.dataset.cap.includes('非古代圖像史料')))failures.push(id+':panel');
    }
    const im=document.querySelector('#panel .p-figs img');im?.click();
    const lightbox=!!im&&document.getElementById('imgLightbox').classList.contains('open')&&document.querySelector('#imgLightbox div').textContent.includes('非古代圖像史料');
    document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    const closed=!document.getElementById('imgLightbox').classList.contains('open');closePanel();
    return {count:entries.length,loaded:loaded.every(Boolean),failures,lightbox,closed};
  })()`);
  console.log(JSON.stringify({portraits},null,2));
  console.log('PORTRAIT_FAILURES '+JSON.stringify(portraits.failures));
  if(!portraits.loaded||portraits.failures.length||!portraits.lightbox||!portraits.closed)process.exitCode=1;
  const portraitLocale=await evaluate(`(()=>{
    if(japanLocale!=='zh-TW')toggleJapanLocale();
    const id='senka';
    const inspect=()=>{const f=document.querySelector('#p-figs figure'),im=f?.querySelector('img');return {caption:f?.querySelector('figcaption')?.textContent,alt:im?.alt,detail:im?.dataset.cap};};
    openPanel(nodes[id]);
    const initial=inspect(),zh=initial.caption==='原創節點插畫・非史料形象'&&initial.alt.endsWith('原創節點插畫')&&initial.detail.includes('非古代圖像史料');
    toggleJapanLocale();
    const japanese=inspect(),ja=japanese.caption==='オリジナルノードイラスト・史料図像ではありません'&&japanese.alt.endsWith('のオリジナルノードイラスト')&&japanese.detail.includes('古代の史料図像ではありません');
    const originalName=nodes[id].name,quotedName='引用名" data-portrait-break="1"><b>標記</b>&';
    let escaped=false;
    try{
      nodes[id].name=quotedName;openPanel(nodes[id]);
      const f=document.querySelector('#p-figs figure'),im=f.querySelector('img');
      escaped=im.alt===quotedName+'のオリジナルノードイラスト'&&im.dataset.cap===quotedName+JP_UI.ja.portraitDetail&&!im.hasAttribute('data-portrait-break')&&!f.querySelector('b');
    }finally{nodes[id].name=originalName;openPanel(nodes[id]);}
    document.querySelector('#p-figs figure img').click();
    const jaLightbox=document.getElementById('imgLightbox').classList.contains('open')&&document.querySelector('#imgLightbox div').textContent.includes('古代の史料図像ではありません');
    document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    const otherKey=Object.keys(NODE_PORTRAITS).find(key=>!key.startsWith('japan:')&&!key.startsWith('yokai:')),parts=otherKey.split(':');
    openPantheon(parts[0]);openPanel(nodes[parts[1]]);
    const other=inspect(),otherPantheon=japanLocale==='ja'&&other.caption==='原創節點插畫・非史料形象'&&other.detail.includes('非古代圖像史料');
    openPantheon('japan');toggleJapanLocale();openPanel(nodes[id]);
    const restored=inspect(),zhRestored=japanLocale==='zh-TW'&&restored.caption===initial.caption&&restored.alt===initial.alt&&restored.detail===initial.detail;
    closePanel();
    return {zh,ja,escaped,jaLightbox,otherPantheon,zhRestored};
  })()`);
  console.log(JSON.stringify({portraitLocale},null,2));
  if(Object.values(portraitLocale).some(v=>v!==true))process.exitCode=1;
  const greekPortraits=await evaluate(`(async()=>{
    openPantheon('greek');
    const entries=Object.entries(NODE_PORTRAITS).filter(([key])=>key.startsWith('greek:'));
    const loaded=await Promise.all(entries.map(([,src])=>new Promise(r=>{const im=new Image();im.onload=()=>r(im.naturalWidth===256&&im.naturalHeight===256);im.onerror=()=>r(false);im.src=src})));
    const failures=[];
    for(const [key,src] of entries){
      const id=key.slice(6),card=stage.querySelector('.node[data-id="'+id+'"]');
      if(!nodes[id]||!card?.classList.contains('has-portrait')||!card.style.getPropertyValue('--node-portrait').includes(src)){failures.push(id);continue;}
      openPanel(nodes[id]);const figures=document.querySelector('#p-figs');
      if(!figures?.textContent.includes('原創節點插畫・非史料形象')||![...figures.querySelectorAll('img')].some(im=>im.getAttribute('src')===src&&im.dataset.cap.includes('非古代圖像史料')))failures.push(id+':panel');
    }
    const im=document.querySelector('#p-figs img');im?.click();const lightbox=!!im&&document.getElementById('imgLightbox').classList.contains('open');
    document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));const closed=!document.getElementById('imgLightbox').classList.contains('open');closePanel();
    openPantheon('japan');return {count:entries.length,loaded:loaded.every(Boolean),failures,lightbox,closed};
  })()`);
  console.log(JSON.stringify({greekPortraits},null,2));
  if(!greekPortraits.loaded||greekPortraits.failures.length||!greekPortraits.lightbox||!greekPortraits.closed)process.exitCode=1;
  const mesopotamiaPortraits=await evaluate(`(async()=>{
    const entries=Object.entries(NODE_PORTRAITS).filter(([key])=>key.startsWith('mesopotamia:'));
    if(!entries.length)return {count:0,pending:true};
    openPantheon('mesopotamia');
    const failures=[];
    for(const [key,src] of entries){
      const id=key.slice(12),im=new Image();im.src=src;
      try{await im.decode();if(im.naturalWidth!==256||im.naturalHeight!==256)failures.push(id+':size');}catch{failures.push(id+':load');}
      openPanel(nodes[id]);const panelImage=document.querySelector('#p-figs img');
      if(panelImage?.getAttribute('src')!==src||!panelImage.dataset.cap.includes('非古代圖像史料'))failures.push(id+':panel');
      if(!document.querySelector('.node[data-id="'+id+'"]')?.classList.contains('has-portrait'))failures.push(id+':node');
    }
    document.querySelector('#p-figs img')?.click();
    const lightbox=document.getElementById('imgLightbox').classList.contains('open');
    document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    const closed=!document.getElementById('imgLightbox').classList.contains('open');
    closePanel();return {count:entries.length,failures,lightbox,closed};
  })()`);
  console.log(JSON.stringify({mesopotamiaPortraits},null,2));
  if(mesopotamiaPortraits.failures?.length||mesopotamiaPortraits.count&&(!mesopotamiaPortraits.lightbox||!mesopotamiaPortraits.closed))process.exitCode=1;
  const yokaiPortraits=await evaluate(`(async()=>{
    const entries=Object.entries(NODE_PORTRAITS).filter(([key])=>key.startsWith('yokai:'));
    if(!entries.length)return {count:0,pending:true};
    openYokai();if(japanLocale!=='zh-TW')toggleJapanLocale();
    const loaded=await Promise.all(entries.map(([,src])=>new Promise(r=>{const im=new Image();im.onload=()=>r(im.naturalWidth===256&&im.naturalHeight===256);im.onerror=()=>r(false);im.src=src})));
    const failures=[];
    for(const [key,src] of entries){
      const id=key.slice(6),cards=[...ycontent.querySelectorAll('.ycard[data-id="'+id+'"]')];
      if(!yokais[id]||!cards.length||cards.some(c=>!c.classList.contains('has-portrait')||c.querySelector('.ycard-portrait')?.getAttribute('src')!==src))failures.push(id+':card');
      openYPanel(id);
      const im=document.querySelector('#yp-figs figure img');
      if(im?.getAttribute('src')!==src||!im.dataset.cap.includes('非古代圖像史料'))failures.push(id+':panel');
    }
    const id=entries[0][0].slice(6),oldRec=YOKAI_EDITS_LIVE[id],oldFav=JSON.stringify(YOKAI_FAVORITES),oldLS=localStorage.getItem('yokai_favorites');
    let preserved=false,ja=false,lightbox=false,closed=false,favorite=false,search=false,escaped=false;
    try{
      YOKAI_EDITS_LIVE[id]={...oldRec,images:[...(oldRec?.images||[]),{src:entries[0][1],caption:'既有史料測試圖',source:'https://example.com/historical-source'}]};
      openYPanel(id);const figs=document.getElementById('yp-figs');
      preserved=figs.querySelectorAll('figure').length===(oldRec?.images?.length||0)+2&&!!figs.querySelector('a[href="https://example.com/historical-source"]')&&!!document.querySelector('#yp-sources a');
      toggleJapanLocale();ja=figs.querySelector('figcaption').textContent==='オリジナルノードイラスト・史料図像ではありません';
      const name=yokais[id].name;try{yokais[id].name='引用名" data-break="1"><b>文字</b>&';openYPanel(id);const im=figs.querySelector('img');escaped=im.alt===yokais[id].name+JP_UI.ja.portraitAlt&&!im.hasAttribute('data-break')&&!figs.querySelector('b');}finally{yokais[id].name=name;openYPanel(id)}
      figs.querySelector('img').click();lightbox=document.getElementById('imgLightbox').classList.contains('open')&&document.querySelector('#imgLightbox div').textContent.includes('古代の史料図像ではありません');
      document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));closed=!document.getElementById('imgLightbox').classList.contains('open');
      toggleJapanLocale();closeYPanel();const before=!!YOKAI_FAVORITES[id];ycontent.querySelector('.ycard[data-id="'+id+'"] .yfav').click();
      favorite=!!YOKAI_FAVORITES[id]!==before&&!ypanel.classList.contains('open')&&[...ycontent.querySelectorAll('.ycard[data-id="'+id+'"]')].every(c=>c.classList.contains('favorited')===!before&&!!c.querySelector('.ycard-portrait'));
      ysearchInput.value=yokais[id].name;ysearchInput.dispatchEvent(new Event('input',{bubbles:true}));const row=yresults.querySelector('[data-id="'+id+'"]');row?.click();search=!!row&&currentYokaiId===id&&ypanel.classList.contains('open')&&!!document.querySelector('#yp-figs img');
    }finally{
      if(oldRec===undefined)delete YOKAI_EDITS_LIVE[id];else YOKAI_EDITS_LIVE[id]=oldRec;
      YOKAI_FAVORITES=JSON.parse(oldFav);if(oldLS===null)localStorage.removeItem('yokai_favorites');else localStorage.setItem('yokai_favorites',oldLS);
      ysearchInput.value='';showYResults();closeYPanel();renderYokai();backToMyth();
    }
    return {count:entries.length,loaded:loaded.every(Boolean),failures,preserved,ja,escaped,lightbox,closed,favorite,search};
  })()`);
  console.log(JSON.stringify({yokaiPortraits},null,2));
  if(yokaiPortraits.count&&(yokaiPortraits.failures.length||['loaded','preserved','ja','escaped','lightbox','closed','favorite','search'].some(k=>!yokaiPortraits[k])))process.exitCode=1;
  const legends = await evaluate(`(()=>{
    const out=[];
    for(const key of Object.keys(LEGENDS)){
      openPantheon(key);const ids=NODE_DEFS.map(d=>d[0]),known=new Set(ids);
      const refs=UNIONS.flatMap(u=>[u.parent,...(u.spouses||[]),...(u.children||[])].filter(Boolean));
      const overlap=Object.values(nodes).flatMap(a=>Object.values(nodes).filter(b=>b.id>a.id&&a.px<b.px+NODE_W-2&&a.px+NODE_W>b.px+2&&a.py<b.py+b.h-2&&a.py+a.h>b.py+2).map(b=>a.id+':'+b.id));
      const missingSources=ids.filter(id=>{openPanel(nodes[id]);return !document.querySelector('#p-sources a')});
      closePanel();fitInitial();const r=wrap.getBoundingClientRect();
      const allVisible=[...stage.querySelectorAll('.node')].every(el=>{const a=el.getBoundingClientRect();return a.left>=r.left-2&&a.right<=r.right+2&&a.top>=r.top-2&&a.bottom<=r.bottom+2});
      const intrusions=[...svg.querySelectorAll('.edge')].flatMap(path=>{const hits=new Set(),len=path.getTotalLength();for(let s=0;s<=len;s+=8){const p=path.getPointAtLength(s);for(const n of Object.values(nodes))if(p.x>n.px+3&&p.x<n.px+NODE_W-3&&p.y>n.py+3&&p.y<n.py+n.h-3)hits.add(path.dataset.uid+':'+n.id);}return [...hits]});
      const groupSelection=GROUPS.every((g,i)=>{highlightGroup(i);return stage.querySelectorAll('.node:not(.dim)').length===g[1].length});clearHighlight();
      const aliasSearch=ids.every(id=>(PANTHEONS[key].names[id]?.aliases||[]).every(q=>matchNodes(q).some(n=>n.id===id)));
      const missingSourceKeys=LEGENDS[key].sections.flatMap(([,records])=>records.flatMap(r=>(Array.isArray(r[5])?r[5]:[r[5]]).filter(s=>!LEGENDS[key].sources[s]).map(s=>r[0]+':'+s)));
      const narrativePaths=[...svg.querySelectorAll('.edge')].filter(p=>UNIONS[Number(p.dataset.uid)]?.narrative);
      const narrativeStyle=narrativePaths.length>0&&narrativePaths.every(p=>p.classList.contains('narrative')&&getComputedStyle(p).strokeDasharray!=='none')&&document.getElementById('narrativeLegend').style.display!=='none';
      out.push({key,count:ids.length,groups:GROUPS.length,relations:UNIONS.length,duplicates:ids.length-known.size,missingRefs:refs.filter(id=>!known.has(id)),isolated:ids.filter(id=>!refs.includes(id)),overlap,missingSources,missingSourceKeys,allVisible,intrusions,groupSelection,aliasSearch,narrativeStyle,boxes:stage.querySelectorAll('.groupbox:not(.marker-only)').length,searchable:ids.every(id=>matchNodes(nodes[id].name).some(n=>n.id===id))});
    }return out;
  })()`);
  console.log(JSON.stringify({legends},null,2));
  const charlemagne=await evaluate(`(()=>{
    openPantheon('roland');
    const peers=GROUPS.find(g=>g[0]==='十二同儕（牛津本：恰十二名）');
    const astolfo=matchNodes('阿斯托爾福').some(n=>n.id==='rl_astolfo');
    const variants=['Astolfo','Astolpho','阿斯托福','阿斯托爾佛'].every(q=>matchNodes(q).some(n=>n.id==='rl_astolfo'));
    openPanel(nodes.rl_astolfo);const sources=[...document.querySelectorAll('#p-sources a')].map(a=>a.href);closePanel();
    const father=UNIONS.find(u=>u.parent==='rl_aymon');
    return {count:NODE_DEFS.length,groups:GROUPS.length,relations:UNIONS.length,oxfordTwelve:peers?.[1].length===12&&!peers[1].includes('rl_astolfo'),astolfo,variants,source:sources.some(s=>s.includes('Canto_34')),fourSons:father?.children.length===4&&father.children.includes('rl_rinaldo'),newBoxes:GROUPS.slice(6,11).every(g=>[...stage.querySelectorAll('.groupbox:not(.marker-only)')].some(e=>e.textContent.includes(g[0])))};
  })()`);
  console.log(JSON.stringify({charlemagne},null,2));
  if(charlemagne.count!==111||charlemagne.groups!==12||charlemagne.relations!==57||!charlemagne.oxfordTwelve||!charlemagne.astolfo||!charlemagne.variants||!charlemagne.source||!charlemagne.fourSons||!charlemagne.newBoxes)process.exitCode=1;
  if(legends.some(v=>v.duplicates||v.missingRefs.length||v.isolated.length||v.overlap.length||v.missingSources.length||v.missingSourceKeys.length||v.intrusions.length||!v.allVisible||!v.groupSelection||!v.searchable||!v.aliasSearch||!v.narrativeStyle||v.boxes!==v.groups))process.exitCode=1;
  if(process.env.CHECK_LEGEND_SOURCES==='1'){
    const urls=await evaluate(`Object.values(LEGENDS).flatMap(b=>Object.values(b.sources).flatMap(s=>[s.url,s.alternate].filter(Boolean)))`);
    const queue=[...new Set(urls)],results=[];
    await Promise.all(Array.from({length:4},async()=>{
      while(queue.length){const url=queue.shift();try{const res=await fetch(url,{signal:AbortSignal.timeout(12000)});results.push({url,status:res.status,ok:res.ok});await res.body?.cancel();}catch(e){results.push({url,ok:false,error:e.message});}}
    }));
    console.log(JSON.stringify({legendSources:results},null,2));
    // External servers can block automated clients; report separately from local regressions.
  }
  const legendExport=await evaluate(`(async()=>{
    const create=URL.createObjectURL,click=HTMLAnchorElement.prototype.click;
    const keys=Object.keys(LEGENDS),previous=Object.fromEntries(keys.map(k=>[k,LIVE_EDITS[k][k+'_root']]));let saved;
    try{
      keys.forEach(k=>LIVE_EDITS[k][k+'_root']={name:'逐頁匯出 $& '+k});
      URL.createObjectURL=blob=>{saved=blob;return 'blob:legend-test'};HTMLAnchorElement.prototype.click=()=>{};
      await exportHTML();const html=await saved.text(),m=html.match(/const LEGEND_USER_EDITS = ([^\\n]+);/);
      const data=m?JSON.parse(m[1]):{};
      return keys.every(k=>data[k]?.[k+'_root']?.name==='逐頁匯出 $& '+k);
    }finally{
      URL.createObjectURL=create;HTMLAnchorElement.prototype.click=click;
      keys.forEach(k=>{if(previous[k])LIVE_EDITS[k][k+'_root']=previous[k];else delete LIVE_EDITS[k][k+'_root']});
    }
  })()`);
  console.log(JSON.stringify({legendExport},null,2));if(!legendExport)process.exitCode=1;
  const legendCards=await evaluate(`(()=>{
    const keys=Object.keys(LEGENDS),saved=[...hiddenRegions],storage=localStorage.getItem(REGION_FILTER_KEY);
    try{
      hiddenRegions=new Set(presentRegions.filter(r=>r!=='other'));applyRegionFilter();
      const correct=keys.every(k=>allWheelCards.some(c=>c.dataset.legend===k&&c.dataset.region==='other'&&wheelCards.includes(c)));
      const count=wheelCards.filter(c=>c.dataset.legend).length;
      hiddenRegions=new Set(presentRegions);applyRegionFilter();const none=WHEEL_N===0;
      hiddenRegions.clear();applyRegionFilter();const all=keys.every(k=>wheelCards.some(c=>c.dataset.legend===k));
      return {correct,count,none,all};
    }finally{hiddenRegions=new Set(saved);applyRegionFilter();if(storage===null)localStorage.removeItem(REGION_FILTER_KEY);else localStorage.setItem(REGION_FILTER_KEY,storage)}
  })()`);
  console.log(JSON.stringify({legendCards},null,2));if(!legendCards.correct||!legendCards.none||!legendCards.all||legendCards.count!==legends.length)process.exitCode=1;
  await request('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  const homeSearchMobile=await evaluate(`(async()=>{
    closeJapan();await new Promise(r=>setTimeout(r,350));
    homeSearchInput.value='神話';homeSearchInput.dispatchEvent(new Event('input',{bubbles:true}));
    const r=document.getElementById('homeSearchWrap').getBoundingClientRect(),list=homeSearchResults.getBoundingClientRect();
    const fits=innerWidth===390&&document.documentElement.scrollWidth<=390&&r.left>=0&&r.right<=innerWidth&&list.left>=0&&list.right<=innerWidth&&list.bottom<=innerHeight;
    const hiddenScrollbar=getComputedStyle(homeSearchResults).scrollbarWidth==='none'&&getComputedStyle(homeSearchResults).overflowY==='auto';
    homeSearchResults.scrollTop=homeSearchResults.scrollHeight;const scrollable=homeSearchResults.scrollTop>0;
    const theme=document.documentElement.dataset.theme;document.documentElement.dataset.theme='light';
    const light=getComputedStyle(homeSearchInput).color===getComputedStyle(document.body).color;
    if(theme)document.documentElement.dataset.theme=theme;else delete document.documentElement.dataset.theme;
    homeSearchClear.click();return {fits,hiddenScrollbar,scrollable,light};
  })()`);
  console.log(JSON.stringify({homeSearchMobile},null,2));if(Object.values(homeSearchMobile).some(v=>!v))process.exitCode=1;
  const legendMobile=await evaluate(`(async()=>{
    const out=[];
    for(const key of Object.keys(LEGENDS)){
      openPantheon(key);closePanel();fitInitial();const b=wrap.getBoundingClientRect();
      const allVisible=[...stage.querySelectorAll('.node')].every(el=>{const r=el.getBoundingClientRect();return r.left>=b.left-2&&r.right<=b.right+2&&r.top>=b.top-2&&r.bottom<=b.bottom+2});
      const id=NODE_DEFS[NODE_DEFS.length-1][0];
      searchInput.value=nodes[id].name;searchInput.dispatchEvent(new Event('input',{bubbles:true}));
      const result=searchResults.querySelector('[data-id="'+id+'"]');if(!result)throw new Error(key+' search row missing');result.click();
      await new Promise(r=>setTimeout(r,800));
      const p=panel.getBoundingClientRect(),n=stage.querySelector('.node[data-id="'+id+'"]').getBoundingClientRect();
      out.push({key,allVisible,panelVisible:p.top<844&&p.bottom<=845,nodeVisible:n.top>=b.top-2&&n.bottom<=p.top+2&&n.left>=b.left-2&&n.right<=b.right+2,sourceLinks:document.querySelectorAll('#p-sources a').length,rects:{node:{left:n.left,right:n.right,top:n.top,bottom:n.bottom},wrap:{left:b.left,right:b.right,top:b.top,bottom:b.bottom},panelTop:p.top}});
      closePanel();
    }return out;
  })()`);
  console.log(JSON.stringify({legendMobile},null,2));if(legendMobile.some(v=>!v.allVisible||!v.panelVisible||!v.nodeVisible||!v.sourceLinks))process.exitCode=1;
  await request('Emulation.clearDeviceMetricsOverride');
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
  // 等面板與畫布實際過渡完成，不以固定1秒假設在大量圖片下已提交；逾時仍保留原幾何斷言。
  const aztecMobile=await evaluate(`(async()=>{clearHighlight();closePanel();fitInitial();const b=wrap.getBoundingClientRect();const allVisible=[...stage.querySelectorAll('.node')].every(el=>{const a=el.getBoundingClientRect();return a.left>=b.left-2&&a.right<=b.right+2&&a.top>=b.top-2&&a.bottom<=b.bottom+2;});focusNode('az_quetzalcoatl');const settleStart=performance.now(),panelEl=document.getElementById('panel');let settled=false;while(performance.now()-settleStart<6000){await new Promise(r=>setTimeout(r,100));settled=new DOMMatrix(getComputedStyle(panelEl).transform).isIdentity&&![...panelEl.getAnimations(),...stage.getAnimations()].some(a=>a.playState==='running');if(settled)break;}const n=stage.querySelector('.node[data-id="az_quetzalcoatl"]').getBoundingClientRect(),p=document.getElementById('panel').getBoundingClientRect();return {settled,settleMs:Math.round(performance.now()-settleStart),allVisible,panelVisible:p.width>0&&p.left>=-2&&p.right<=392,nodeVisible:n.left>=b.left-2&&n.right<=b.right+2&&n.bottom<=p.top+2,sourceLinks:document.querySelectorAll('#p-sources a').length,rects:{panel:{left:p.left,right:p.right,width:p.width,top:p.top},viewport:innerWidth,document:document.documentElement.clientWidth,transform:getComputedStyle(panelEl).transform}};})()`);
  console.log(JSON.stringify({aztecMobile},null,2));
  if(!aztecMobile.settled||!aztecMobile.allVisible||!aztecMobile.panelVisible||!aztecMobile.nodeVisible||!aztecMobile.sourceLinks) process.exitCode=1;
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
  const portraitMobile=await evaluate(`(async()=>{
    openPantheon('japan');await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    const id=Object.keys(NODE_PORTRAITS).filter(k=>k.startsWith('japan:')).at(-1).slice(6);focusNode(id);
    for(let i=0;i<60;i++){if(Math.abs(new DOMMatrix(getComputedStyle(stage).transform).a-scale)<0.001)break;await new Promise(r=>setTimeout(r,100))}
    await new Promise(r=>setTimeout(r,300));
    const n=stage.querySelector('.node[data-id="'+id+'"]').getBoundingClientRect(),p=panel.getBoundingClientRect(),b=wrap.getBoundingClientRect();
    const im=document.querySelector('#panel .p-figs img'),a=im?.getBoundingClientRect();
    im?.click();const enlarged=document.querySelector('#imgLightbox img').getBoundingClientRect();
    const lightboxFits=document.getElementById('imgLightbox').classList.contains('open')&&enlarged.width>0&&enlarged.left>=0&&enlarged.right<=innerWidth;
    document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    return {id,viewport:innerWidth,nodeVisible:n.left>=b.left-2&&n.right<=b.right+2&&n.top>=b.top-2&&n.bottom<=p.top+2,imageFits:!!a&&a.width>0&&a.left>=p.left&&a.right<=p.right,caption:document.querySelector('#panel .p-figs').textContent.includes('原創節點插畫・非史料形象'),lightboxFits,closed:!document.getElementById('imgLightbox').classList.contains('open')};
  })()`);
  console.log(JSON.stringify({portraitMobile},null,2));
  if(['nodeVisible','imageFits','caption','lightboxFits','closed'].some(k=>!portraitMobile[k]))process.exitCode=1;
  const greekPortraitMobile=await evaluate(`(async()=>{
    openPantheon('greek');const id='gaia';focusNode(id);const pEl=document.getElementById('panel');
    for(let i=0;i<60;i++){if(new DOMMatrix(getComputedStyle(pEl).transform).isIdentity&&![...pEl.getAnimations(),...stage.getAnimations()].some(a=>a.playState==='running'))break;await new Promise(r=>setTimeout(r,100));}
    const im=document.querySelector('#p-figs img');await im.decode();const p=pEl.getBoundingClientRect(),r=im.getBoundingClientRect(),n=stage.querySelector('.node[data-id="'+id+'"]').getBoundingClientRect(),b=wrap.getBoundingClientRect();
    im.click();const enlarged=document.querySelector('#imgLightbox img').getBoundingClientRect();
    const out={id,viewport:innerWidth,nodeVisible:n.left>=b.left-2&&n.right<=b.right+2&&n.top>=b.top-2&&n.bottom<=p.top+2,imageFits:r.width>0&&r.left>=p.left&&r.right<=p.right,caption:document.querySelector('#p-figs').textContent.includes('原創節點插畫・非史料形象'),lightboxFits:document.getElementById('imgLightbox').classList.contains('open')&&enlarged.width>0&&enlarged.left>=0&&enlarged.right<=innerWidth};
    document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));out.closed=!document.getElementById('imgLightbox').classList.contains('open');closePanel();return out;
  })()`);
  console.log(JSON.stringify({greekPortraitMobile},null,2));
  if(['nodeVisible','imageFits','caption','lightboxFits','closed'].some(k=>!greekPortraitMobile[k]))process.exitCode=1;
  const mesopotamiaPortraitMobile=await evaluate(`(async()=>{
    openPantheon('mesopotamia');const id=Object.keys(NODE_PORTRAITS).filter(k=>k.startsWith('mesopotamia:')).at(-1).slice(12);focusNode(id);const pEl=document.getElementById('panel');
    for(let i=0;i<60;i++){if(new DOMMatrix(getComputedStyle(pEl).transform).isIdentity&&![...pEl.getAnimations(),...stage.getAnimations()].some(a=>a.playState==='running'))break;await new Promise(r=>setTimeout(r,100));}
    const im=document.querySelector('#p-figs img');await im.decode();const p=pEl.getBoundingClientRect(),r=im.getBoundingClientRect(),n=stage.querySelector('.node[data-id="'+id+'"]').getBoundingClientRect(),b=wrap.getBoundingClientRect();
    im.click();const enlarged=document.querySelector('#imgLightbox img').getBoundingClientRect();
    const out={id,viewport:innerWidth,nodeVisible:n.left>=b.left-2&&n.right<=b.right+2&&n.top>=b.top-2&&n.bottom<=p.top+2,imageFits:r.width>0&&r.left>=p.left&&r.right<=p.right,caption:document.querySelector('#p-figs').textContent.includes('原創節點插畫・非史料形象'),lightboxFits:document.getElementById('imgLightbox').classList.contains('open')&&enlarged.width>0&&enlarged.left>=0&&enlarged.right<=innerWidth};
    document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));out.closed=!document.getElementById('imgLightbox').classList.contains('open');closePanel();return out;
  })()`);
  console.log(JSON.stringify({mesopotamiaPortraitMobile},null,2));
  if(['nodeVisible','imageFits','caption','lightboxFits','closed'].some(k=>!mesopotamiaPortraitMobile[k]))process.exitCode=1;
  const yokaiPortraitMobile=await evaluate(`(async()=>{
    const key=Object.keys(NODE_PORTRAITS).filter(k=>k.startsWith('yokai:')).at(-1);
    if(!key)return {pending:true};
    openYokai();const id=key.slice(6),card=ycontent.querySelector('.ycard[data-id="'+id+'"]');card.click();
    for(let i=0;i<60;i++){const p=ypanel.getBoundingClientRect();if(p.width>0&&p.left>=-1&&p.right<=innerWidth+1&&new DOMMatrix(getComputedStyle(ypanel).transform).isIdentity)break;await new Promise(r=>setTimeout(r,100))}
    const c=card.getBoundingClientRect(),a=card.querySelector('.ycard-portrait').getBoundingClientRect(),f=card.querySelector('.yfav').getBoundingClientRect();
    const text=[...card.querySelectorAll('.yname,.ykana,.ycat')].map(el=>el.getBoundingClientRect());
    const im=document.querySelector('#yp-figs img'),p=ypanel.getBoundingClientRect(),r=im.getBoundingClientRect();im.click();const enlarged=document.querySelector('#imgLightbox img').getBoundingClientRect();
    const cardFailures=[...ycontent.querySelectorAll('.ycard.has-portrait')].flatMap(el=>{const c=el.getBoundingClientRect(),a=el.querySelector('.ycard-portrait').getBoundingClientRect(),f=el.querySelector('.yfav').getBoundingClientRect();return a.width>0&&a.left>=c.left&&a.right<=c.right&&a.top>=c.top&&a.bottom<=c.bottom&&f.bottom<=a.top&&[...el.querySelectorAll('.yname,.ykana,.ycat')].every(t=>t.getBoundingClientRect().right<=a.left+1)?[]:[el.dataset.id]});
    const out={id,viewport:innerWidth,cardFailures,allCardsFit:!cardFailures.length,avatarFits:a.width>0&&a.left>=c.left&&a.right<=c.right&&a.top>=c.top&&a.bottom<=c.bottom,textClear:text.every(t=>t.right<=a.left+1),favoriteClear:f.bottom<=a.top,imageFits:r.width>0&&r.left>=p.left&&r.right<=p.right,lightboxFits:document.getElementById('imgLightbox').classList.contains('open')&&enlarged.width>0&&enlarged.left>=0&&enlarged.right<=innerWidth};
    document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));out.closed=!document.getElementById('imgLightbox').classList.contains('open');closeYPanel();backToMyth();return out;
  })()`);
  console.log(JSON.stringify({yokaiPortraitMobile},null,2));
  if(!yokaiPortraitMobile.pending&&['allCardsFit','avatarFits','textClear','favoriteClear','imageFits','lightboxFits','closed'].some(k=>!yokaiPortraitMobile[k]))process.exitCode=1;
  await request('Emulation.clearDeviceMetricsOverride');
  if(process.env.YOKAI_SCREENSHOT){
    await request('Emulation.setDeviceMetricsOverride',{width:1600,height:900,deviceScaleFactor:1,mobile:false});
    await evaluate(`(async()=>{openYokai();if(japanLocale!=='zh-TW')toggleJapanLocale();const id='yamatanoorochi_y',card=ycontent.querySelector('.ycard[data-id="'+id+'"]');card.click();await document.querySelector('#yp-figs img').decode();await new Promise(r=>setTimeout(r,600));})()`);
    const shot=await request('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});writeFileSync(process.env.YOKAI_SCREENSHOT,Buffer.from(shot.data,'base64'));
    await evaluate('closeYPanel();backToMyth()');
    await request('Emulation.clearDeviceMetricsOverride');
  }
  if(process.env.GREEK_SCREENSHOT){
    await request('Emulation.setDeviceMetricsOverride',{width:1600,height:900,deviceScaleFactor:1,mobile:false});
    await evaluate(`(async()=>{openPantheon('greek');focusNode('gaia');await document.querySelector('#p-figs img').decode();const p=document.getElementById('panel');for(let i=0;i<60;i++){if(new DOMMatrix(getComputedStyle(p).transform).isIdentity&&![...p.getAnimations(),...stage.getAnimations()].some(a=>a.playState==='running'))break;await new Promise(r=>setTimeout(r,100));}})()`);
    const shot=await request('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});writeFileSync(process.env.GREEK_SCREENSHOT,Buffer.from(shot.data,'base64'));
    await request('Emulation.clearDeviceMetricsOverride');
  }
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
  await request('Page.navigate',{url:'http://127.0.0.1:7788/tools/preview.html?page=home'});
  for(let i=0;i<60;i++){
    if(await evaluate(`document.getElementById('preview')?.contentDocument?.querySelectorAll('[data-legend]').length===${legends.length}`))break;
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  await evaluate("revision='test-home-revision';check()");
  let previewHome=false;
  for(let i=0;i<60;i++){
    previewHome=await evaluate(`(()=>{const f=document.getElementById('preview');return !!f?.contentWindow?.location.search.startsWith('?preview=')&&f.contentDocument.querySelectorAll('[data-legend]').length===${legends.length}&&f.contentDocument.getElementById('home').style.display!=='none'&&f.contentDocument.querySelectorAll('#stage .node').length===0})()`);
    if(previewHome)break;await new Promise(resolve=>setTimeout(resolve,100));
  }
  console.log(JSON.stringify({previewHome},null,2));if(!previewHome)process.exitCode=1;
  await request('Page.navigate',{url:'http://127.0.0.1:7788/tools/preview.html?page=yokai'});
  for(let i=0;i<60;i++){
    if(await evaluate("document.getElementById('preview')?.contentDocument?.querySelectorAll('#yokai .ycard').length>0"))break;
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  await evaluate("revision='test-yokai-revision';check()");
  let previewYokai=false;
  for(let i=0;i<60;i++){
    previewYokai=await evaluate("(()=>{const f=document.getElementById('preview');return !!f?.contentWindow?.location.search.startsWith('?preview=')&&f.contentDocument.getElementById('yokai').style.display==='block'&&f.contentDocument.querySelectorAll('#yokai .ycard').length>0})()");
    if(previewYokai)break;await new Promise(resolve=>setTimeout(resolve,100));
  }
  console.log(JSON.stringify({previewYokai},null,2));if(!previewYokai)process.exitCode=1;
  if(process.env.LOCAL_FGO_TEST==='1'){
    for(let i=0;i<60;i++){
      if(await evaluate("!!frame.contentWindow.localFgoPreview"))break;
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    const localFgo=await evaluate(`(async()=>{
      const w=frame.contentWindow,d=frame.contentDocument,manifest=await fetch('../private-media/fgo/manifest.json').then(r=>r.json()),failures=[];
      for(const im of manifest.entries){
        const [ns,id]=im.key.split(':');
        if(ns==='yokai'){w.openYokai();w.openYPanel(id);}else{w.openPantheon(ns);w.focusNode(id);}
        const root=d.getElementById(ns==='yokai'?'yp-figs':'p-figs'),fig=root.querySelector('[data-fgo="local-only"]'),image=fig?.querySelector('img');
        try{await image.decode();if(!image.naturalWidth)failures.push(im.key+':size');}catch{failures.push(im.key+':image');}
        if(root.querySelectorAll('figure').length<2||root.querySelectorAll('[data-fgo]').length!==1||!fig?.textContent.includes('©TYPE-MOON / FGO PROJECT')||!fig?.querySelector('a[href="https://www.fate-go.jp/trajectory/servant/"]'))failures.push(im.key+':caption');
        image?.click();if(!d.getElementById('imgLightbox').classList.contains('open'))failures.push(im.key+':lightbox');
        d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
        if(ns==='japan'||ns==='yokai'){
          w.toggleJapanLocale();
          if(!root.querySelector('[data-fgo]')?.textContent.includes('ゲームの設定'))failures.push(im.key+':ja');
          w.toggleJapanLocale();
        }else if(!fig?.textContent.includes('僅本機參考'))failures.push(im.key+':zh');
      }
      const exportedSource=await fetch('../index.html').then(r=>r.text());
      return {count:manifest.entries.length,failures,notInExport:!exportedSource.includes('private-media/fgo/')};
    })()`);
    console.log(JSON.stringify({localFgo},null,2));if(localFgo.failures.length||!localFgo.notInExport)process.exitCode=1;
    await request('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
    const localFgoMobile=await evaluate(`(async()=>{
      const w=frame.contentWindow,d=frame.contentDocument;w.openPantheon('mesopotamia');w.focusNode('gilgamesh');
      let ready=false;
      for(let i=0;i<60;i++){await new Promise(r=>setTimeout(r,100));const n=d.querySelector('.node[data-id="gilgamesh"]').getBoundingClientRect(),p=d.getElementById('panel').getBoundingClientRect();if(n.bottom<=p.top+2&&n.left>=-2&&n.right<=w.innerWidth+2){ready=true;break;}}
      const im=d.querySelector('#p-figs [data-fgo] img');await im.decode();im.scrollIntoView({block:'center'});
      const r=im.getBoundingClientRect(),p=d.getElementById('panel').getBoundingClientRect();
      const imageFits=r.left>=p.left&&r.right<=p.right&&r.width>0&&im.naturalWidth>0;
      const rights=d.querySelector('#p-figs [data-fgo]').textContent.includes('©TYPE-MOON / FGO PROJECT');
      im.click();const lightbox=d.getElementById('imgLightbox').classList.contains('open');d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
      return {ready,imageFits,rights,lightbox,noHorizontalOverflow:d.documentElement.scrollWidth<=w.innerWidth};
    })()`);
    console.log(JSON.stringify({localFgoMobile},null,2));if(Object.values(localFgoMobile).some(v=>!v))process.exitCode=1;
    await request('Emulation.clearDeviceMetricsOverride');
  }
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
    // Windows may release child-process profile handles just after the browser exits.
    rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  }
}
