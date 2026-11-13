// NO EXCUSES — 30 days, every session 10 minutes or less, no equipment.
// Optional: pull-up bar (otherwise table/towel rows), chair or bench (otherwise floor).
// Each movement line has three versions: s = Scaled, r = RX, p = RX+.
const M=(s,r,p)=>({s,r,p});
const NE_MOVES={
 pushup:M('Incline or knee push ups','Push ups','Decline or archer push ups'),
 pike:M('Pike push ups from knees','Pike push ups','Feet-elevated pike or wall handstand push ups'),
 dip:M('Bench dips, knees bent (chair)','Bench dips, legs straight (chair)','Dips with feet elevated on second chair'),
 hindu:M('Down dog → cobra, slow','Hindu push ups','Dive-bomber push ups'),
 squat:M('Squats to a chair','Air squats','Jump squats'),
 lunge:M('Static split squats','Reverse lunges','Jumping lunges'),
 bss:M('Split squats','Bulgarian split squats (rear foot on chair)','Jumping Bulgarian split squats'),
 pistol:M('Assisted pistols holding a doorframe','Pistol negatives (5 sec down) to a chair','Pistols'),
 bridge:M('Glute bridges','Single-leg glute bridges','Single-leg bridges, 3 sec hold at top'),
 wallsit:M('Wall sit, thighs above parallel','Wall sit at parallel','Wall sit, one leg extended, alternate'),
 pull:M('Table rows, knees bent (or jumping pull ups)','Table/towel rows, legs straight (or pull ups)','Feet-elevated rows (or chest-to-bar pull ups)'),
 pullneg:M('Table rows','Pull-up negatives, 5 sec down (or feet-elevated rows)','Archer pull ups'),
 superman:M('Superman holds','Superman reps','Swimmers'),
 hollow:M('Tuck hold','Hollow hold','Hollow rocks'),
 plank:M('Plank from knees','Plank','Long-lever plank (hands past head)'),
 sideplank:M('Side plank from knees','Side plank','Side plank with top-leg raise'),
 deadbug:M('Dead bugs, arms only','Dead bugs','Dead bugs with 3 sec hold'),
 legraise:M('Lying knee raises','Lying leg raises','Hanging leg raises (bar) or V-ups'),
 situp:M('Crunches','Sit ups','Butterfly sit ups'),
 bicycle:M('Slow bicycle crunches','Bicycle crunches','Bicycle crunches, legs 6" off floor'),
 flutter:M('Flutter kicks, hands under hips','Flutter kicks','Flutter kicks, head and shoulders up'),
 taps:M('Shoulder taps from knees','Plank shoulder taps','Plank shoulder taps, feet together'),
 climber:M('Slow mountain climbers','Mountain climbers','Cross-body mountain climbers'),
 burpee:M('Step-back burpees','Burpees','Burpee tuck jumps'),
 sprawl:M('Step-back sprawls','Sprawls','Sprawl to jump squat'),
 jacks:M('Half jacks','Jumping jacks','Star jumps'),
 highknee:M('Marching high knees','High knees','Sprint-pace high knees'),
 bear:M('Bear crawl hold (knees 1" up)','Bear crawl forward and back','Bear crawl with opposite-hand shoulder tap'),
 broad:M('Squat to tall reach','Broad jumps','Broad jump + jump squat'),
 calf:M('Calf raises','Single-leg calf raises','Single-leg calf raises off a step'),
 crab:M('Crab hold','Crab walk','Crab walk with toe touch'),
 inchworm:M('Inchworm, knees down','Inchworms','Inchworm with push up'),
};
// days: t title, f focus, fmt format, dur minutes (whole session), blocks [{h header, lines:[ [moveKey, count] | string ]}]
// count can include {n} markers for RX+ bumps; keep text plain.
// Pull alternatives when there is no bar and no sturdy table
const NE_NOPULL={
 pull:M('Doorframe rows, feet close to the frame','Doorframe rows, feet forward, body straight (or towel-over-door rows)','One-arm doorframe rows, alternate'),
 pullneg:M('Doorframe rows','Towel-over-door rows, 5 sec negatives','One-arm doorframe rows'),
};
const NE_PULL_HELP='Doorframe rows: stand in a doorway, grab both sides of the frame at chest height, walk the feet toward the frame and lean back with straight arms, then row the chest to the frame and lower slowly. Walk the feet further forward to make it harder. Towel rows: loop a towel over the top of a closed door, hold both ends, same idea.';
const NE_DAYS=[
 {t:'Baseline Test',f:'test',fmt:'4 × 2 min max efforts, 30 sec between',dur:10,test:true,b:[{h:'2 min each, write the numbers down',lines:[['pushup','Max push ups'],['squat','Max squats'],['pull','Max rows / pull ups'],['plank','Max plank hold (cap 2:00)']]},{h:'Rule',lines:['Pick one version of each and keep it the same on Day 30.']}]},
 // ---- Week 1: foundation ----
 {t:'Push 1',f:'push',fmt:'EMOM 8',dur:9,b:[{h:'Every minute for 8 min — odd / even',lines:[['pushup','8 push ups'],['pike','6 pike push ups']]},{h:'Finisher',lines:[['plank','30 sec plank']]}]},
 {t:'Legs 1',f:'legs',fmt:'Tabata × 2 · bridges in the break',dur:9,b:[{h:'Tabata 1 — 8 × 20 on / 10 off',lines:[['squat','Squats']]},{h:'1 min active break',lines:[['bridge','Glute bridges, slow, the whole minute']]},{h:'Tabata 2 — 8 × 20 on / 10 off',lines:[['lunge','Alternating lunges']]}]},
 {t:'Pull + Core 1',f:'pull',fmt:'4 rounds · 100 s continuous',b:[{h:'4 rounds, no rest — 30 / 25 / 20 / 25 s',lines:[['pull','8 rows / pull ups (30 s)'],['superman','10 supermans (25 s)'],['hollow','Hollow hold (20 s)'],['climber','Mountain climbers to the end (25 s)']]}]},
 {t:'Engine 1',f:'engine',fmt:'AMRAP 8',dur:9,b:[{h:'As many rounds as possible in 8 min — count rounds',lines:[['burpee','5 burpees'],['climber','10 mountain climbers each leg'],['jacks','15 jumping jacks']]}]},
 {t:'Full Body 1',f:'full',fmt:'Ladder 1-5-1, for time',dur:9,b:[{h:'1 rep each, then 2, 3, 4, 5, then back down to 1 — log the time',lines:[['pushup','Push ups'],['squat','Squats'],['situp','Sit ups']]}]},
 {t:'Core 1',f:'core',fmt:'3 rounds · 5 × 30 s stations',b:[{h:'30 sec each, 15 sec between rounds',lines:[['plank','Plank'],['sideplank','Side plank left'],['sideplank','Side plank right'],['deadbug','Dead bugs'],['legraise','Leg raises']]}]},
 {t:'Reset 1',f:'reset',fmt:'Flow — 8 min',dur:8,b:[{h:'Slow, breathe, 1 min each',lines:["World's greatest stretch, alternate sides",'Cat-cow','Down dog → cobra, slow','Deep squat hold, elbows push knees out','Couch stretch left','Couch stretch right','Pigeon left','Pigeon right']}]},
 // ---- Week 2: build ----
 {t:'Push 2',f:'push',fmt:'EMOM 9 · core fills the minute',b:[{h:'Every minute for 9 min — rotate 1 / 2 / 3, then fill the rest of the minute',lines:[['pushup','10 push ups → hollow hold to the minute'],['pike','7 pike push ups → plank to the minute'],['dip','8 dips (chair) or Hindu push ups → flutter kicks to the minute']]}]},
 {t:'Legs 2',f:'legs',fmt:'5 rounds for time, cap 9 min',dur:10,b:[{h:'5 rounds — log the time',lines:[['squat','15 squats'],['lunge','10 lunges (5 each)'],['bridge','10 glute bridges']]}]},
 {t:'Pull + Core 2',f:'pull',fmt:'4 rounds · 100 s continuous',b:[{h:'4 rounds, no rest — 30 / 25 / 25 / 20 s',lines:[['pull','8 rows / pull ups (30 s)'],['superman','12 supermans (25 s)'],['hollow','Hollow hold (25 s)'],['bear','Bear crawl to the end (20 s)']]}]},
 {t:'Engine 2',f:'engine',fmt:'Tabata × 2 · plank in the break',b:[{h:'Tabata 1 — 8 × 20 on / 10 off, count total reps',lines:[['burpee','Burpees']]},{h:'1 min active break',lines:[['plank','Plank, the whole minute']]},{h:'Tabata 2 — 8 × 20 on / 10 off',lines:[['highknee','High knees']]}]},
 {t:'Full Body 2',f:'full',fmt:'AMRAP 9',dur:10,b:[{h:'As many rounds as possible in 9 min — count rounds',lines:[['pushup','6 push ups'],['squat','9 squats'],['situp','12 sit ups']]}]},
 {t:'Core 2',f:'core',fmt:'Every 45 s × 12 · hold fills the slot',b:[{h:'New station every 45 sec, rotate 1 / 2 / 3, four times through — finish the reps, hold the rest',lines:[['legraise','10 leg raises → hollow hold to 45 s'],['climber','20 mountain climbers → plank to 45 s'],['situp','12 sit ups → dead bugs to 45 s']]}]},
 {t:'Reset 2',f:'reset',fmt:'Flow — 8 min',dur:8,b:[{h:'Slow, breathe, 1 min each',lines:["World's greatest stretch, alternate sides",'Inchworm to cobra, slow','Deep squat hold with rotation reach','Couch stretch left','Couch stretch right','Frog stretch','90/90 hip switches','Child\'s pose']}]},
 // ---- Week 3: push ----
 {t:'Push 3',f:'push',fmt:'Density 8 min',dur:9,b:[{h:'As many sets as possible in 8 min, rest as needed — count sets',lines:[['pushup','8 push ups'],['pike','5 pike push ups']]},{h:'Finisher',lines:[['taps','20 shoulder taps']]}]},
 {t:'Legs 3',f:'legs',fmt:'EMOM 10 · fills the minute',b:[{h:'Every minute for 10 min — odd / even, then fill the rest of the minute',lines:[['squat','12 squats → wall sit to the minute'],['bss','6 Bulgarian split squats each leg → calf raises to the minute']]}]},
 {t:'Pull + Core 3',f:'pull',fmt:'Row ladder 2-4-6-8-6-4-2',dur:9,b:[{h:'Ladder — log the time',lines:[['pull','Rows / pull ups: 2, 4, 6, 8, 6, 4, 2'],['hollow','10 hollow rocks between every rung']]}]},
 {t:'Engine 3',f:'engine',fmt:'For time, cap 9 min · plank to the cap',b:[{h:'For time — log it',lines:[['burpee','50 burpees (Scaled 30 · RX+ 60)']]},{h:'Finished early?',lines:[['plank','Plank until the cap']]}]},
 {t:'Full Body 3',f:'full',fmt:'Chipper, cap 10 min',dur:10,b:[{h:'Straight through, for time',lines:[['pushup','20 push ups'],['squat','30 squats'],['pull','20 rows / pull ups'],['lunge','30 lunges (15 each)'],['situp','20 sit ups'],['climber','30 mountain climbers']]}]},
 {t:'Core 3',f:'core',fmt:'Tabata × 2 · dead bugs in the break',b:[{h:'Tabata 1 — 8 × 20 on / 10 off, alternate',lines:[['hollow','Hollow rocks'],['taps','Plank shoulder taps']]},{h:'1 min active break',lines:[['deadbug','Dead bugs, the whole minute']]},{h:'Tabata 2 — alternate',lines:[['legraise','Leg raises'],['flutter','Flutter kicks']]}]},
 {t:'Reset 3',f:'reset',fmt:'Flow — 8 min',dur:8,b:[{h:'Slow, breathe, 1 min each',lines:['Cat-cow','Thread the needle, each side','Down dog → cobra, slow','Deep squat hold','Couch stretch left','Couch stretch right','Hamstring floss, each leg','Supine twist, each side']}]},
 // ---- Week 4: peak ----
 {t:'Push 4',f:'push',fmt:'EMOM 10 · core fills the minute',b:[{h:'Every minute for 10 min — rotate 1 / 2 / 3, then fill the rest of the minute',lines:[['pushup','12 push ups → shoulder taps to the minute'],['pike','8 pike push ups → plank to the minute'],['hindu','8 Hindu push ups → hollow rocks to the minute']]}]},
 {t:'Legs 4',f:'legs',fmt:'100 + 30, for time',dur:10,b:[{h:'For time — log it',lines:[['squat','100 squats'],['lunge','30 lunges (15 each)']]},{h:'Then',lines:[['wallsit','Max wall sit (cap 2 min)']]}]},
 {t:'Pull + Core 4',f:'pull',fmt:'4 rounds · 90 on / 30 active',b:[{h:'Each round: 30 sec each; 30 sec dead bugs between rounds',lines:[['pull','Max rows / pull ups'],['superman','Supermans'],['hollow','Hollow hold'],['deadbug','Dead bugs (the 30 s between rounds)']]},{h:'Score',lines:['Total rows / pull ups across all 4 rounds']}]},
 {t:'Engine 4',f:'engine',fmt:'AMRAP 10',dur:10,b:[{h:'As many rounds as possible in 10 min — count rounds',lines:[['burpee','5 burpees'],['squat','10 squats (RX+ jump squats)'],['climber','15 mountain climbers each leg']]}]},
 {t:'Full Body 4',f:'full',fmt:'EMOM 10 · fills the minute',b:[{h:'Every minute — rotate 1 / 2 / 3 / 4, minutes 9-10 repeat 1 and 2; fill the rest of each minute',lines:[['pushup','10 push ups → mountain climbers to the minute'],['squat','15 squats → wall sit to the minute'],['pull','8 rows / pull ups → superman hold to the minute'],['situp','12 sit ups → plank to the minute']]}]},
 {t:'Core 4',f:'core',fmt:'3 rounds · 135 s continuous',b:[{h:'3 rounds — 35 / 30 / 30 / 20 / 20 s',lines:[['plank','Plank (35 s)'],['legraise','15 leg raises (30 s)'],['bicycle','Bicycle crunches (30 s)'],['sideplank','Side plank left (20 s)'],['sideplank','Side plank right (20 s)']]}]},
 {t:'Reset 4',f:'reset',fmt:'Flow — 8 min',dur:8,b:[{h:'Slow, breathe, 1 min each — tomorrow is the retest',lines:["World's greatest stretch, alternate sides",'Cat-cow','Down dog → cobra','Deep squat hold','Couch stretch left','Couch stretch right','Pigeon left','Pigeon right']}]},
 {t:'Retest',f:'test',fmt:'4 × 2 min max efforts, 30 sec between',dur:10,test:true,b:[{h:'Same versions you used on Day 1',lines:[['pushup','Max push ups'],['squat','Max squats'],['pull','Max rows / pull ups'],['plank','Max plank hold (cap 2:00)']]},{h:'Then',lines:['Compare to Day 1. No excuses.']}]},
];
const NE_FOCUS={test:'Test',push:'Push',legs:'Legs',pull:'Pull + Core',engine:'Engine',full:'Full Body',core:'Core',reset:'Reset'};
const NE_WARM=['Arm circles 20 sec','Leg swings 10 each','5 inchworms','10 squats, slow','10 push ups, easy'];
const NE_RULES=['10 minutes or less. Warm-up is 60 seconds of the list above, then go.','Scaled / RX / RX+ is per movement — tap a line to change just that one. Earn RX+ by hitting RX clean for two sessions.','No pull-up bar? Rows under a sturdy table or with a towel over a door. No chair? Pike push ups replace dips, floor replaces bench.','Missed a day? Do it the next day. The plan is 30 sessions, not 30 calendar days.','Reset days count. Do them.'];

