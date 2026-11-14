// GPS RUN — live map, distance, current / average pace, splits, 5K estimate, and pace coaching colors for Road Work.
// Green = on pace, blue = speed up, red = slow down, slate = no target (warm-up, recovery, waiting for GPS).
// The target comes from the session (easy / tempo / interval / race pace) and follows the guided timer's current segment.
// Nothing leaves the phone except map-tile requests (OpenStreetMap). The track is saved with the run in the app's own storage.

const GPS={key:'',on:false,paused:false,pts:[],dist:0,acc0:0,t0:0,watch:null,iv:null,map:null,mapEl:null,lines:[],dot:null,wake:null,acc:null,cur:null,st:'wait',stN:0,splits:[],lastCue:0,err:'',rej:0,lastFixAt:0,review:''};
const GPS_STASH='hpo-gps-live', GPS_COL={ok:'#1F8A55',slow:'#1F6FD0',fast:'#C62F25',free:'#F06A1F',wait:'#F06A1F'};
const gpsHpo=k=>String(k).indexOf('|')>0;
const gpsU=k=>gpsHpo(k==null?GPS.key:k)?'mi':rUnit();
const gpsUnitM=k=>gpsU(k)==='mi'?1609.344:1000;
function gpsRec(k,make){ if(gpsHpo(k)){ if(!S.runs[k]&&make) S.runs[k]={}; return S.runs[k]; } const m=String(k).match(/^w(\d+)d(\d+)$/); if(!m) return null; return make?rEnsure(+m[1],+m[2]):rLog(+m[1],+m[2]); }
// HPO program target: the guide's own pace table, row picked by the latest 2-mile test
function gpsHpoTarget(){ const m=GPS.key.match(/^w(\d+)\|(\d+)$/); if(!m) return null; const ses=runWeek(+m[1]).s[+m[2]]; if(!ses) return null; const mine=TM.key==='run'+GPS.key&&TM.segs.length;
  if(mine&&TM.i>=TM.segs.length) return {rec:1,label:'Session complete — cool down'};
  if(mine&&(TM.on||TM.el>0||TM.i>0)){ const seg=TM.segs[TM.i]; if(seg.k==='prep') return {rec:1,label:'Get ready'}; if(seg.k!=='work') return {rec:1,label:'Recovery — any easy pace'}; }
  const last=[...S.tests].sort((a,b)=>b.date.localeCompare(a.date))[0]; if(!last||bandOf(last.time)<0) return {rec:1,label:'Log a 2-mile time for pace coaching'};
  const b=bandOf(last.time), sec=t=>{ const q=t.split(':'); return +q[0]*60+ +q[1]; }, cell=(tbl,col,km)=>{ const T=PACE[tbl], r=T.rows[b][T.cols.indexOf(col)].split('-'); return [sec(r[0])/km,sec(r[1])/km]; };
  const rng=(lo,hi,n)=>({lo,hi,label:n+' '+fmtPace(lo,'mi')+'–'+fmtPace(hi,'mi')+' /mi'}); let r;
  if(ses.k==='Test'){ const pc=sec(last.time.match(/\d+:\d\d/)[0])/3.218688; return rng(pc*0.93,pc,'Beat '+last.time+' —'); }
  if(ses.k==='Threshold'||ses.k==='Tempo'){ r=cell('Threshold intervals','1600M',1.6); return rng(r[0],r[1],ses.k); }
  if(ses.k==='Repeat'){ r=cell('Repeat intervals','800M',0.8); return rng(r[0],r[1],'Repeat'); }
  if(ses.k==='Speed'){ r=cell('Speed intervals','400M',0.4); return rng(r[0],r[1],'Speed'); }
  r=cell('Long slow distance','2 mi',3.218688); return rng(r[0],r[1],'Easy'); }
