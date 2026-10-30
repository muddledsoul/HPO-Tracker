// Mobility program modeled on the Supple Leopard system: 13 body areas, upstream/downstream thinking,
// 2 minutes minimum per position, 10-15 minutes a day, always test / retest.
// Descriptions below are written for this app, not copied from the book.
const L_METHODS={
 pw:['Pressure wave','Slowly roll the tool across the tissue in small increments; when you find a tender spot, sit on it and breathe until it changes.'],
 cr:['Contract / relax','In the stretched position, tense the target muscle hard for 5 seconds, then relax and sink deeper for 10. Repeat for the full time.'],
 bf:['Banded flossing','With the band pulling the joint into a better position, move through full range repeatedly — the band does the work on the joint capsule.'],
 sf:['Smash and floss','Pin the tissue with the tool, then move the limb through its range while keeping the pressure on, so the layers slide against each other.'],
 vf:['Voodoo floss','Wrap the joint tightly with a compression band (toward the heart), move through full range for 1-2 min, unwrap. Never leave it on past 2 min or if anything goes numb.'],
 fg:['Flexion gapping','Band or roller in the crease of the joint; sink into flexion so the joint gaps open behind the obstruction.'],
 os:['Oscillation','Small, fast back-and-forth movements on the tender spot — paperclipping the tissue until it quiets down.'],
};
// areas: id, name, where, mobilizations: {n,tool,dose,m:[method keys],how}
const L_AREAS=[
 {id:1,name:'Thoracic spine',where:'upper back · neck · scapula',mobs:[
  {n:'Double-ball T-spine smash',tool:'2 lacrosse balls (taped)',dose:'2 min per segment, 3-4 segments',m:['pw','cr'],how:'Balls either side of the spine, start just below the shoulder blades. Lie back, arms crossed, hips up. Extend over the balls, then crunch; work up one vertebra at a time. Reach overhead on tight segments.'},
  {n:'T-spine extension over roller',tool:'Foam roller',dose:'2 min',m:['pw'],how:'Roller across the mid-back, hands behind head, hips on the floor. Extend back over the roller and breathe out; move the roller up a notch and repeat.'},
  {n:'First rib / upper trap smash',tool:'Lacrosse ball',dose:'2 min each side',m:['sf','cr'],how:'Ball on the top of the shoulder where the neck meets the trap, pressed against a wall or doorframe. Drop the head away, then rotate it side to side while keeping pressure.'},
  {n:'Overhead rib mobilization',tool:'Lacrosse ball',dose:'2 min each side',m:['sf'],how:'Lie on the ball just inside the shoulder blade. Reach the arm overhead and back down slowly, then across the body.'},
  {n:'Neck / suboccipital release',tool:'Lacrosse ball or peanut',dose:'2 min',m:['pw','os'],how:'Lie on your back with the ball at the base of the skull. Nod yes and no slowly, letting the head weight sink in.'},
 ]},
 {id:2,name:'Posterior shoulder',where:'lat · rear delt · rotator cuff',mobs:[
  {n:'Overhead banded distraction',tool:'Monster band',dose:'2 min each side',m:['bf','cr'],how:'Band high on a rig, loop around the wrist. Step away until it pulls the arm overhead and back. Rotate the palm up, push the hips back, and move the shoulder in and out of the stretch.'},
  {n:'Lat / posterior shoulder smash',tool:'Lacrosse ball or barbell',dose:'2 min each side',m:['sf','pw'],how:'Lie on your side with the ball under the armpit on the lat. Roll slowly toward the back of the shoulder; stop on hot spots and move the arm overhead and down.'},
  {n:'Side-lying external rotation floss',tool:'Monster band',dose:'2 min each side',m:['bf'],how:'Band around the upper arm pulling it toward the floor while you lie on that side. Rotate the forearm toward the ceiling and back, keeping the elbow pinned.'},
  {n:'Rear delt / infraspinatus smash',tool:'Lacrosse ball',dose:'2 min each side',m:['sf','os'],how:'Ball against the wall just below the back of the shoulder. Lean in, then swing the arm across the body and overhead.'},
 ]},
 {id:3,name:'Anterior shoulder',where:'pec · front delt',mobs:[
  {n:'Anterior shoulder band opener',tool:'Monster band',dose:'2 min each side',m:['bf','cr'],how:'Band at shoulder height behind you, around the wrist, arm straight back. Step forward, turn away from the band, and tense into it for 5 sec then relax.'},
  {n:'Pec minor smash',tool:'Lacrosse ball',dose:'2 min each side',m:['pw','sf'],how:'Ball just below the collarbone near the shoulder, pinned against a doorframe. Reach the arm overhead and behind while leaning in.'},
  {n:'Floor pec smash with arm sweep',tool:'Lacrosse ball',dose:'2 min each side',m:['sf'],how:'Face down, ball on the pec. Sweep the arm from overhead to the hip like a slow snow angel.'},
  {n:'Internal rotation banded floss',tool:'Monster band',dose:'2 min each side',m:['bf'],how:'Band pulling the shoulder forward and down from behind. Hand behind the back, work it up the spine.'},
 ]},
 {id:4,name:'Downstream arm',where:'triceps · elbow · forearm · wrist',mobs:[
  {n:'Triceps smash',tool:'Barbell or lacrosse ball',dose:'2 min each side',m:['sf','pw'],how:'Back of the upper arm on the bar or ball, elbow bent. Straighten and bend the elbow slowly, then rotate the forearm.'},
  {n:'Elbow voodoo floss',tool:'Voodoo band',dose:'1-2 min each side',m:['vf'],how:'Wrap from below the elbow to above it with firm stretch. Do push ups, bar hangs, or bend and straighten through full range, then unwrap.'},
  {n:'Forearm smash',tool:'Lacrosse ball or barbell',dose:'2 min each side',m:['sf'],how:'Forearm on the bar, top side then underside. Open and close the fist and flex the wrist while rolling.'},
  {n:'Banded wrist distraction',tool:'Light band',dose:'2 min each side',m:['bf'],how:'Band around the wrist pulling it away from the body. Press the palm flat on a box and rock forward and back, then flip to the back of the hand.'},
  {n:'Elbow banded distraction',tool:'Monster band',dose:'2 min each side',m:['bf','cr'],how:'Band around the forearm just below the elbow, anchored low. Pull straight away and extend the elbow fully; hold, relax, repeat.'},
 ]},
 {id:5,name:'Trunk',where:'psoas · low back · obliques',mobs:[
  {n:'Psoas smash',tool:'Lacrosse ball + kettlebell',dose:'2 min each side',m:['pw','cr'],how:'Face down, ball just inside the hip bone on the belly, KB handle resting on the ball for weight. Breathe out and sink; bend the knee and swing the lower leg side to side.'},
  {n:'Low back / QL smash',tool:'Lacrosse ball',dose:'2 min each side',m:['pw','sf'],how:'Ball between the bottom rib and the hip, on the side of the low back. Roll slowly, then flex and extend the knee on that side.'},
  {n:'Oblique smash',tool:'Foam roller or ball',dose:'2 min each side',m:['pw'],how:'Lie on your side over the roller between ribs and hip. Reach overhead and breathe.'},
  {n:'Global extension over roller',tool:'Foam roller',dose:'2 min',m:['cr'],how:'Roller under the mid-back, arms overhead, brace the belly, extend back without flaring the ribs.'},
  {n:'Gut smash',tool:'Medicine ball or large ball',dose:'3-4 min',m:['pw','cr'],how:'Lie face down on the ball below the ribs. Breathe into it, roll around slowly, pause on anything tender.'},
 ]},
 {id:6,name:'Posterior high chain',where:'glutes · hip capsule',mobs:[
  {n:'Glute smash',tool:'Lacrosse ball',dose:'2 min each side',m:['sf','pw'],how:'Sit on the ball under one glute, foot crossed over the other knee. Roll across the whole glute; rock the knee side to side.'},
  {n:'Hip capsule distraction (posterior)',tool:'Monster band',dose:'2 min each side',m:['bf'],how:'Band high on the thigh pulling sideways and back, in a lunge or on all fours. Drive the knee out and oscillate.'},
  {n:'Banded pigeon / figure-4',tool:'Monster band',dose:'2 min each side',m:['bf','cr'],how:'Band around the front of the hip pulling it back, front leg bent across in pigeon. Keep the hips square and lean forward.'},
  {n:'Hamstring-glute junction smash',tool:'Lacrosse ball or box edge',dose:'2 min each side',m:['sf'],how:'Sit on the ball at the crease where glute meets hamstring. Straighten and bend the knee.'},
 ]},
 {id:7,name:'Anterior high chain',where:'hip flexor · quads',mobs:[
  {n:'Couch stretch',tool:'Wall or box',dose:'2 min each side, minimum',m:['cr'],how:'Back knee in the corner of wall and floor, shin up the wall, other foot forward. Squeeze the glute and drive the hip forward; work toward an upright torso. Tense, relax, sink.'},
  {n:'Quad smash',tool:'Foam roller or barbell',dose:'2 min each side',m:['pw','sf'],how:'Face down, thigh on the roller. Work from above the knee to the hip; bend and straighten the knee on tender spots.'},
  {n:'Banded hip extension',tool:'Monster band',dose:'2 min each side',m:['bf','cr'],how:'Band around the top of the back thigh pulling forward, in a half-kneeling lunge. Squeeze the glute, drive forward, keep ribs down.'},
  {n:'Anterior hip capsule distraction',tool:'Monster band',dose:'2 min each side',m:['bf'],how:'Band around the front of the hip pulling back, in a lunge. Sway forward and back, then rotate the hip in and out.'},
 ]},
 {id:8,name:'Medial chain',where:'adductors · groin',mobs:[
  {n:'Adductor smash',tool:'Foam roller or barbell',dose:'2 min each side',m:['pw','sf'],how:'Face down, leg out to the side with the inner thigh on the roller. Roll from knee to groin; flex and extend the knee.'},
  {n:'Banded adductor floss',tool:'Monster band',dose:'2 min each side',m:['bf'],how:'Band high on the thigh pulling the leg away, kneel with that leg out to the side. Rock back and forth.'},
  {n:'Squat with band distraction',tool:'Monster band',dose:'2 min',m:['bf','cr'],how:'Band around the hips pulling back, sit into a deep squat, drive the knees out, shift side to side.'},
  {n:'Frog / groin stretch',tool:'None',dose:'2 min',m:['cr'],how:'On all fours, knees wide, feet turned out. Sit back toward the heels; tense the groin, relax, go further.'},
 ]},
 {id:9,name:'Posterior chain',where:'hamstrings',mobs:[
  {n:'Hamstring smash on box edge',tool:'Box or bench edge',dose:'2 min each side',m:['sf','pw'],how:'Sit with the hamstring on the edge of a box, ball under it. Straighten and bend the knee, shifting the ball across the muscle.'},
  {n:'Banded hamstring floss',tool:'Monster band',dose:'2 min each side',m:['bf'],how:'Band around the hip crease pulling back, hinge forward over a straight leg with a flat back. Oscillate up and down.'},
  {n:'Barbell hamstring smash',tool:'Barbell',dose:'2 min each side',m:['sf'],how:'Thigh on the bar across a rack, lean weight in, flex and extend the knee.'},
  {n:'Hamstring contract / relax',tool:'Band or strap',dose:'2 min each side',m:['cr'],how:'On your back, leg up with a band around the foot. Push into the band 5 sec, relax and pull the leg closer for 10.'},
 ]},
 {id:10,name:'Knee',where:'patella · joint',mobs:[
  {n:'Suprapatellar smash',tool:'Lacrosse ball',dose:'2 min each side',m:['sf','pw'],how:'Face down with the ball just above the kneecap. Bend and straighten the knee, then work the ball around the top of the patella.'},
  {n:'Knee voodoo floss',tool:'Voodoo band',dose:'1-2 min each side',m:['vf'],how:'Wrap from below the knee to above it. Squat, lunge, and flex fully, then unwrap.'},
  {n:'Flexion gapping',tool:'Foam roller or band',dose:'2 min each side',m:['fg','cr'],how:'Roller or rolled towel in the crease behind the knee. Sit back onto the heel so the joint gaps open; pulse.'},
  {n:'Banded knee distraction',tool:'Monster band',dose:'2 min each side',m:['bf'],how:'Band just below the knee pulling back, in a lunge or squat position. Drive the knee forward over the toes.'},
 ]},
 {id:11,name:'Medial / anterior shin',where:'tibialis · shin splints',mobs:[
  {n:'Anterior shin smash',tool:'Lacrosse ball or roller',dose:'2 min each side',m:['sf','pw'],how:'Kneel with the ball under the outside of the shin. Point and flex the foot while rolling along the muscle.'},
  {n:'Medial shin smash',tool:'Barbell or roller',dose:'2 min each side',m:['pw'],how:'Inner edge of the shin on the bar, roll slowly from ankle to knee.'},
  {n:'Shin voodoo floss',tool:'Voodoo band',dose:'1-2 min each side',m:['vf'],how:'Wrap the lower shin, then walk, squat, and pump the ankle.'},
 ]},
 {id:12,name:'Calf',where:'gastroc · soleus · Achilles',mobs:[
  {n:'Calf smash on bar or roller',tool:'Barbell or roller',dose:'2 min each side',m:['sf','pw'],how:'Calf on the bar, other leg on top for weight. Point and flex the foot, rotate the ankle; work deep into the soleus near the Achilles.'},
  {n:'Banded ankle dorsiflexion',tool:'Monster band',dose:'2 min each side',m:['bf'],how:'Band around the front of the ankle pulling back, foot on a box. Drive the knee forward over the toes, heel down.'},
  {n:'Heel cord voodoo floss',tool:'Voodoo band',dose:'1-2 min each side',m:['vf'],how:'Wrap the lower calf and Achilles, then squat, calf raise, and pump the ankle.'},
  {n:'Calf contract / relax on a step',tool:'Step',dose:'2 min each side',m:['cr'],how:'Heel off the edge of a step, drop into the stretch. Push up for 5 sec, relax and sink for 10.'},
 ]},
 {id:13,name:'Ankle / plantar surface',where:'ankle · foot · heel',mobs:[
  {n:'Plantar smash',tool:'Lacrosse ball',dose:'2 min each side',m:['pw','os'],how:'Standing, ball under the arch. Slow pressure waves heel to toes; curl and spread the toes on hot spots.'},
  {n:'Ankle distraction (anterior)',tool:'Monster band',dose:'2 min each side',m:['bf'],how:'Band around the front of the ankle pulling forward, kneeling with the foot flat. Rock the knee forward and side to side.'},
  {n:'Heel / Achilles insertion smash',tool:'Lacrosse ball',dose:'2 min each side',m:['sf'],how:'Ball on the sides of the Achilles near the heel; pinch and move the foot.'},
  {n:'Ankle voodoo floss',tool:'Voodoo band',dose:'1-2 min each side',m:['vf'],how:'Wrap the ankle, then squat, lunge, and circle the foot.'},
 ]},
];
// What hurts → areas to work (first = where it hurts; then upstream / downstream). Also a note.
const L_PAIN=[
 {n:'Neck',areas:[1,2,3],note:'Neck pain is usually a stiff thoracic spine and shoulders that have pulled the head forward. Work the upper back first.'},
 {n:'Upper back',areas:[1,2],note:'Mobilize the T-spine, then the lats that pull on it.'},
 {n:'Front of shoulder',areas:[3,1,2,4],note:'Front-of-shoulder pain is almost always a shoulder that sits forward: open the pec, fix the upper back, then the posterior capsule.'},
 {n:'Back of shoulder',areas:[2,1,3],note:'Posterior shoulder and lat first; a tight T-spine keeps it from getting better.'},
 {n:'Elbow',areas:[4,3,2],note:'Elbow pain lives in the triceps, forearm, and a shoulder that is not stable. Smash above and below the joint, then floss it.'},
 {n:'Wrist / forearm',areas:[4,3],note:'Forearm smash and wrist distraction, then check the shoulder position that is loading it.'},
 {n:'Low back',areas:[5,7,6,9],note:'Fix the hips first: tight hip flexors and glutes make the low back do the work. Then psoas and QL.'},
 {n:'Hip',areas:[6,7,8],note:'Hip capsule distractions plus glute, hip flexor, and adductor smashing.'},
 {n:'Groin',areas:[8,7,6],note:'Adductors first, then the hip flexors and capsule.'},
 {n:'Hamstring',areas:[9,6,12],note:'Hamstring and the glute-hamstring junction; stiff calves pull on it from below.'},
 {n:'Knee',areas:[10,7,9,12,13],note:'Knees rarely cause their own pain. Work the quad and hamstring above, the calf and ankle below, then the knee itself.'},
 {n:'Shin',areas:[11,12,13],note:'Shin smash plus calf and ankle range — missing dorsiflexion is the usual cause.'},
 {n:'Calf / Achilles',areas:[12,13,11],note:'Calf and heel cord smash with flossing, then restore ankle dorsiflexion.'},
 {n:'Ankle',areas:[13,12,11],note:'Distraction for the joint, then the calf that restricts it.'},
 {n:'Foot / plantar',areas:[13,12],note:'Plantar smash and the calf; the heel cord usually drives plantar pain.'},
];
const L_RULES=['Test first: find a position or movement that is restricted or hurts. Mobilize. Retest. If it did not change, pick a different mobilization.','2 minutes minimum per position — less does nothing.','10-15 minutes a day, every day, beats an hour once a week.','Work upstream and downstream of where it hurts, not only the spot.','Mobilize in the position you are trying to change.','Pain that is sharp, numb, or shooting is not a mobility problem — see a professional.'];
