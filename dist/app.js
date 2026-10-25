import {levels} from './content.js';
import {World} from './world.js';
import {createState,readState,writeState,sanitizeState,unlockedIndex,completeTrial,finishLevel,STORAGE_KEY} from './state.js';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let storage;try{storage=window.localStorage;}catch{}
let {state,available}=readState(storage);
let timer=null,toastTimer=null,nearIndex=null,activeTrial=null;
const dialog=$('#dialog');
const world=new World($('#world'),{onInteract:index=>openTrial(index),onNear:index=>{nearIndex=index;const btn=$('#nearBtn');btn.hidden=index===null;if(index!==null)btn.textContent=`Explore · ${levels[state.current].trials[index].title}`;}});
world.setMotion(state.settings.motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches);
function save(){available=writeState(storage,state);$('#saveStatus').textContent=available?'Progress saved in this browser':'Storage unavailable · export to keep progress';}
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3500);}
function chapter(){return state.chapters[state.current];}
function render(resetWorld=false){
 const level=levels[state.current],c=chapter(),done=state.chapters.filter(x=>x.finished).length;
 $('#progressText').textContent=`${done} / 10`;$('#progressFill').style.width=`${done*10}%`;
 $('#levelList').innerHTML=levels.map((l,i)=>`${i===7?'<div class="chapter-divider">BEYOND THE FOUNDATIONS</div>':''}<button class="level-button ${i===state.current?'active':''} ${state.chapters[i].finished?'complete':''} ${i>unlockedIndex(state)?'locked':''}" data-level="${i}" aria-label="Chapter ${i+1}: ${esc(l.name)}${i>unlockedIndex(state)?', locked':''}" ${i===state.current?'aria-current="step"':''}><span class="level-number">${state.chapters[i].finished?'✓':String(i+1).padStart(2,'0')}</span><span class="level-label">${esc(l.name)}<small>${i===state.current?'You are here':state.chapters[i].finished?'Island illuminated':l.extension?'Original extension':l.skill}</small></span></button>`).join('');
 $('#chapterEyebrow').textContent=`CHAPTER ${String(state.current+1).padStart(2,'0')} · ${level.extension?'BEYOND THE FOUNDATIONS':'THE FOUNDATIONS'}`;
 $('#chapterTitle').textContent=level.name;$('#chapterSubtitle').textContent=level.subtitle;$('#chapterSkill').textContent=level.skill;$('#biomeLabel').textContent=level.biome.toUpperCase();
 $('#questProgress').textContent=`${c.trials.length} OF 3 WAYPOINTS`;
 $('#questHeading').textContent=c.finished?'A light to take with you.':c.trials.length===3?'Your beacon is ready.':state.started?'Follow your curiosity.':'A spark is waiting.';
 $('#questDescription').textContent=c.trials.length===3?'Bring these ideas together and choose one small step for life beyond the island.':'Explore three waypoints. Make room for a new perspective, one small discovery at a time.';
 $('#startBtn').innerHTML=`${c.finished?(state.current<9?'Journey onward':'Visit your field journal'):c.trials.length===3?'Light the beacon':state.started?'Meet your guide':'Begin your journey'} <span aria-hidden="true">↗</span>`;
 const icons=['◇','⌁','✧'];
 $('#questList').innerHTML=level.trials.map((t,i)=>`<button class="quest-card ${c.trials.includes(i)?'done':''}" data-trial="${i}"><span class="quest-icon" aria-hidden="true">${c.trials.includes(i)?'✓':icons[i]}</span><span><h3>${esc(t.title)}</h3><p>${c.trials.includes(i)?(c.guided.includes(i)?'Explored with guidance':'Waypoint explored'):`WAYPOINT 0${i+1} · ${t.type==='sort'?'SORT & DISCOVER':t.type==='sequence'?'BUILD A PATH':t.type==='breathe'?'PAUSE & NOTICE':'EXPLORE & CHOOSE'}`}</p></span><span class="arrow" aria-hidden="true">↗</span></button>`).join('');
 if(resetWorld)world.setLevel(state.current,c.trials);else world.setCompleted(c.trials);
 $('#saveStatus').textContent=available?'Progress stays in this browser':'Storage unavailable · export to keep progress';
}
function openDialog(title,html,eyebrow='BEACON ISLES'){
 clearInterval(timer);timer=null;$('#dialogEyebrow').textContent=eyebrow;$('#dialogBody').innerHTML=`<h2 id="dialogTitle" tabindex="-1">${esc(title)}</h2>${html}`;
 if(!dialog.open)dialog.showModal();world.setPaused(true);$('#dialogTitle').focus();
}
function closeDialog(){clearInterval(timer);timer=null;activeTrial=null;dialog.close();world.setPaused(false);}
$('#closeDialog').onclick=closeDialog;
dialog.addEventListener('cancel',()=>{clearInterval(timer);timer=null;activeTrial=null;world.setPaused(false);});
function changeLevel(index){
 if(index>unlockedIndex(state)){toast('Light the previous island’s beacon to continue.');return;}
 state.current=index;save();render(true);$('#chapterTitle').focus();
}
$('#levelList').onclick=e=>{const b=e.target.closest('[data-level]');if(b)changeLevel(Number(b.dataset.level));};
$('#questList').onclick=e=>{const b=e.target.closest('[data-trial]');if(b)openTrial(Number(b.dataset.trial));};
$('#nearBtn').onclick=()=>{if(nearIndex!==null)openTrial(nearIndex);};
$('#startBtn').onclick=()=>{if(chapter().finished){if(state.current<9)changeLevel(state.current+1);else openJournal();}else if(chapter().trials.length===3)openReflection();else openIntro();};
function openIntro(){
 const l=levels[state.current];
 openDialog(`Welcome to ${l.name}`,`<p class="lead">${esc(l.intro)}</p><div class="callout">${esc(l.lesson)}</div><p>Explore the island, or use the three waypoint cards below it. There is no time limit, and you can try again as often as you like.</p>${!state.started?'<p class="muted">An independent educational adventure inspired by published SPARX research. This new game has not been clinically evaluated and is not a treatment or psychological assessment. Your progress measures this adventure only.</p>':''}<div class="dialog-actions"><button class="secondary" id="introHelp">How to play</button><button class="primary" id="introGo">Let’s explore <span aria-hidden="true">→</span></button></div>`,`YOUR GUIDE · CHAPTER ${state.current+1}`);
 $('#introGo').onclick=()=>{state.started=true;save();closeDialog();render();$('#world').focus();};$('#introHelp').onclick=openHelp;
}
function openTrial(index){
 if(!Number.isInteger(index)||index<0||index>2)return;
 state.started=true;save();
 const t=levels[state.current].trials[index];
 activeTrial={index,guided:false,solved:false,selected:null,answers:{},order:t.steps?shuffledOrder(t.steps.length):[]};
 drawTrial(t);
}
function shuffledOrder(n){const a=Array.from({length:n},(_,i)=>i);for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}if(a.every((x,i)=>x===i))a.push(a.shift());return a;}
function drawTrial(t){
 const a=activeTrial;
 let content=`<p class="lead">${esc(t.prompt)}</p><div id="activity">`;
 if(t.type==='choice'||t.type==='plan')content+=`<div class="choice-list">${t.options.map((o,i)=>`<button class="choice" data-option="${i}"><span>${String.fromCharCode(65+i)}</span>${esc(o.text)}</button>`).join('')}</div>`;
 if(t.type==='sort')content+=t.items.map((item,i)=>`<div class="sort-item"><p>${esc(item.text)}</p><div class="sort-options" role="group" aria-label="Categorise statement ${i+1}">${t.categories.map((cat,j)=>`<button data-item="${i}" data-category="${j}" aria-pressed="false">${esc(cat)}</button>`).join('')}</div><p class="sort-explanation" id="sortExplain${i}" hidden></p></div>`).join('');
 if(t.type==='sequence')content+='<p class="muted">Use the arrow buttons to place these steps in a useful order.</p><ol class="sequence-list" id="sequenceList"></ol>';
 if(t.type==='breathe')content+='<div class="breath-space"><div class="breath-orb" id="breathOrb">Ready<small>A comfortable pace</small></div></div><p class="muted">Breathe normally and gently; no deep breaths or holds. Stop if uncomfortable. You can choose the observation activity instead, with exactly the same progress.</p>';
 content+='</div><div id="feedback" class="feedback" role="status" hidden></div><div class="dialog-actions"><button class="hint-btn" id="hintBtn">A little guidance ↗</button><button class="primary" id="checkBtn">'+(t.type==='breathe'?'Begin gentle pacing':t.type==='choice'||t.type==='plan'?'Choose a response':'Try this arrangement')+'</button></div>';
 if(t.type==='breathe')content+='<button class="hint-btn" id="alternativeBtn">I’d rather notice my surroundings</button>';
 openDialog(t.title,content,`CHAPTER ${state.current+1} · WAYPOINT ${a.index+1} OF 3`);
 $('#hintBtn').onclick=()=>{a.guided=true;feedback(t.hint||'Take your time. Look for what is observable, realistic and within your control.');};
 if(t.type==='choice'||t.type==='plan'){
 $('#checkBtn').disabled=true;
 $('#activity').onclick=e=>{const b=e.target.closest('[data-option]');if(!b||a.solved)return;a.selected=Number(b.dataset.option);document.querySelectorAll('[data-option]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b));});$('#checkBtn').disabled=false;$('#checkBtn').textContent='Explore this response';};
 }
 if(t.type==='sort')$('#activity').onclick=e=>{const b=e.target.closest('[data-item]');if(!b||a.solved)return;a.answers[b.dataset.item]=Number(b.dataset.category);b.parentElement.querySelectorAll('button').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b));});};
 if(t.type==='sequence')renderSequence(t);
 $('#checkBtn').onclick=()=>{
 if(a.solved){closeDialog();render();if(chapter().trials.length===3&&!chapter().finished)openReflection();return;}
 if(t.type==='choice'||t.type==='plan'){
 const o=t.options[a.selected];if(!o)return;
 if(o.correct){document.querySelector(`[data-option="${a.selected}"]`).classList.add('correct');solve(t,o.feedback);}else{a.guided=true;feedback(o.feedback);$('#checkBtn').disabled=true;$('#checkBtn').textContent='Try another perspective';}
 }else if(t.type==='sort'){
 if(Object.keys(a.answers).length<t.items.length){feedback('Choose a category for each statement. There is no hurry.');return;}
 const correct=t.items.every((x,i)=>x.category===a.answers[i]);
 t.items.forEach((x,i)=>{const el=$(`#sortExplain${i}`);el.hidden=false;el.textContent=(x.category===a.answers[i]?'✓ ':'Look again: ')+x.explanation;});
 if(correct)solve(t,'You separated the ideas carefully. Those distinctions give you more choices.');else{a.guided=true;feedback('Some ideas need another look. Use the explanations to revise your choices.');}
 }else if(t.type==='sequence'){
 if(a.order.every((x,i)=>x===i))solve(t,t.explanation||'You have a workable path. Try it, then revise it with what you learn.');else{a.guided=true;feedback(t.hint||'First understand the situation, then choose an action, then review what happened.');}
 }else if(t.type==='breathe')startBreathing(t);
 };
 if(t.type==='breathe')$('#alternativeBtn').onclick=()=>startObservation(t);
}
function renderSequence(t){
 const a=activeTrial;$('#sequenceList').innerHTML=a.order.map((v,i)=>`<li><span class="step-number">0${i+1}</span><span class="step-text">${esc(t.steps[v])}</span><span class="reorder-buttons"><button data-up="${i}" aria-label="Move step ${i+1} up" ${i===0?'disabled':''}>↑</button><button data-down="${i}" aria-label="Move step ${i+1} down" ${i===a.order.length-1?'disabled':''}>↓</button></span></li>`).join('');
 $('#sequenceList').onclick=e=>{if(a.solved)return;const b=e.target.closest('[data-up],[data-down]');if(!b)return;const up=b.dataset.up!==undefined,i=Number(up?b.dataset.up:b.dataset.down),j=i+(up?-1:1);if(j<0||j>=a.order.length)return;[a.order[i],a.order[j]]=[a.order[j],a.order[i]];renderSequence(t);const preferred=$(`#sequenceList [data-${up?'up':'down'}="${j}"]`);(preferred?.disabled?$(`#sequenceList [data-${up?'down':'up'}="${j}"]`):preferred)?.focus();};
}
function feedback(message,good=false){const f=$('#feedback');f.hidden=false;f.textContent=message;f.classList.toggle('good',good);}
function solve(t,message){
 const a=activeTrial;a.solved=true;clearInterval(timer);timer=null;
 completeTrial(state,state.current,a.index,a.guided);save();render();feedback(message||t.explanation||'A small step, thoughtfully taken.',true);
 $('#hintBtn').hidden=true;$('#alternativeBtn')?.setAttribute('hidden','');$('#checkBtn').disabled=false;$('#checkBtn').textContent='Collect this spark →';
 document.querySelectorAll('#activity button').forEach(b=>b.disabled=true);
}
function startBreathing(t){
 const a=activeTrial;let elapsed=0;
 $('#checkBtn').disabled=true;$('#hintBtn').hidden=true;
 function tick(){
 if(activeTrial!==a)return;
 const phase=elapsed%10;
 $('#breathOrb').innerHTML=`${phase<4?'Breathe in':'Breathe out'}<small>${Math.floor(elapsed/10)+1} of 3 gentle cycles</small>`;
 $('#breathOrb').classList.toggle('expanded',phase<4&&state.settings.motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches);
 if(elapsed>=30){$('#breathOrb').innerHTML='A small pause<small>Notice how you feel</small>';$('#breathOrb').classList.remove('expanded');solve(t,t.explanation);return;}elapsed++;
 }
 tick();timer=setInterval(tick,1000);
}
function startObservation(t){
 clearInterval(timer);timer=null;$('#alternativeBtn').hidden=true;$('#hintBtn').hidden=true;
 $('#activity').innerHTML='<div class="callout">Rest your attention on one ordinary object nearby. Silently notice its colour, its shape, and one texture. There is nothing you need to feel or achieve.</div><p class="muted">This is an alternative attention exercise. Take as much or as little time as you want.</p>';
 $('#checkBtn').disabled=false;$('#checkBtn').textContent='I’ve taken a moment';$('#checkBtn').onclick=()=>{if(activeTrial.solved){closeDialog();render();if(chapter().trials.length===3&&!chapter().finished)openReflection();}else solve(t,'You practised choosing where to place your attention. You can use a brief pause without changing or judging your feelings.');};
}
function openReflection(){
 const l=levels[state.current];
 openDialog('Carry a little light with you.',`<div class="completion-seal" aria-hidden="true">✧</div><p class="lead">${esc(l.lesson)}</p><div class="callout">${esc(l.transfer)}</div><label for="planInput">One small step I could try (optional)</label><textarea id="planInput" maxlength="1000" placeholder="Keep it small, specific, and within your control.">${esc(chapter().plan)}</textarea><p class="muted">Saved only in this browser. You can leave this blank. Chapter completion records the activities you explored, not mental health improvement or proven real-world competence.</p><div class="dialog-actions"><button class="secondary" id="reflectLater">Keep exploring</button><button class="primary" id="lightBeacon">Light this beacon ✧</button></div>`,`CHAPTER ${state.current+1} · A MOMENT TO REFLECT`);
 $('#reflectLater').onclick=closeDialog;$('#lightBeacon').onclick=()=>{finishLevel(state,state.current,$('#planInput').value);save();render();showChapterComplete();};
}
function showChapterComplete(){
 const last=state.current===9;
 openDialog(last?'Ten islands. New beginnings.':'An island illuminated.',`<div class="completion-seal" aria-hidden="true">✧</div><p class="lead center">${last?'You have explored all ten chapters. The next part happens in everyday life, one small experiment at a time.':`${esc(levels[state.current].name)} now holds a light of its own.`}</p><p class="center">You can pause here, revisit a waypoint, or ${last?'return to your field journal':'discover the next island'}. There is no need to rush.</p><div class="dialog-actions"><button class="secondary" id="stayBtn">Stay a while</button><button class="primary" id="nextBtn">${last?'Open field journal':'Next island →'}</button></div>`,last?'JOURNEY COMPLETE':'BEACON RESTORED');
 $('#stayBtn').onclick=closeDialog;$('#nextBtn').onclick=()=>{closeDialog();if(last)openJournal();else changeLevel(state.current+1);};
}
function openJournal(){
 const entries=levels.map((l,i)=>({l,c:state.chapters[i],i})).filter(x=>x.c.trials.length);
 openDialog('Your field journal',`<p>Ideas gathered along the way. These pages belong to you.</p>${entries.length?entries.map(({l,c,i})=>`<article class="journal-entry"><span class="tag">CHAPTER ${String(i+1).padStart(2,'0')} · ${c.finished?'BEACON LIT':`${c.trials.length}/3 WAYPOINTS`}</span><h3>${esc(l.name)}</h3><p>${esc(l.lesson)}</p>${c.plan?`<p><strong>Your next step</strong><br>${esc(c.plan)}</p>`:''}<p class="muted">${c.guided.length} waypoint${c.guided.length===1?'':'s'} explored with guidance. Adventure progress is not a clinical or competence rating.</p><button class="hint-btn" data-revisit="${i}">Revisit this island ↗</button></article>`).join(''):'<div class="callout">Your first page is waiting. Explore a waypoint to add a new idea here.</div>'}<label for="journalNotes">Your own notes (optional)</label><textarea id="journalNotes" maxlength="10000" placeholder="Something you want to remember…">${esc(state.notes)}</textarea><p class="muted">Notes stay in this browser, are not encrypted, and can be read by someone using this browser profile. The game sends no notes or answers to a server. Export a copy before clearing browser data.</p><div class="dialog-actions"><button class="secondary" id="journalExport">Export my journey</button><button class="primary" id="saveNotes">Save notes</button></div>`,'COLLECTED PERSPECTIVES');
 $('#saveNotes').onclick=()=>{state.notes=$('#journalNotes').value;save();toast(available?'Your notes are saved.':'Notes are in memory only. Export to keep them.');};
 $('#journalExport').onclick=()=>{state.notes=$('#journalNotes').value;save();exportJourney();};
 document.querySelectorAll('[data-revisit]').forEach(b=>b.onclick=()=>{state.notes=$('#journalNotes').value;save();closeDialog();changeLevel(Number(b.dataset.revisit));});
}
function exportJourney(){
 const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='beacon-isles-journey.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Journey exported. Keep personal notes somewhere private.');
}
function openSettings(){
 openDialog('Make yourself comfortable.',`<div class="setting-row"><label for="motionSetting">Gentle ambient motion<small>Off by default. No flashing effects. Device reduced-motion settings take priority.</small></label><input type="checkbox" id="motionSetting" ${state.settings.motion?'checked':''}></div><p class="muted">The island remains still when motion is off. Your character can still move. All exercises can also be opened from the waypoint cards.</p><h3>Your progress, your choice</h3><p class="muted">Progress and optional notes stay on this browser profile. They do not automatically sync between devices. Export creates a file containing those notes.</p><div class="tool-row"><button id="exportBtn">Export journey</button><button id="importBtn">Import journey</button><button id="settingsAbout">Story & science</button><button class="danger" id="resetBtn">Reset progress</button></div><input type="file" id="importFile" accept="application/json,.json" hidden><p id="importStatus" role="status" class="muted"></p><div class="dialog-actions"><button class="primary" id="settingsDone">Back to the island</button></div>`,'SETTINGS & PRIVACY');
 $('#motionSetting').onchange=e=>{state.settings.motion=e.target.checked;world.setMotion(state.settings.motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches);save();};
 $('#settingsAbout').onclick=openAbout;$('#exportBtn').onclick=exportJourney;$('#importBtn').onclick=()=>$('#importFile').click();$('#importFile').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;const status=$('#importStatus'),input=e.target;try{if(file.size>100000)throw Error('This file is too large. Choose a Beacon Isles journey export.');const text=await file.text();if(!input.isConnected||!dialog.open)return;const raw=JSON.parse(text);if(raw.version!==1||!Array.isArray(raw.chapters)||raw.chapters.length!==10)throw Error('This is not a supported Beacon Isles export.');const incoming=sanitizeState(raw);openDialog('Replace this browser’s journey?',`<p>The imported file contains ${incoming.chapters.filter(x=>x.finished).length} completed chapters. Importing replaces current progress and notes. Export your current journey first if you want to keep both.</p><div class="dialog-actions"><button class="secondary" id="cancelImport">Cancel</button><button class="secondary" id="backupImport">Export current</button><button class="primary" id="confirmImport">Import journey</button></div>`,'IMPORT PROGRESS');$('#cancelImport').onclick=openSettings;$('#backupImport').onclick=exportJourney;$('#confirmImport').onclick=()=>{state=incoming;save();world.setMotion(state.settings.motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches);closeDialog();render(true);toast('Your journey is ready to continue.');};}catch(err){status.textContent=err.message;}};
 $('#resetBtn').onclick=()=>{openDialog('Start a fresh journey?',`<p>This clears progress and optional notes from this browser. Export a copy first if you want to keep them.</p><div class="dialog-actions"><button class="secondary" id="cancelReset">Keep my journey</button><button class="primary" id="confirmReset">Clear and start again</button></div>`,'RESET PROGRESS');$('#cancelReset').onclick=openSettings;$('#confirmReset').onclick=()=>{try{storage.removeItem(STORAGE_KEY);}catch{}state=createState();save();world.setMotion(false);closeDialog();render(true);toast('A fresh island is waiting.');};};$('#settingsDone').onclick=closeDialog;
}
function openAbout(){
 openDialog('A small world. A wider perspective.',`<p class="lead">Beacon Isles is an original Dream Unity adventure about noticing thoughts, making room for feelings, and choosing a useful next step.</p><p>The first seven chapters follow the skill progression described in published research on <a href="https://www.sparx.org.nz/" target="_blank" rel="noopener noreferrer">SPARX</a>, developed at the University of Auckland with Metia Interactive. Chapters eight to ten are our original extensions: assumptions, safe experiments, and transfer to unfamiliar situations.</p><div class="callout">Independent educational prototype. This is not the official SPARX programme, is not affiliated with its developers, and has not been clinically evaluated. Original SPARX clinical results do not establish that this game treats depression or improves real-world competence.</div><p>Research findings vary by population and delivery. A 2012 trial supported non-inferiority to usual care for help-seeking adolescents. A large 2025 school prevention trial found no benefit over its control group. Game completion is not a psychological score.</p><h3>Read the source research</h3><ul class="source-list"><li><a href="https://doi.org/10.1136/bmj.e2598" target="_blank" rel="noopener noreferrer">Merry et al. (2012) · Original trial and seven-level curriculum</a></li><li><a href="https://games.jmir.org/2015/1/e1/" target="_blank" rel="noopener noreferrer">Shepherd et al. (2015) · Participatory game design</a></li><li><a href="https://www.jmir.org/2025/1/e66047" target="_blank" rel="noopener noreferrer">Fleming et al. (2025) · National implementation and engagement</a></li><li><a href="https://doi.org/10.1136/bmjment-2024-301426" target="_blank" rel="noopener noreferrer">Werner-Seidler et al. (2025) · Future Proofing trial</a></li><li><a href="https://github.com/dream-unity/SPARX/blob/main/docs/RESEARCH.md" target="_blank" rel="noopener noreferrer">Full research notes, curriculum mapping and limitations ↗</a></li></ul><p class="muted">All game code, landscapes, dialogue and exercises here are newly created. SPARX and its original materials belong to their respective owners. This game contains no advertising or app analytics.</p><div class="dialog-actions"><button class="primary" id="aboutDone">Back to the adventure</button></div>`,'THE STORY & SCIENCE');$('#aboutDone').onclick=closeDialog;
}
function openHelp(){
 openDialog('Find your own way.',`<p>Walk to the three numbered waypoints on each island and explore their activities. Each one lights a spark. Complete all three, reflect, then light the island’s beacon to open the next chapter.</p><div class="controls-list"><strong>Move</strong><span>W A S D, arrow keys, or tap a spot on the island.</span><strong>Interact</strong><span>E or Space near a waypoint. You can also tap a waypoint directly.</span><strong>Touch controls</strong><span>Use the directional buttons on a smaller screen.</span><strong>Direct access</strong><span>The three cards below the island open the same activities without movement.</span><strong>Pause / close</strong><span>Use Take a pause, the close button, or Escape in a dialog.</span></div><p>Wrong answers cost nothing. Read the explanation, use a hint, and try a different perspective. You can leave an activity at any time. Completed waypoints save immediately.</p><p class="muted">Completion and guidance labels describe activity in this game only. Breathing is optional; an observation exercise gives the same progress.</p><div class="dialog-actions"><button class="primary" id="helpDone">Ready to explore →</button></div>`,'HOW TO PLAY');$('#helpDone').onclick=closeDialog;
}
function openPause(){
 openDialog('You can pause here.',`<p class="lead">Nothing needs to be solved right now.</p><p>Step away from the screen, look around, or get a drink of water. Your completed waypoints are saved when browser storage is available.</p><div class="callout">This game is an educational activity, not mental health care. If things feel difficult or persistent, consider talking with a trusted person or qualified health professional. If you are in immediate danger, contact your local emergency services.</div><p class="muted">There is no penalty for stopping. You can return when you want.</p><div class="dialog-actions"><button class="secondary" id="pauseExport">Export progress</button><button class="primary" id="resumeBtn">Return when ready →</button></div>`,'A MOMENT OF SPACE');$('#pauseExport').onclick=exportJourney;$('#resumeBtn').onclick=closeDialog;
}
$('#journalBtn').onclick=openJournal;$('#aboutBtn').onclick=openAbout;$('#settingsBtn').onclick=openSettings;$('#helpBtn').onclick=openHelp;$('#pauseBtn').onclick=openPause;$('#journeyBtn').onclick=()=>{$('#chapterTitle').focus();$('#chapterTitle').scrollIntoView({block:'start'});};
document.querySelectorAll('[data-move]').forEach(b=>b.onclick=()=>{world.move(...b.dataset.move.split(',').map(Number));});
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>world.setMotion(state.settings.motion&&!e.matches));
document.addEventListener('visibilitychange',()=>world.setPaused(document.hidden||dialog.open));
render(true);