function gpsHav(a,b,c,d){ const R=6371008.8,r=Math.PI/180,x=(c-a)*r,y=(d-b)*r,h=Math.sin(x/2)**2+Math.cos(a*r)*Math.cos(c*r)*Math.sin(y/2)**2; return 2*R*Math.asin(Math.sqrt(h)); }
function gpsEl(){ return GPS.acc0+(GPS.on&&!GPS.paused?Date.now()-GPS.t0:0); }
// ---- polyline (precision 5) so a saved track costs ~1-2 KB
function gpsEnc(pts){ let o='',pa=0,pb=0; const e=v=>{ v=v<0?~(v<<1):v<<1; let s=''; while(v>=0x20){ s+=String.fromCharCode((0x20|(v&0x1f))+63); v>>=5; } return s+String.fromCharCode(v+63); }; for(const p of pts){ const a=Math.round(p[0]*1e5),b=Math.round(p[1]*1e5); o+=e(a-pa)+e(b-pb); pa=a; pb=b; } return o; }
function gpsDec(s){ const o=[]; let i=0,a=0,b=0; const d=()=>{ let r=0,sh=0,c; do{ c=s.charCodeAt(i++)-63; r|=(c&0x1f)<<sh; sh+=5; }while(c>=0x20&&i<s.length); return r&1?~(r>>1):r>>1; }; while(i<s.length){ a+=d(); b+=d(); o.push([a/1e5,b/1e5]); } return o; }
// ---- target pace for right now: {lo,hi,label} in sec/km (lo = fastest allowed), {rec:1,label} for no-target blocks, or null
function gpsTarget(){ if(gpsHpo(GPS.key)) return gpsHpoTarget(); const st=S.run.setup; const m=String(GPS.key).match(/^w(\d+)d(\d+)$/); if(!st||!m) return null; const p=rPlanNow(); const ses=p.weeks[+m[1]-1]&&p.weeks[+m[1]-1].days[+m[2]]; if(!ses) return null; const P=p.paces, u=st.unit; let k;
  const mine=TM.key==='run'+GPS.key&&TM.segs.length;
  if(mine&&TM.i>=TM.segs.length) return {rec:1,label:'Session complete — cool down'};
  if(mine&&(TM.on||TM.el>0||TM.i>0)){ const seg=TM.segs[TM.i], l=seg.l; if(seg.k==='prep') return {rec:1,label:'Get ready'}; if(seg.k!=='work'||/^Walk/i.test(l)) return {rec:1,label:'Recovery — any easy pace'}; if(/^Stride/i.test(l)) return {rec:1,label:'Stride — fast and relaxed'};
    k=/Marathon pace/i.test(l)?'M':/^Tempo/i.test(l)?'T':/\d+ m at/i.test(l)?'I':/^(Race|5K)/i.test(l)?'race':'E'; }
  else k={E:'E',L:'E',rw:'E',T:'T',I:'I',race:'race'}[ses.kind]||'E';
  const rng=(lo,hi,n)=>({lo,hi,label:n+' '+fmtPace(lo,u)+'–'+fmtPace(hi,u)+' /'+u});
  if(k==='E') return rng(P.Ehi,P.Elo,'Easy');
  if(k==='race'){ const d=ses.km||5, pc=predictSec(st.vdot,d)/d; return rng(pc*0.97,pc*1.03,'Race pace'); }
  return rng(P[k]*0.97,P[k]*1.03,{M:'Marathon pace',T:'Tempo',I:'Interval'}[k]); }
