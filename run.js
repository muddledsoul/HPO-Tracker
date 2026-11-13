// ROAD WORK — adaptive running plan. Goal: Return to running (5K run/walk), 5K, 10K, Half, Marathon.
// Paces from Daniels' VDOT (one race or time trial → E / M / T / I / R paces). Plan regenerates from current fitness,
// weekly volume, days per week, and race date (or a default length → estimated readiness date). Adjusts weekly from what you log.

const R_GOALS={rtr:{n:'Return to running (5K)',dist:5,min:8,def:9,max:12},k5:{n:'5K',dist:5,min:6,def:8,max:12},k10:{n:'10K',dist:10,min:8,def:10,max:14},half:{n:'Half marathon',dist:21.0975,min:10,def:12,max:18},full:{n:'Marathon',dist:42.195,min:14,def:18,max:22}};
const R_MI=1.609344;
// ---- VDOT (Daniels & Gilbert)
function vdotFrom(distKm,sec){ const t=sec/60, v=distKm*1000/t; const vo2=-4.60+0.182258*v+0.000104*v*v; const pct=0.8+0.1894393*Math.exp(-0.012778*t)+0.2989558*Math.exp(-0.1932605*t); return vo2/pct; }
function velAt(vo2){ return (-0.182258+Math.sqrt(0.182258*0.182258-4*0.000104*(-4.60-vo2)))/(2*0.000104); } // m/min
function paceSecKm(vdot,pct){ return 1000/velAt(vdot*pct)*60; }
// training paces in sec/km
function rPaces(vdot){ return {E:paceSecKm(vdot,0.68),Elo:paceSecKm(vdot,0.62),Ehi:paceSecKm(vdot,0.74),M:paceSecKm(vdot,0.80),T:paceSecKm(vdot,0.86),I:paceSecKm(vdot,0.975),R:paceSecKm(vdot,1.07)}; }
function predictSec(vdot,distKm){ // solve for time where vdotFrom(dist,t)=vdot
  let lo=distKm*120, hi=distKm*900; for(let i=0;i<40;i++){ const mid=(lo+hi)/2; if(vdotFrom(distKm,mid)>vdot) lo=mid; else hi=mid; } return (lo+hi)/2; }
function fmtPace(secKm,unit){ const s=Math.round(unit==='mi'?secKm*R_MI:secKm); return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); }
function fmtClock(sec){ sec=Math.round(sec); const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60; return (h?h+':'+String(m).padStart(2,'0'):m)+':'+String(s).padStart(2,'0'); }
// ---- plan generation
// setup: {goal, vdot, weeklyKm (current), days (3-5), start (YYYY-MM-DD), race (YYYY-MM-DD|null), unit}
function rWeeks(setup){ const g=R_GOALS[setup.goal]; if(setup.race){ const n=Math.floor((new Date(setup.race+'T12:00:00')-new Date(setup.start+'T12:00:00'))/(7*864e5)); return Math.max(g.min,Math.min(g.max,n)); } return g.def; }
function rReadiness(setup){ const d=new Date(setup.start+'T12:00:00'); d.setDate(d.getDate()+rWeeks(setup)*7-1); return d; }
function rPhase(w,n){ const f=w/n; if(w===n) return 'Race week'; if(w>=n-1) return 'Taper'; if(f<0.4) return 'Base'; if(f<0.8) return 'Build'; return 'Peak'; }
// weekly volume targets (km): start from current, +8%/wk, cutback every 4th, taper
function rVolumes(setup,n){ const g=R_GOALS[setup.goal]; const floor={rtr:0,k5:12,k10:18,half:28,full:40}[setup.goal]; const peakCap={rtr:20,k5:45,k10:60,half:75,full:100}[setup.goal];
  let v=Math.max(setup.weeklyKm||0,floor*0.6); const out=[]; for(let w=1;w<=n;w++){ let t=v; if(w%4===0&&w<n-1) t=v*0.75; if(w===n-1) t=v*0.65; if(w===n) t=v*0.45; out.push(Math.round(Math.min(t,peakCap)*10)/10); if(!(w%4===0)&&w<n-2) v=Math.min(v*1.08,peakCap); } return out; }