// ---------- INTERVAL TIMERS (one per day; the app's countdown follows these automatically) ----------
const SEG=(l,s,k,r)=>({l,s,k:k||'work',r:r||''});
const tWarm=()=>[SEG('Warm-up — arm circles, leg swings, inchworms, easy squats & push ups',60,'warm')];
const tTabata=(a,b)=>{ const o=[]; for(let i=0;i<8;i++){ o.push(SEG(b&&i%2?b:a,20,'work',`${i+1} / 8`)); if(i<7) o.push(SEG('Rest',10,'rest',`${i+1} / 8`)); } return o; };
const tEmom=(n,labels)=>{ const o=[]; for(let i=0;i<n;i++) o.push(SEG(labels[i%labels.length],60,'work',`Min ${i+1} / ${n}`)); return o; };
const tRounds=(n,stations,rest)=>{ const o=[]; for(let r=0;r<n;r++){ stations.forEach(([l,s])=>o.push(SEG(l,s,'work',`Round ${r+1} / ${n}`))); if(rest&&r<n-1) o.push(SEG('Rest',rest,'rest',`Round ${r+1} / ${n}`)); } return o; };
const tOne=(l,s,k)=>[SEG(l,s,k||'work')];
const tFlow=(lines)=>lines.map((l,i)=>SEG(l,60,'work',`${i+1} / ${lines.length}`));
const tTest=()=>[SEG('Max push ups',120,'work','1 / 4'),SEG('Rest',30,'rest'),SEG('Max squats',120,'work','2 / 4'),SEG('Rest',30,'rest'),SEG('Max rows / pull ups',120,'work','3 / 4'),SEG('Rest',30,'rest'),SEG('Max plank hold',120,'work','4 / 4')];
const NE_TIMERS=[
 tTest(),
 [...tWarm(),...tEmom(8,['8 push ups','6 pike push ups']),SEG('Plank',30)],
 [...tWarm(),...tTabata('Squats'),SEG('Glute bridges, slow',60,'work','Active break'),...tTabata('Alternating lunges')],
 [...tWarm().map(s=>Object.assign(s,{s:50})),...tRounds(4,[['8 rows / pull ups',30],['10 supermans',25],['Hollow hold',20],['Mountain climbers',25]],0)],
 [...tWarm(),...tOne('AMRAP — 5 burpees · 10 climbers each · 15 jacks',480)],
 [...tWarm(),...tOne('Ladder 1-5-1 — push up · squat · sit up (stop the clock when done)',480)],
 [...tRounds(3,[['Plank',30],['Side plank L',30],['Side plank R',30],['Dead bugs',30],['Leg raises',30]],15)],
 tFlow(["World's greatest stretch",'Cat-cow','Down dog → cobra','Deep squat hold','Couch stretch L','Couch stretch R','Pigeon L','Pigeon R']),
 [...tWarm(),...tEmom(9,['10 push ups → hollow hold','7 pike push ups → plank','8 dips / Hindu push ups → flutter kicks'])],
 [...tWarm(),...tOne('5 rounds for time — 15 squats · 10 lunges · 10 bridges (cap)',540)],
 [...tWarm().map(s=>Object.assign(s,{s:50})),...tRounds(4,[['8 rows / pull ups',30],['12 supermans',25],['Hollow hold',25],['Bear crawl',20]],0)],
 [...tWarm(),...tTabata('Burpees'),SEG('Plank',60,'work','Active break'),...tTabata('High knees')],
 [...tWarm(),...tOne('AMRAP — 6 push ups · 9 squats · 12 sit ups',540)],
 [...tWarm(),...tEmom(12,['10 leg raises → hollow hold','20 mountain climbers → plank','12 sit ups → dead bugs']).map(s=>Object.assign(s,{s:45,r:s.r.replace('Min','Station')}))],
 tFlow(["World's greatest stretch",'Inchworm to cobra','Deep squat + rotation','Couch stretch L','Couch stretch R','Frog stretch','90/90 switches',"Child's pose"]),
 [...tWarm(),...tOne('Density — 8 push ups + 5 pike, as many sets as possible',480),SEG('20 shoulder taps',30)],
 tEmom(10,['12 squats → wall sit','6 Bulgarian split squats each leg → calf raises']),
 [...tWarm(),...tOne('Row ladder 2-4-6-8-6-4-2 with 10 hollow rocks between (stop when done)',480)],
 [...tWarm(),...tOne('50 burpees for time (cap) — plank if you finish early',540)],
 [...tWarm(),...tOne('Chipper — 20 push ups · 30 squats · 20 rows · 30 lunges · 20 sit ups · 30 climbers (cap)',540)],
 [...tWarm(),...tTabata('Hollow rocks','Shoulder taps'),SEG('Dead bugs',60,'work','Active break'),...tTabata('Leg raises','Flutter kicks')],
 tFlow(['Cat-cow','Thread the needle L','Thread the needle R','Down dog → cobra','Deep squat hold','Couch stretch L','Couch stretch R','Supine twist']),
 tEmom(10,['12 push ups → shoulder taps','8 pike push ups → plank','8 Hindu push ups → hollow rocks']),
 [...tOne('100 squats + 30 lunges for time (cap)',420),SEG('Rest',30,'rest'),SEG('Max wall sit',120)],
 (()=>{const o=[];for(let r=0;r<4;r++){[['Max rows / pull ups',30],['Supermans',30],['Hollow hold',30]].forEach(([l,s])=>o.push(SEG(l,s,'work',`Round ${r+1} / 4`)));if(r<3)o.push(SEG('Dead bugs — active rest',30,'rest',`Round ${r+1} / 4`));}return o;})(),
 tOne('AMRAP — 5 burpees · 10 squats · 15 climbers each',600),
 tEmom(10,['10 push ups → mountain climbers','15 squats → wall sit','8 rows / pull ups → superman hold','12 sit ups → plank']),
 [...tWarm().map(s=>Object.assign(s,{s:55})),...tRounds(3,[['Plank',35],['15 leg raises',30],['Bicycle crunches',30],['Side plank L',20],['Side plank R',20]],0)],
 tFlow(["World's greatest stretch",'Cat-cow','Down dog → cobra','Deep squat hold','Couch stretch L','Couch stretch R','Pigeon L','Pigeon R']),
 tTest(),
];
const neSw=(segs)=>{ let t=0; for(let i=0;i<segs.length;i++){ t+=segs[i].s; const a=segs[i],b=segs[i+1]; const base=l=>String(l).replace(/\s*[—-]\s*(left|right)\s*$/i,'').trim().toLowerCase(); if(b&&a.k==='work'&&b.k==='work'&&base(a.l)!==base(b.l)&&!/^(min|station)\b/i.test(b.r||'')&&!/^(min|station)\b/i.test(a.r||'')) t+=10; } return t; };
NE_DAYS.forEach((d,i)=>{ const t=neSw(NE_TIMERS[i]); d.dur=Math.ceil(t/60); d.secs=t; });