function gpsStatus(){ const t=gpsTarget(); if(GPS.cur==null) return 'wait'; if(!t||t.rec) return 'free'; if(GPS.cur<t.lo) return 'fast'; if(GPS.cur>t.hi) return 'slow'; return 'ok'; }
// ---- current pace (sec/km) over the last ~12 s of track
function gpsCurPace(){ const n=GPS.pts.length; if(n<2||Date.now()-GPS.lastFixAt>8000) return null; const last=GPS.pts[n-1]; let i=n-2; while(i>0&&last[2]-GPS.pts[i][2]<12000) i--; const a=GPS.pts[i], dt=(last[2]-a[2])/1000, dd=last[3]-a[3]; if(dt<4||dd<6) return null; return dt/dd*1000; }
function gpsEst5k(){ const d=GPS.dist/1000, t=gpsEl()/1000; if(d<0.3||t<60) return null; return d<1?t/d*5:t*Math.pow(5/d,1.06); }
// ---- fixes
function gpsFix(pos){ const c=pos.coords; GPS.acc=c.accuracy; GPS.err=''; const la=c.latitude, lo=c.longitude; gpsDot(la,lo);
  if(!GPS.on||GPS.paused){ gpsPaint(); return; } if(c.accuracy>35){ gpsPaint(); return; }
  const el=gpsEl(), n=GPS.pts.length, now=Date.now();
  if(!n){ GPS.pts.push([la,lo,el,0,'wait']); GPS.lastFixAt=now; gpsDraw(); gpsPaint(); return; }
  const p=GPS.pts[n-1], d=gpsHav(p[0],p[1],la,lo), dt=Math.max(0.5,(el-p[2])/1000);
  if(d<3){ GPS.lastFixAt=now; return; } // standing still / jitter
  if(d/dt>9){ if(++GPS.rej<4) return; GPS.pts.push([la,lo,el,p[3],'wait']); GPS.rej=0; GPS.lastFixAt=now; gpsDraw(1); return; } // glitch jump: re-anchor without adding distance
  GPS.rej=0; const before=GPS.dist; GPS.dist+=d; GPS.lastFixAt=now; const pt=[la,lo,el,GPS.dist,'wait']; GPS.pts.push(pt);
  const U=gpsUnitM(); while(GPS.dist>=(GPS.splits.length+1)*U){ const mark=(GPS.splits.length+1)*U; GPS.splits.push(Math.round(p[2]+(el-p[2])*((mark-before)/d))); try{ tmTone(880,90,0,0.4,'triangle'); tmTone(880,90,0.15,0.4,'triangle'); }catch(e){} }
  GPS.cur=gpsCurPace(); pt[4]=GPS.st=gpsStatus(); gpsDraw(); gpsPaint(); }
function gpsErr(e){ GPS.err=e.code===1?'Location is blocked. On iPhone: Settings → Privacy & Security → Location Services → Safari Websites (or this app) → While Using, and turn on Precise Location.':e.code===3?'Still looking for a GPS signal — step outside, clear of buildings.':'GPS unavailable right now.'; gpsPaint(); }
function gpsTick(){ if(!GPS.on) return; if(!GPS.paused){ const lp=GPS.pts[GPS.pts.length-1]; if(Date.now()-GPS.lastFixAt>8000||!lp||gpsEl()-lp[2]>8000) GPS.cur=null; const s=gpsStatus(); GPS.stN=s===GPS.st?GPS.stN+1:0; GPS.st=s;
    if((s==='fast'||s==='slow')&&GPS.stN>=5&&Date.now()-GPS.lastCue>20000){ GPS.lastCue=Date.now(); try{ if(s==='slow'){ tmTone(523,110,0,0.5,'triangle'); tmTone(784,160,0.13,0.5,'triangle'); } else { tmTone(784,110,0,0.5,'triangle'); tmTone(523,160,0.13,0.5,'triangle'); } }catch(e){} }
    if(Math.round(gpsEl()/1000)%10===0) gpsStash(); }
  gpsPaint(); }
