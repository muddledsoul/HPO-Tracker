// BULLETPROOF — 6-week joint-protective knee + ankle program. Every day 10 minutes or less.
// Shallow-range quad work, no lunges, no deep loading, hip and ankle strength, and a hard stop on swelling.
// A holding pattern for an irritable joint, not a fix for a mechanical problem.
// Equipment: PT band, a stair or step, a chair, a pillow. Backpack optional for step-ups later.
const KM=(s,r,p)=>({s,r,p});
const KA_MOVES={
 quadset:KM('Quad sets — leg straight, press the back of the knee down, squeeze 5 s','Quad sets with a rolled towel under the knee, 5 s squeeze','Quad sets, 5 s squeeze, then lift the heel 2" and hold 3 s'),
 slr:KM('Straight-leg raises to 30°','Straight-leg raises — quad locked out first, lift to the height of the other knee, 2 s down','Straight-leg raises with ankle weight or band'),
 tke:KM('Quad sets','Band terminal knee extension — band behind the knee anchored in front, straighten and squeeze 2 s','Single-leg band TKE standing on the pillow'),
 wallsit:KM('Wall sit, 30° — barely bent','Wall sit, 45° — above parallel, no deeper','Wall sit, 60° — still above parallel, 70% effort'),
 stepup:KM('Step-up onto a thick book, 2 s down','Step-up onto one stair, push through the heel, 2 s down','Step-up onto one stair with a light backpack, 3 s down'),
 minisquat:KM('Quarter squats to a high chair, hands on the counter','Quarter squats — 30-45° only, 2 s down, knees over toes','Quarter squats with a light backpack, 3 s down'),
 bridge:KM('Glute bridges','Single-leg glute bridges','Single-leg bridges, 3 s hold at the top'),
 clam:KM('Clamshells','Banded clamshells','Banded side-lying hip abduction, 2 s hold'),
 walk:KM('Side steps, no band','Banded lateral walks, band above the knees, quarter-squat depth','Banded monster walks'),
 rdl:KM('Single-leg RDL, hand on the wall, small range','Single-leg RDL, arms crossed — hinge, knee barely bent','Single-leg RDL holding a backpack'),
 hipext:KM('Standing hip extension, hold the wall','Banded standing hip extension — kick straight back, squeeze','Banded hip extension, 2 s hold'),
 calf:KM('Double-leg calf raises, 3 s down','Single-leg calf raises off a step, 3 s down','Single-leg calf raises off a step with a backpack'),
 soleus:KM('Seated calf raises','Bent-knee calf raises off a step','Single-leg bent-knee calf raises'),
 evert:KM('Band eversion, light band','Band eversion — band around the outside of the foot, turn the sole out','Band eversion, heavy band, 3 s hold'),
 dorsi:KM('Band dorsiflexion, light band','Band dorsiflexion — band anchored in front, pull the toes toward you','Band dorsiflexion, heavy band'),
 invert:KM('Band inversion, light','Band inversion — band around the inside of the foot, turn the sole in','Band inversion, heavy band'),
 balance:KM('Single-leg stand, fingertip on the wall','Single-leg stand, arms crossed, eyes open','Single-leg stand on a pillow, eyes closed'),
 ybal:KM('Foot reaches, short, hand on the wall','Y-balance foot reaches — tap forward, side, behind; no weight on the free foot','Y-balance reaches standing on a pillow'),
 heelslide:KM('Heel slides — lying, slide the heel toward you to a comfortable bend','Heel slides to full comfortable flexion, 3 s hold','Heel slides with a towel pull for the last few degrees'),
 hamcurl:KM('Standing hamstring curls, hold the wall','Prone hamstring curls with the band around the ankle','Single-leg bridge walkouts'),
 couch:KM('Half-kneeling hip flexor stretch (pad under the knee)','Couch stretch, pad under the knee','Couch stretch, upright torso'),
 calfst:KM('Wall calf stretch, straight knee','Wall calf stretch, straight knee then bent knee','Calf stretch off a step'),
 cars:KM('Ankle circles','Ankle CARs — slow, full-range circles, 5 each way','Ankle CARs standing on one leg'),
 bike:KM('Easy walk','Easy bike or brisk walk, no hills','Bike with light resistance, high cadence'),
};
const KS=(l,s,k,r)=>({l,s,k:k||'work',r:r||''});
const kWarm=()=>[KS('Warm-up — march in place, ankle circles, 10 quarter squats',30,'warm')];
const kSides=(l,s,rest)=>{ const o=[KS(l+' — left',s),KS(l+' — right',s)]; if(rest) o.push(KS('Rest',rest,'rest')); return o; };
const kRep=(l,s,rest)=>{ const o=[KS(l,s)]; if(rest) o.push(KS('Rest',rest,'rest')); return o; };
const kHold=(n,on,off,label)=>{ const o=[]; for(let i=0;i<n;i++){ o.push(KS(label||'Hold',on,'work',`Set ${i+1} / ${n}`)); if(i<n-1) o.push(KS('Rest',off,'rest')); } return o; };
const KA_T={
 Q1:{t:'Quad Activation',f:'knee',fmt:'quad sets · straight-leg raises · band TKE · shallow wall sits',b:[{h:'Quads — no bend under load',lines:[['quadset','10 × 5 s quad sets each leg'],['slr','12 straight-leg raises each leg'],['tke','15 band TKEs each leg']]},{h:'Wall sit — 3 × 30 s, shallow',lines:[['wallsit','Hold, above parallel']]}],
  tm:()=>[...kWarm(),...kSides('10 × 5 s quad sets',50),...kSides('12 straight-leg raises',40,10),...kSides('15 band TKEs',40,10),...kHold(3,30,30,'Wall sit, shallow')]},
 A1:{t:'Ankle + Balance',f:'ankle',fmt:'band 3-way · calf raises · single-leg balance',b:[{h:'Ankle band — each side',lines:[['evert','20 eversions'],['dorsi','20 dorsiflexions'],['invert','20 inversions']]},{h:'Calves — 2 sets',lines:[['calf','12 calf raises, 3 s down']]},{h:'Balance',lines:[['balance','30 sec each leg, twice']]}],
  tm:()=>[...kWarm(),...kSides('20 eversions',30),...kSides('20 dorsiflexions',30),...kSides('20 inversions',30,10),...kRep('12 calf raises, 3 s down',45,15),...kRep('12 calf raises, 3 s down',45,15),...kSides('Balance',30),...kSides('Balance',30)]},
 H1:{t:'Hips',f:'hips',fmt:'bridges · clamshells · banded walks · hip extension',b:[{h:'Hips — 2 rounds',lines:[['bridge','15 bridges'],['clam','15 clamshells each side'],['walk','10 banded walks each way'],['hipext','12 hip extensions each leg']]}],
  tm:()=>[...kWarm(),...kRep('15 bridges',35),...kSides('15 clamshells',30),...kRep('10 banded walks each way',35),...kSides('12 hip extensions',30,20),...kRep('15 bridges',35),...kSides('15 clamshells',30),...kRep('10 banded walks each way',35),...kSides('12 hip extensions',30)]},
 M:{t:'Motion + Flush',f:'reset',fmt:'heel slides · easy bike or walk · stretch',b:[{h:'Range',lines:[['heelslide','15 heel slides each leg, slow']]},{h:'Flush — 4 min',lines:[['bike','Easy bike or walk, no hills']]},{h:'Stretch',lines:[['couch','Couch stretch each side'],['calfst','Calf stretch each side'],['cars','Ankle CARs']]}],
  tm:()=>[...kWarm(),...kSides('15 heel slides, slow',45),...kRep('Easy bike or walk',240),...kSides('Couch stretch',45),...kSides('Calf stretch',30),KS('Ankle CARs both sides',30)]},
 Q2:{t:'Quads — Shallow Load',f:'knee',fmt:'step-ups · quarter squats · band TKE · wall sit',b:[{h:'Shallow loading — stop at 45°, never deeper',lines:[['stepup','10 step-ups each leg, 2 s down'],['minisquat','12 quarter squats, 2 s down']]},{h:'Quads',lines:[['tke','15 band TKEs each leg'],['slr','12 straight-leg raises each leg']]},{h:'Wall sit — 2 × 40 s',lines:[['wallsit','Hold, above parallel']]}],
  tm:()=>[...kWarm(),...kSides('10 step-ups, 2 s down',40,15),...kRep('12 quarter squats, 2 s down',40,15),...kSides('10 step-ups, 2 s down',40,15),...kRep('12 quarter squats, 2 s down',40,15),...kSides('15 band TKEs',35),...kSides('12 straight-leg raises',35,10),...kHold(2,40,30,'Wall sit, shallow')]},
 A2:{t:'Ankle + Balance',f:'ankle',fmt:'band 3-way · soleus · calf · Y-balance',b:[{h:'Ankle band — each side',lines:[['evert','25 eversions'],['dorsi','25 dorsiflexions'],['invert','25 inversions']]},{h:'Calves',lines:[['calf','12 calf raises each, 3 s down'],['soleus','15 bent-knee calf raises']]},{h:'Balance',lines:[['ybal','Y-balance 45 sec each leg']]}],
  tm:()=>[...kWarm(),...kSides('25 eversions',30),...kSides('25 dorsiflexions',30),...kSides('25 inversions',30,10),...kSides('12 calf raises, 3 s down',40),...kRep('15 bent-knee calf raises',40,15),...kSides('Y-balance',45)]},
 H2:{t:'Hips + Hamstrings',f:'hips',fmt:'single-leg RDL · hamstring curls · bridges · banded walks',b:[{h:'Posterior chain — 2 rounds',lines:[['rdl','8 single-leg RDLs each'],['hamcurl','12 hamstring curls each'],['bridge','12 single-leg bridges each']]},{h:'Hips',lines:[['walk','10 banded walks each way, twice']]}],
  tm:()=>[...kWarm(),...kSides('8 single-leg RDLs',40),...kSides('12 hamstring curls',30),...kSides('12 bridges',30,15),...kSides('8 single-leg RDLs',40),...kSides('12 hamstring curls',30),...kSides('12 bridges',30,15),...kRep('10 banded walks each way',35,10),...kRep('10 banded walks each way',35)]},
 Q3:{t:'Quads — Step Strength',f:'knee',fmt:'loaded step-ups · quarter squats · wall sit · TKE',b:[{h:'Shallow loading — still never past 45°',lines:[['stepup','10 step-ups each leg, 3 s down (backpack if the knee has been quiet)'],['minisquat','15 quarter squats, 3 s down']]},{h:'Isometric — 3 × 40 s',lines:[['wallsit','Hold, above parallel, 70% effort']]},{h:'Finisher',lines:[['tke','20 band TKEs each leg']]}],
  tm:()=>[...kWarm(),...kSides('10 step-ups, 3 s down',45,10),...kRep('15 quarter squats, 3 s down',50,10),...kSides('10 step-ups, 3 s down',45,10),...kRep('15 quarter squats, 3 s down',50,15),...kHold(3,40,20,'Wall sit, shallow'),KS('Rest',10,'rest'),...kSides('20 band TKEs',30)]},
 B3:{t:'Balance + Control',f:'ankle',fmt:'pillow balance · Y-balance · step-downs (small) · calves',b:[{h:'Balance',lines:[['balance','30 sec each leg, twice, eyes closed if steady'],['ybal','Y-balance 45 sec each leg']]},{h:'Control — small step only',lines:[['stepup','8 slow step-downs each leg from a low step']]},{h:'Calves',lines:[['calf','12 calf raises each, 3 s down']]}],
  tm:()=>[...kWarm(),...kSides('Balance',30),...kSides('Balance',30,10),...kSides('Y-balance',45,10),...kSides('8 slow step-downs, low step',40,10),...kSides('12 calf raises, 3 s down',40)]},
};
const KA_WEEKS=[['Q1','A1','H1','Q1','A1','H1','M'],['Q1','A1','H1','Q1','A1','H1','M'],['Q2','A2','H2','Q2','A2','H2','M'],['Q2','A2','H2','Q2','A2','H2','M'],['Q3','B3','H2','Q3','B3','H2','M'],['Q3','B3','H2','Q3','B3','H2','M']];
const KA_PHASE=['Phase 1 — Quiet the joint (no bend under load)','Phase 1 — Quiet the joint (no bend under load)','Phase 2 — Shallow strength (to 45°)','Phase 2 — Shallow strength (to 45°)','Phase 3 — Step strength + control','Phase 3 — Step strength + control'];
const KA_DAYS=[]; KA_WEEKS.forEach((w,wi)=>w.forEach(k=>{ const t=KA_T[k]; const secs=(typeof neSw==='function'?neSw(t.tm()):t.tm().reduce((a,s)=>a+s.s,0)); KA_DAYS.push({k,t:t.t,f:t.f,fmt:t.fmt,b:t.b,secs,dur:Math.ceil(secs/60),week:wi+1,phase:KA_PHASE[wi]}); }));
const KA_FOCUS={knee:'Knee',ankle:'Ankle',hips:'Hips',reset:'Motion'};
const KA_RULES=['Morning check first, every day: swelling? catching or giving way? If yes to either, today is Motion + Flush only — no quad loading — and the program holds where it is until two clear mornings in a row.','Knee flexion under load stays shallow: quarter squats and step-ups to 45° max for all six weeks. No lunges, no deep squats, no jumps. That is the point of this program.','Pain during is capped at 2/10. Pain is not the main signal here — next-morning swelling is.','Quads get worked daily without bending the knee (quad sets, straight-leg raises, band TKE). A swollen knee switches the quad off; these switch it back on.','Hips and ankles get the real loading. They can take it and they take load off the knee.','This is a holding pattern, not a diagnosis. Swelling, catching or giving way that keeps coming back needs an exam. See a provider and bring your Medical / PT report (More).'];
const KA_EQUIP=['PT band (loop or long)','A stair or step','A chair and a wall','Pillow (balance)','Rolled towel (quad sets)','Optional: backpack with a few books for step-ups in weeks 5-6'];

