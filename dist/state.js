export const STORAGE_KEY = 'beacon-isles-v1';
export const LEVEL_COUNT = 10;
export function createState() {
  return {version:1,current:0,started:false,chapters:Array.from({length:LEVEL_COUNT},()=>({trials:[],guided:[],finished:false,plan:''})),notes:'',settings:{motion:false}};
}
export function unlockedIndex(state) {
  let n=0;
  while(n<LEVEL_COUNT-1 && state.chapters[n].finished) n++;
  return n;
}
export function sanitizeState(raw) {
  const state=createState();
  if(!raw || typeof raw!=='object' || raw.version!==1) return state;
  let priorFinished=true;
  for(let i=0;i<LEVEL_COUNT;i++) {
    const c=raw.chapters?.[i];
    if(!c || !priorFinished) break;
    const valid=a=>Array.isArray(a)?[...new Set(a.filter(x=>Number.isInteger(x)&&x>=0&&x<3))]:[];
    state.chapters[i]={trials:valid(c.trials),guided:valid(c.guided).filter(x=>valid(c.trials).includes(x)),finished:c.finished===true&&valid(c.trials).length===3,plan:typeof c.plan==='string'?c.plan.slice(0,1000):''};
    priorFinished=state.chapters[i].finished;
  }
  state.current=Number.isInteger(raw.current)?Math.max(0,Math.min(raw.current,unlockedIndex(state))):0;
  state.started=raw.started===true;
  state.notes=typeof raw.notes==='string'?raw.notes.slice(0,10000):'';
  state.settings.motion=raw.settings?.motion===true;
  return state;
}
export function completeTrial(state,level,trial,guided=false) {
  if(!Number.isInteger(level)||level<0||level>unlockedIndex(state)||!Number.isInteger(trial)||trial<0||trial>2) return false;
  const chapter=state.chapters[level];
  if(!chapter.trials.includes(trial)) {
    chapter.trials.push(trial);
    if(guided) chapter.guided.push(trial);
  }
  return true;
}
export function finishLevel(state,level,plan='') {
  if(level<0 || level>unlockedIndex(state)||!state.chapters[level]||state.chapters[level].trials.length!==3) return false;
  state.chapters[level].finished=true;
  state.chapters[level].plan=String(plan).slice(0,1000);
  return true;
}
export function readState(storage) {
  try {return {state:sanitizeState(JSON.parse(storage.getItem(STORAGE_KEY))),available:true};}
  catch {return {state:createState(),available:false};}
}
export function writeState(storage,state) {
  try {storage.setItem(STORAGE_KEY,JSON.stringify(state));return true;} catch {return false;}
}