async function gpsWake(){ try{ if('wakeLock' in navigator&&GPS.on&&!GPS.wake){ GPS.wake=await navigator.wakeLock.request('screen'); GPS.wake.addEventListener('release',()=>{ GPS.wake=null; }); } }catch(e){} }
document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='visible'&&GPS.on){ gpsWake(); gpsPaint(); } });
function gpsWatch(){ if(GPS.watch!=null) return; GPS.watch=navigator.geolocation.watchPosition(gpsFix,gpsErr,{enableHighAccuracy:true,maximumAge:0,timeout:20000}); }
function gpsStart(key){ if(!('geolocation' in navigator)){ toast('This browser has no GPS access'); return; }
  if(GPS.key&&GPS.key!==key&&GPS.pts.length&&!confirm('Another GPS run is in progress. Discard it and start this one?')) return;
  gpsHalt(); Object.assign(GPS,{key,on:true,paused:false,pts:[],dist:0,acc0:0,t0:Date.now(),splits:[],cur:null,st:'wait',stN:0,err:'',rej:0,lastFixAt:0,review:''}); gpsClearLines();
  gpsWatch(); GPS.iv=setInterval(gpsTick,1000); gpsWake();
  if(gpsHpo(key)&&S.runOpen!==key){ S.runOpen=key; render(); }
  try{ if(!(TM.key==='run'+key&&TM.on)){ const b=document.getElementById('tm-btn-run'+key); if(b) b.click(); } }catch(e){} // start the guided timer with the run
  render(); }
function gpsPause(){ if(!GPS.on) return; if(GPS.paused){ GPS.paused=false; GPS.t0=Date.now(); GPS.lastFixAt=0; const n=GPS.pts.length; if(n) GPS.rej=3; } else { GPS.acc0=gpsEl(); GPS.paused=true; GPS.cur=null; gpsStash(); } render(); }
function gpsHalt(){ if(GPS.watch!=null){ try{ navigator.geolocation.clearWatch(GPS.watch); }catch(e){} GPS.watch=null; } clearInterval(GPS.iv); GPS.iv=null; if(GPS.wake){ try{ GPS.wake.release(); }catch(e){} GPS.wake=null; } }
function gpsReset(){ gpsHalt(); Object.assign(GPS,{key:'',on:false,paused:false,pts:[],dist:0,acc0:0,splits:[],cur:null,st:'wait',err:''}); gpsClearLines(); try{ localStorage.removeItem(GPS_STASH); }catch(e){} }
function gpsDiscard(){ if(!confirm('Discard this GPS run? Nothing will be saved.')) return; gpsReset(); render(); toast('GPS run discarded'); }
function gpsSummary(){ const n=GPS.pts.length, step=Math.max(1,Math.ceil(n/500)); const keep=GPS.pts.filter((p,i)=>i%step===0||i===n-1); return {at:new Date().toISOString(),m:Math.round(GPS.dist),ms:Math.round(gpsEl()),u:gpsU(),splits:GPS.splits.slice(),trk:gpsEnc(keep),sts:keep.map(p=>({ok:'o',slow:'s',fast:'f',free:'n',wait:'n'}[p[4]]||'n')).join(''),est5k:Math.round(gpsEst5k()||0)||null}; }
function gpsFinish(){ if(GPS.dist<20){ if(confirm('No distance recorded yet. Discard this GPS run?')){ gpsReset(); render(); } return; }
  if(!GPS.paused) GPS.acc0=gpsEl(); GPS.paused=true; const key=GPS.key, g=gpsSummary(), x=gpsRec(key,1), dist=(g.m/gpsUnitM(key)).toFixed(2), tm=fmtDur(g.ms);
  x.gps=g; if(gpsHpo(key)){ const ses=runWeek(+key.slice(1).split('|')[0]).s[+key.split('|')[1]]; if(!x.time&&!(ses&&ses.k==='Test')) x.time=tm; if(!x.notes) x.notes='GPS: '+dist+' mi in '+tm; } else { x.dist=dist; x.time=tm; if(!x.date) x.date=new Date().toISOString(); }
  save(); gpsReset(); render(); toast('Run saved — '+dist+' '+g.u+' in '+tm); }