// ---------- BONUS WORKOUTS (optional second session, 10 min) ----------
// Core days get an upper-body bonus; every other day gets a core bonus. Rotates by week.
const NE_BONUS={
 core:[
  {t:'Core Bonus A',fmt:'EMOM 9 — rotate 1 / 2 / 3',b:[{h:'Every minute for 9 min',lines:[['hollow','30 sec hollow hold'],['legraise','12 leg raises'],['bicycle','20 bicycle crunches each side']]}],tm:()=>[...tWarm().map(s=>Object.assign(s,{l:'Warm-up — cat-cow, dead bugs, easy plank'})),...tEmom(9,['30 sec hollow hold','12 leg raises','20 bicycle crunches each side'])]},
  {t:'Core Bonus B',fmt:'3 rounds · 30 on / 10 off',b:[{h:'3 rounds, 30 sec each station, 10 sec between',lines:[['plank','Plank'],['sideplank','Side plank L'],['sideplank','Side plank R'],['deadbug','Dead bugs'],['flutter','Flutter kicks']]}],tm:()=>{const o=[SEG('Warm-up — cat-cow, dead bugs, easy plank',10,'warm')];const st=['Plank','Side plank L','Side plank R','Dead bugs','Flutter kicks'];for(let r=0;r<3;r++){st.forEach((l,i)=>{o.push(SEG(l,30,'work',`Round ${r+1} / 3`));if(r*5+i<14)o.push(SEG('Rest',10,'rest',`Round ${r+1} / 3`));});}return o;}},
 {t:'Core Bonus C',fmt:'Tabata × 2',b:[{h:'Tabata 1 — alternate',lines:[['hollow','Hollow rocks'],['taps','Plank shoulder taps']]},{h:'1 min rest',lines:[]},{h:'Tabata 2 — alternate',lines:[['legraise','Leg raises'],['climber','Mountain climbers']]}],tm:()=>[...tWarm().map(s=>Object.assign(s,{l:'Warm-up — cat-cow, dead bugs, easy plank'})),...tTabata('Hollow rocks','Plank shoulder taps'),SEG('Rest',60,'rest'),...tTabata('Leg raises','Mountain climbers')]},
  {t:'Core Bonus D',fmt:'AMRAP 9',b:[{h:'As many rounds as possible in 9 min — count rounds',lines:[['situp','10 sit ups'],['legraise','10 leg raises'],['superman','10 supermans'],['plank','20 sec plank']]}],tm:()=>[...tWarm().map(s=>Object.assign(s,{l:'Warm-up — cat-cow, dead bugs, easy plank'})),...tOne('AMRAP — 10 sit ups · 10 leg raises · 10 supermans · 20 sec plank',540)]},
 ],
 upper:[
  {t:'Upper Bonus A',fmt:'EMOM 9 — rotate 1 / 2 / 3',b:[{h:'Every minute for 9 min',lines:[['pushup','10 push ups'],['pull','8 rows / pull ups'],['pike','6 pike push ups']]}],tm:()=>[...tWarm(),...tEmom(9,['10 push ups','8 rows / pull ups','6 pike push ups'])]},
  {t:'Upper Bonus B',fmt:'Ladder 1-5-1, for time',b:[{h:'1 rep each, then 2 … 5, back down — log the time',lines:[['pushup','Push ups'],['pull','Rows / pull ups'],['dip','Dips / Hindu push ups']]}],tm:()=>[...tWarm(),...tOne('Ladder 1-5-1 — push ups · rows · dips (stop when done)',480)]},
  {t:'Upper Bonus C',fmt:'Tabata × 2',b:[{h:'Tabata 1 — alternate',lines:[['pushup','Push ups'],['pull','Rows / pull ups']]},{h:'1 min rest',lines:[]},{h:'Tabata 2 — alternate',lines:[['pike','Pike push ups'],['superman','Supermans']]}],tm:()=>[...tWarm(),...tTabata('Push ups','Rows / pull ups'),SEG('Rest',60,'rest'),...tTabata('Pike push ups','Supermans')]},
  {t:'Upper Bonus D',fmt:'4 rounds · 90 on / 30 off',b:[{h:'Each round: 30 sec each, no rest between',lines:[['pushup','Max push ups'],['pull','Max rows / pull ups'],['taps','Shoulder taps']]}],tm:()=>[...tWarm(),...tRounds(4,[['Max push ups',30],['Max rows / pull ups',30],['Shoulder taps',30]],30)]},
 ],
};
function neBonusFor(d){ const day=NE_DAYS[d-1]; const pool=day.f==='core'?NE_BONUS.upper:NE_BONUS.core; return pool[(Math.ceil(Math.max(1,d-1)/7)-1+4)%4]; }