function rLongPct(goal){ return {rtr:0.35,k5:0.33,k10:0.33,half:0.35,full:0.32}[goal]; }
// run/walk ladder for return-to-running (weeks 1-9)
const R_RW=[[1,1,8],[1.5,1,8],[2,1,7],[3,1,6],[4,1,5],[5,1,4],[8,1,3],[10,1,2],[15,1,2],[20,0,1],[25,0,1],[30,0,1]];
function rSession(setup,w,n,dayIdx,volKm,paces){ // returns {t,kind,km|min,desc,segs}
  const g=setup.goal, days=setup.days, unit=setup.unit||'mi', P=paces; const long=Math.max(3,volKm*rLongPct(g)); const easy=Math.max(3,(volKm-long)/(days-1));
  const pace=k=>fmtPace(P[k],unit)+' /'+unit;
  if(g==='rtr'){ const rw=R_RW[Math.min(R_RW.length-1,(w-1))]; const [run,walk,reps]=rw; const isLong=dayIdx===days-1; const reps2=isLong?reps+2:reps; const total=reps2*(run+walk);
    if(w>=n-1&&isLong) return {t:'5K time trial / race',kind:'race',min:40,desc:'Run 5K continuously if you can; walk breaks allowed. Log the time — it sets your paces for the next plan.',segs:[GS('Warm-up walk',300,'warm'),GS('5K — steady',1800),GS('Cool-down walk',300,'warm')]};
    const segs=[GS('Warm-up walk',300,'warm')]; for(let i=0;i<reps2;i++){ segs.push(GS(`Run ${run} min — easy, conversational`,run*60,'work',`${i+1} / ${reps2}`)); if(walk) segs.push(GS(`Walk ${walk} min`,walk*60,'rest',`${i+1} / ${reps2}`)); } segs.push(GS('Cool-down walk',300,'warm'));
    return {t:`Run / walk — ${reps2} × (${run} min run${walk?' / '+walk+' min walk':''})`,kind:'rw',min:total+10,desc:`Easy effort. If you can't talk, slow down. ${isLong?'Long version today.':''}`,segs}; }
  const km=x=>unit==='mi'?(x/R_MI).toFixed(1)+' mi':x.toFixed(1)+' km';
  const easySegs=(d)=>[GS(`Easy run — ${km(d)} at ${pace('E')}`,Math.round(d*P.E))];
  const phase=rPhase(w,n); const isRaceWeek=w===n;
  // day roles by days/week: last = long; one T; one I (build/peak); rest easy
  const roles=(()=>{ const r=[]; for(let i=0;i<days;i++) r.push('E'); r[days-1]='L'; if(days>=3) r[Math.floor((days-1)/2)]='Q1'; if(days>=4) r[0]='Q2'; return r; })();
  const role=roles[dayIdx];
  if(isRaceWeek&&role==='L'){ const d=R_GOALS[g].dist; const pred=predictSec(setup.vdot,d); return {t:`RACE — ${R_GOALS[g].n}`,kind:'race',km:d,desc:`Predicted ${fmtClock(pred)} (${fmtPace(pred/d,unit)} /${unit}). First third controlled, middle steady, last third everything.`,segs:[GS('Warm-up jog + strides',600,'warm'),GS(`Race — ${km(d)}`,Math.round(pred)),GS('Cool-down walk',300,'warm')]}; }
  if(role==='L'){ let d=long; let desc=`Long run at ${pace('E')}. Last mile can lift toward ${pace('M')}.`; let segs=[GS(`Long run — ${km(d)} easy`,Math.round(d*P.E))];
    if(g==='full'&&(phase==='Build'||phase==='Peak')&&w%2===0){ const mp=Math.round(d*0.4); desc=`Long run with the last ${km(mp)} at marathon pace ${pace('M')}.`; segs=[GS(`Easy — ${km(d-mp)}`,Math.round((d-mp)*P.E)),GS(`Marathon pace — ${km(mp)} at ${pace('M')}`,Math.round(mp*P.M))]; }
    if(w===n-1) d=Math.round(d*0.6*10)/10; return {t:`Long run — ${km(d)}`,kind:'L',km:d,desc,segs}; }
  if(role==='Q1'){ // tempo
    if(phase==='Base'||isRaceWeek){ const tmin=isRaceWeek?10:Math.min(20,10+w*2); return {t:`Tempo — ${tmin} min at ${pace('T')}`,kind:'T',km:Math.round((tmin*60/P.T+3)*10)/10,desc:`Comfortably hard — a pace you could hold for an hour. 10 min easy before and after.`,segs:[GS('Easy warm-up',600,'warm'),GS(`Tempo — ${tmin} min at ${pace('T')}`,tmin*60),GS('Easy cool-down',600,'warm')]}; }
    const reps=g==='full'||g==='half'?2:3; const tmin=g==='k5'?8:g==='k10'?10:12; const segs=[GS('Easy warm-up',600,'warm')]; for(let i=0;i<reps;i++){ segs.push(GS(`Tempo ${tmin} min at ${pace('T')}`,tmin*60,'work',`${i+1} / ${reps}`)); if(i<reps-1) segs.push(GS('Easy 3 min',180,'rest',`${i+1} / ${reps}`)); } segs.push(GS('Easy cool-down',600,'warm'));
    return {t:`Cruise intervals — ${reps} × ${tmin} min at ${pace('T')}`,kind:'T',km:Math.round((reps*tmin*60/P.T+3)*10)/10,desc:'Threshold pace, 3 min easy jog between. Steady, not a race.',segs}; }
  if(role==='Q2'){ if(phase==='Base') return {t:`Easy run — ${km(easy)} + 6 strides`,kind:'E',km:easy,desc:`Easy at ${pace('E')}; finish with 6 × 20 s relaxed strides, walk back.`,segs:[...easySegs(easy),...gOnOff(6,20,60,'Stride — fast and relaxed')]};
    const dist=g==='k5'?400:g==='k10'?800:1000; const reps=isRaceWeek?3:Math.min(g==='k5'?8:6,3+Math.floor(w/2)); const workSec=Math.round(dist/1000*P.I), restSec=Math.round(workSec*0.9); const segs=[GS('Easy warm-up',600,'warm'),...gOnOff(reps,workSec,restSec,`${dist} m at ${pace('I')}`),GS('Easy cool-down',600,'warm')];
    return {t:`Intervals — ${reps} × ${dist} m at ${pace('I')}`,kind:'I',km:Math.round((reps*dist/1000*2+3)*10)/10,desc:`Hard but controlled — 5K race effort or a touch faster. Jog the recoveries. ${isRaceWeek?'Short and sharp this week.':''}`,segs}; }
  return {t:`Easy run — ${km(easy)}`,kind:'E',km:easy,desc:`Conversational, ${pace('E')} or slower. These make the hard days work.`,segs:easySegs(easy)}; }
function rPlan(setup){ const n=rWeeks(setup); const vols=rVolumes(setup,n); const paces=rPaces(setup.vdot); const weeks=[]; for(let w=1;w<=n;w++){ const adj=(setup.adj&&setup.adj[w])||1; const vol=vols[w-1]*adj; const days=[]; for(let d=0;d<setup.days;d++) days.push(rSession(setup,w,n,d,vol,paces)); weeks.push({w,phase:rPhase(w,n),vol,days}); } return {n,weeks,paces}; }
const R_RULES=['One race or time trial sets every pace (Daniels VDOT). Log any run as a race effort and the paces update.','80% of your running is easy. If you cannot hold a conversation on an easy run, you are running it too fast — and that is the most common mistake in the plan.','Volume climbs ~8% a week, backs off every 4th week, and tapers the last two. The plan compresses or stretches to the race date you enter.','Miss a run: skip it, do not stack it. Miss a week: the plan repeats the week.','Joints: if anything swells or flares the morning after a run, the next run becomes the bike for the same minutes. The plan does not care which engine you used.','Return to running: run/walk only, no speed work, until you can run 30 minutes continuously.'];