function gpsRemove(key){ if(!confirm('Remove the GPS track from this run? Distance and time stay.')) return; const x=gpsRec(key); if(x){ delete x.gps; save(); } GPS.review=''; render(); }
// ---- crash / reload safety: the run in progress is stashed every 10 s
function gpsStash(){ if(!GPS.key) return; try{ localStorage.setItem(GPS_STASH,JSON.stringify({key:GPS.key,ms:Math.round(gpsEl()),dist:GPS.dist,splits:GPS.splits,pts:GPS.pts.map(p=>[+p[0].toFixed(5),+p[1].toFixed(5),Math.round(p[2]),Math.round(p[3]*10)/10,p[4]]),at:Date.now()})); }catch(e){} }
function gpsStashed(key){ try{ const s=JSON.parse(localStorage.getItem(GPS_STASH)||'null'); return s&&s.key===key&&Date.now()-s.at<864e5&&s.pts&&s.pts.length>1?s:null; }catch(e){ return null; } }
function gpsRecover(key,how){ const s=gpsStashed(key); if(!s){ render(); return; } if(how==='drop'){ if(!confirm('Discard the unfinished GPS run?')) return; try{ localStorage.removeItem(GPS_STASH); }catch(e){} render(); return; }
  gpsHalt(); Object.assign(GPS,{key,on:true,paused:true,pts:s.pts,dist:s.dist,acc0:s.ms,t0:Date.now(),splits:s.splits||[],cur:null,st:'wait',stN:0,err:'',rej:0,lastFixAt:0,review:''}); gpsClearLines(); gpsWatch(); GPS.iv=setInterval(gpsTick,1000); gpsWake();
  if(how==='save'){ gpsFinish(); return; } render(); }
window.addEventListener('pagehide',()=>{ if(GPS.on) gpsStash(); });
// ---- map (one Leaflet instance, moved back into the page after every re-render)
function gpsMapEnsure(){ if(GPS.map||!window.L) return !!GPS.map; GPS.mapEl=document.createElement('div'); GPS.mapEl.className='gpsmap'; GPS.map=L.map(GPS.mapEl,{zoomControl:false,attributionControl:true}).setView([39,-98],4);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(GPS.map); return true; }
function gpsClearLines(){ if(GPS.map){ GPS.lines.forEach(l=>l.remove()); if(GPS.dot){ GPS.dot.remove(); } } GPS.lines=[]; GPS.dot=null; GPS.drawn=0; GPS.lineSt=''; }
function gpsDot(la,lo){ if(!GPS.map||GPS.review) return; if(!GPS.dot){ GPS.dot=L.circleMarker([la,lo],{radius:8,color:'#fff',weight:3,fillColor:'#182320',fillOpacity:1}).addTo(GPS.map); GPS.map.setView([la,lo],17); } else { GPS.dot.setLatLng([la,lo]); if(GPS.on&&!GPS.paused) GPS.map.panTo([la,lo],{animate:false}); } }
function gpsSeg(st,from){ const l=L.polyline(from?[from]:[],{color:GPS_COL[st]||GPS_COL.free,weight:6,opacity:.95,lineCap:'round',lineJoin:'round'}).addTo(GPS.map); GPS.lines.push(l); GPS.lineSt=st; return l; }
function gpsDraw(gap){ if(!GPS.map||GPS.review) return; for(let i=GPS.drawn||0;i<GPS.pts.length;i++){ const p=GPS.pts[i], prev=i?GPS.pts[i-1]:null; let l=GPS.lines[GPS.lines.length-1]; const brk=gap&&i===GPS.pts.length-1; if(!l||p[4]!==GPS.lineSt||brk) l=gpsSeg(p[4],prev&&!brk?[prev[0],prev[1]]:null); l.addLatLng([p[0],p[1]]); } GPS.drawn=GPS.pts.length; if(GPS.dot) GPS.dot.bringToFront(); }
function gpsReview(g){ gpsClearLines(); const pts=gpsDec(g.trk||''); if(!pts.length) return; const M={o:'ok',s:'slow',f:'fast',n:'free'}; let l=null,cs=''; pts.forEach((p,i)=>{ const st=M[(g.sts||'')[i]]||'free'; if(!l||st!==cs){ l=gpsSeg(st,i?pts[i-1]:null); cs=st; } l.addLatLng(p); });
  GPS.lines.push(L.circleMarker(pts[0],{radius:6,color:'#fff',weight:2,fillColor:'#1F8A55',fillOpacity:1}).addTo(GPS.map));
  GPS.dot=L.circleMarker(pts[pts.length-1],{radius:6,color:'#fff',weight:2,fillColor:'#182320',fillOpacity:1}).addTo(GPS.map); GPS.map.fitBounds(L.latLngBounds(pts).pad(0.15),{animate:false}); }
