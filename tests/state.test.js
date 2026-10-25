import test from 'node:test';
import assert from 'node:assert/strict';
import {levels} from '../dist/content.js';
import {createState,sanitizeState,completeTrial,finishLevel,unlockedIndex,readState,writeState} from '../dist/state.js';

test('full ten-chapter journey unlocks only after every waypoint and reflection',()=>{
 const s=createState();
 for(let i=0;i<10;i++){
  assert.equal(unlockedIndex(s),i);
  assert.equal(finishLevel(s,i,'premature'),false);
  if(i<9)assert.equal(completeTrial(s,i+1,0),false);
  for(let j=0;j<3;j++)assert.equal(completeTrial(s,i,j,j===1),true);
  assert.equal(completeTrial(s,i,1),true);
  assert.equal(s.chapters[i].trials.length,3);
  assert.deepEqual(s.chapters[i].guided,[1]);
  assert.equal(finishLevel(s,i,'A small next step'),true);
 }
 assert.equal(s.chapters.filter(c=>c.finished).length,10);
 assert.deepEqual(sanitizeState(s).chapters,s.chapters);
});
test('part-completed journey resumes without granting later chapters',()=>{
 const s=createState();completeTrial(s,0,2);s.current=9;
 const restored=sanitizeState(JSON.parse(JSON.stringify(s)));
 assert.equal(restored.current,0);assert.deepEqual(restored.chapters[0].trials,[2]);
 assert.equal(restored.chapters[0].finished,false);
});
test('corrupt, future-version and hostile imports are bounded and cannot unlock by flag alone',()=>{
 for(const raw of [null,[],42,'x',{version:99}])assert.deepEqual(sanitizeState(raw),createState());
 const raw=createState();raw.chapters[0]={trials:[0,0,-1,3,'1',1],guided:[1,2,9],finished:true,plan:'x'.repeat(5000)};
 raw.chapters[9]={trials:[0,1,2],finished:true};raw.current=9;raw.notes='x'.repeat(11000);
 const safe=sanitizeState(raw);
 assert.deepEqual(safe.chapters[0].trials,[0,1]);assert.deepEqual(safe.chapters[0].guided,[1]);
 assert.equal(safe.chapters[0].finished,false);assert.equal(safe.chapters[9].finished,false);
 assert.equal(safe.current,0);assert.equal(safe.notes.length,10000);assert.equal(safe.chapters[0].plan.length,1000);
});
test('storage refusal and malformed JSON do not crash the game',()=>{
 const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('quota');}};
 assert.equal(readState(blocked).available,false);assert.equal(writeState(blocked,createState()),false);
 assert.deepEqual(readState({getItem:()=>'{broken'}).state,createState());
 let saved;const memory={getItem:()=>saved??null,setItem:(k,v)=>{saved=v;}};
 const s=createState();completeTrial(s,0,0,true);writeState(memory,s);assert.deepEqual(readState(memory).state,s);
});
test('all content has a reachable solution and clear source boundaries',()=>{
 assert.equal(levels.length,10);
 for(const [i,l] of levels.entries()){
  assert.equal(l.id,i+1);assert.equal(l.extension,i>=7);assert.equal(l.trials.length,3);
  assert.ok(l.intro&&l.lesson&&l.transfer);
  for(const t of l.trials){
   assert.ok(['choice','plan','sort','sequence','breathe'].includes(t.type));assert.ok(t.title&&t.prompt&&t.hint);
   if(t.options){assert.equal(t.options.filter(o=>o.correct).length,1);assert.ok(t.options.every(o=>o.feedback&&o.text));}
   if(t.items){assert.ok(t.items.length);assert.ok(t.items.every(x=>Number.isInteger(x.category)&&x.category>=0&&x.category<t.categories.length&&x.explanation));}
   if(t.steps){assert.ok(t.steps.length>=3);assert.equal(new Set(t.steps).size,t.steps.length);}
  }
 }
});