// ---------- FEET: plantar heel / arch add-on ----------
// Morning routine before the first steps (2-3 min), plus high-load plantar fascia strengthening every other day (towel-under-toes calf raise, slow).
Object.assign(KA_MOVES,{
 pfstretch:KM('Pull the toes back gently with a hand, 20 s','Plantar fascia stretch — cross the ankle over the knee, pull the toes and big toe back until the arch is taut, 30 s','Plantar fascia stretch standing with the toes up the wall, 30 s'),
 ballroll:KM('Roll a tennis ball under the arch, light','Roll a lacrosse or golf ball under the arch heel-to-toes, slow, 60 s','Standing on the ball, full weight, pause on hot spots'),
 shortfoot:KM('Toe spreads — spread and relax, 10 ×','Short foot — pull the ball of the foot toward the heel without curling the toes, 5 s hold, 10 ×','Short foot standing on one leg, 10 ×'),
 toeyoga:KM('Lift all toes, lower','Toe yoga — big toe up with the others down, then the others up with the big toe down, 10 ×','Toe yoga standing on one leg'),
 pfraise:KM('Double-leg calf raises with a towel under the toes, 3 s up / 2 s hold / 3 s down','Plantar loading — towel rolled under the toes, calf raise on a step: 3 s up, 2 s hold at the top, 3 s down','Single-leg plantar loading with a backpack, same tempo'),
});
const KA_FEET_AM={t:'Feet — before first steps',fmt:'2½ min in bed / sitting, before standing',b:[{h:'Do this before you put weight on them',lines:[['pfstretch','30 s each foot'],['toeyoga','10 each foot'],['shortfoot','10 each foot']]}],
 tm:()=>[...kSides('Plantar fascia stretch',30),...kSides('Toe yoga, 10',25),...kSides('Short foot, 10',25)]};
const KA_FEET_LOAD={t:'Feet — plantar loading',fmt:'3 × 12 slow, every other day · ball roll',b:[{h:'High-load, slow — 3 sets of 12',lines:[['pfraise','12 towel-under-toes calf raises, 3 s up / 2 s hold / 3 s down']]},{h:'Then',lines:[['ballroll','60 s each arch']]}],
 tm:()=>[...kRep('12 plantar loading raises, slow',70,30),...kRep('12 plantar loading raises, slow',70,30),...kRep('12 plantar loading raises, slow',70,20),...kSides('Ball roll',60)]};
const KA_FEET_RULES=['Morning routine every day, before standing: the first steps are when the fascia is stiffest and tears a little — stretch it first.','Plantar loading every other day, slow and heavy. It is uncomfortable in the arch during; that is fine. Next-morning heel pain going up is not.','Shoes with some arch support and a firm heel for a while; barefoot on hard floors makes it worse. Minimalist shoes later, not now.','Heel pain that is there at rest, swells, or comes with other joint symptoms: tell a provider rather than rolling it harder.'];