function gpsMount(){ const slot=document.getElementById('gps-map'); if(!slot) return; if(!gpsMapEnsure()){ slot.innerHTML='<p class="help" style="padding:10px;margin:0">Map unavailable offline — the run is still tracked.</p>'; return; }
  slot.appendChild(GPS.mapEl); GPS.map.invalidateSize(false); const rv=slot.dataset.review||'';
  if(rv){ if(GPS.review!==rv){ const x=gpsRec(rv); GPS.review=rv; if(x&&x.gps) gpsReview(x.gps); } else if(GPS.dot){ const b=L.latLngBounds(GPS.lines.filter(l=>l.getLatLngs).flatMap(l=>l.getLatLngs())); if(b.isValid()) GPS.map.fitBounds(b.pad(0.15),{animate:false}); } }
  else { if(GPS.review){ GPS.review=''; gpsClearLines(); } gpsDraw(); const p=GPS.pts[GPS.pts.length-1]; if(p){ gpsDot(p[0],p[1]); GPS.map.setView([p[0],p[1]],Math.max(GPS.map.getZoom(),16),{animate:false}); } else if(!GPS.on&&!GPS.peek){ GPS.peek=1; try{ navigator.permissions&&navigator.permissions.query({name:'geolocation'}).then(r=>{ if(r.state==='granted') navigator.geolocation.getCurrentPosition(q=>{ if(!GPS.on&&!GPS.review) gpsDot(q.coords.latitude,q.coords.longitude); },()=>{},{maximumAge:60000,timeout:8000}); }).catch(()=>{}); }catch(e){} } } }
// ---- UI
function gpsPaceTxt(sec){ return sec==null||!isFinite(sec)||sec>1800?'–:––':fmtPace(sec,gpsU()); }
function gpsSplitsHtml(splits,ms,m,u){ if(!splits.length) return ''; const U=u==='mi'?1609.344:1000; let h='<table class="gpssplits"><tr><th>'+(u==='mi'?'Mile':'Km')+'</th><th>Split</th><th>Total</th></tr>'; splits.forEach((t,i)=>{ h+=`<tr><td>${i+1}</td><td><b>${fmtDur(t-(i?splits[i-1]:0))}</b></td><td>${fmtDur(t)}</td></tr>`; }); const rem=m-splits.length*U; if(ms!=null&&rem>30){ const last=splits[splits.length-1]; h+=`<tr><td>+${(rem/U).toFixed(2)}</td><td>${fmtDur(ms-last)}</td><td>${fmtDur(ms)}</td></tr>`; } return h+'</table>'; }
function gpsBanner(){ const t=gpsTarget(), s=GPS.paused?'paused':GPS.st; const big={ok:'ON PACE',slow:'▲ SPEED UP',fast:'▼ SLOW DOWN',free:t&&t.rec?'NO PACE TARGET':'TRACKING',wait:GPS.pts.length?'…':'FINDING GPS',paused:'PAUSED'}[s]; return {s,big,sub:GPS.err||(t?t.label:'')}; }
const GPS_NOTE='<div class="gpswarn"><b>This is a web app, not a native app.</b> GPS only works while the screen is on and this app is open in front. It cannot track in the background — if you lock the phone or switch apps, tracking stops until you come back. <b>Your routes and run history are stored only on this phone</b> — nothing is uploaded. (Only the map background is downloaded, from OpenStreetMap.)</div>';
function gpsWidget(key,x){ const u=gpsU(key), live=GPS.key===key&&GPS.on; x=x||{};
  if(!live&&GPS.on) return `<div class="gpsw"><p class="gpsnote" style="margin:0">A GPS run is being tracked on another session — finish or discard that one first.</p></div>`;
  if(!live){ const stash=gpsStashed(key); let h='';
    if(stash) h+=`<div class="gpsw"><div class="gpsban paused"><b>UNFINISHED GPS RUN</b><span>${(stash.dist/gpsUnitM(key)).toFixed(2)} ${u} · ${fmtDur(stash.ms)} — the app was closed mid-run</span></div><div class="row" style="margin-top:8px"><button class="btn done" style="margin:0;flex:1" onclick="gpsRecover('${key}','resume')">Resume</button><button class="btn ghost" onclick="gpsRecover('${key}','save')">Save it</button><button class="btn ghost" onclick="gpsRecover('${key}','drop')">Discard</button></div></div>`;
    else if(x.gps){ const g=x.gps, U=g.u==='mi'?1609.344:1000; h+=`<div class="gpsw"><div class="gpsgrid"><div><span>Distance</span><b>${(g.m/U).toFixed(2)}</b><i>${g.u}</i></div><div><span>Time</span><b>${fmtDur(g.ms)}</b></div><div><span>Avg pace</span><b>${fmtPace(g.ms/1000/(g.m/1000),g.u)}</b><i>/${g.u}</i></div><div><span>5K estimate</span><b>${g.est5k?fmtClock(g.est5k):'–'}</b></div></div><div class="gpsslot" id="gps-map" data-review="${key}"></div><div class="gpskey"><i style="background:${GPS_COL.ok}"></i>on pace<i style="background:${GPS_COL.slow}"></i>too slow<i style="background:${GPS_COL.fast}"></i>too fast<i style="background:${GPS_COL.free}"></i>no target</div>${GPS_NOTE}${gpsSplitsHtml(g.splits||[],g.ms,g.m,g.u)}<div class="row" style="margin-top:8px"><button class="btn ghost" onclick="if(confirm('Track this run again? Saving the new one replaces this track.'))gpsStart('${key}')">Run it again with GPS</button><button class="btn ghost" onclick="gpsRemove('${key}')">Remove track</button></div></div>`; }
    else h+=`<div class="gpsw"><div class="gpsslot" id="gps-map"></div><button class="btn done" style="margin:8px 0 0" onclick="gpsStart('${key}')">▶ Start GPS run</button><p class="gpsnote">Tracks distance, pace and your route, and starts the guided timer.</p>${GPS_NOTE}</div>`;
    return h; }
  const b=gpsBanner();
  return `<div class="gpsw live"><div class="gpsban ${b.s}" id="gps-ban"><b id="gps-big">${b.big}</b><span id="gps-sub">${esc(b.sub)}</span></div>
   <div class="gpsnow"><span>Pace now</span><b id="gps-cur">${gpsPaceTxt(GPS.cur)}</b><i>/${u}</i></div>
   <div class="gpsgrid"><div><span>Distance</span><b id="gps-dist">${(GPS.dist/gpsUnitM()).toFixed(2)}</b><i>${u}</i></div><div><span>Time</span><b id="gps-time">${fmtDur(gpsEl())}</b></div><div><span>Avg pace</span><b id="gps-avg">–:––</b><i>/${u}</i></div><div><span>5K estimate</span><b id="gps-est">–</b></div></div>
   <div class="gpsslot" id="gps-map"></div><div class="gpskey"><i style="background:${GPS_COL.ok}"></i>on pace<i style="background:${GPS_COL.slow}"></i>speed up<i style="background:${GPS_COL.fast}"></i>slow down<span id="gps-acc"></span></div>${GPS_NOTE}
   <div id="gps-splits">${gpsSplitsHtml(GPS.splits,null,GPS.dist,u)}</div>
   <div class="row" style="margin-top:8px;flex-wrap:nowrap"><button class="btn" style="margin:0;flex:1" onclick="gpsPause()">${GPS.paused?'Resume':'Pause'}</button><button class="btn done" style="margin:0;flex:1" onclick="gpsFinish()">Finish &amp; save</button></div><button class="gpsdrop" onclick="gpsDiscard()">Discard this GPS run</button></div>`; }
function gpsPaint(){ const ban=document.getElementById('gps-ban'); if(!ban) return; const set=(id,v)=>{ const e=document.getElementById(id); if(e&&e.textContent!==v) e.textContent=v; }; const b=gpsBanner(); ban.className='gpsban '+b.s; set('gps-big',b.big); set('gps-sub',b.sub);
  const el=gpsEl(), d=GPS.dist; set('gps-cur',GPS.paused?'–:––':gpsPaceTxt(GPS.cur)); set('gps-dist',(d/gpsUnitM()).toFixed(2)); set('gps-time',fmtDur(el)); set('gps-avg',d>30?gpsPaceTxt(el/1000/(d/1000)):'–:––'); const e5=gpsEst5k(); set('gps-est',e5?fmtClock(e5):'–'); set('gps-acc',GPS.acc!=null?'GPS ±'+Math.round(GPS.acc)+' m'+(GPS.acc>35?' (weak)':''):'');
  const sp=document.getElementById('gps-splits'); if(sp&&sp.dataset.n!==String(GPS.splits.length)){ sp.dataset.n=String(GPS.splits.length); sp.innerHTML=gpsSplitsHtml(GPS.splits,null,d,gpsU()); } }
// ---- run log: Road Work Fitness tab ('rw') and the HPO program's Run tab ('hpo')
function gpsOpen(k){ if(gpsHpo(k)){ S.week=+k.slice(1).split('|')[0]; S.runOpen=k; S.tab='run'; } else { const m=k.match(/^w(\d+)d(\d+)$/); S.run.w=+m[1]; S.run.d=+m[2]; S.tab='rday'; } save(); render(); window.scrollTo(0,0); }
function gpsLogHtml(src){ const log=src==='hpo'?S.runs:S.run.log; if(src!=='hpo'&&!S.run.setup) return ''; const rows=Object.keys(log).map(k=>({k,x:log[k]})).filter(r=>r.x&&r.x.gps).sort((a,b)=>String(b.x.gps.at||b.x.date).localeCompare(String(a.x.gps.at||a.x.date))); if(!rows.length) return '<h2 class="sec">GPS run log</h2><p class="help">Runs you track with GPS show up here with distance, pace and a 5K estimate.</p>';
  const best=rows.filter(r=>r.x.gps.est5k&&r.x.gps.m>=1500).map(r=>r.x.gps.est5k).sort((a,b)=>a-b)[0];
  return `<h2 class="sec">GPS run log</h2>${best?`<p class="help">Best 5K estimate from a tracked run: <b>${fmtClock(best)}</b>.</p>`:''}<table><tr><th>Date</th><th>Dist</th><th>Time</th><th>Pace</th><th>5K est</th></tr>${rows.map(r=>{ const g=r.x.gps, U=g.u==='mi'?1609.344:1000; return `<tr onclick="gpsOpen('${r.k}')"><td>${fmtDate(g.at||r.x.date)}</td><td>${(g.m/U).toFixed(2)} ${g.u}</td><td>${fmtDur(g.ms)}</td><td><b>${fmtPace(g.ms/1000/(g.m/1000),g.u)}</b></td><td>${g.est5k?fmtClock(g.est5k):'–'}</td></tr>`; }).join('')}</table><p class="help">Tap a run to open its map and splits.</p>`; }
