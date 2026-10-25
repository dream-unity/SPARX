/* Beacon Isles — original, dependency-free isometric scenery and navigation.
 * All artwork in this file is generated from geometric primitives. */

const PALETTES = [
  { sky: '#132e2c', mist: '#3c6460', top: '#56785d', light: '#78906a', edge: '#314d42', rock: '#243d38', leaf: '#2f5e46', leafLight: '#5b8560', water: '#3c817f', accent: '#e4c781', flower: '#f0ce8c' },
  { sky: '#172e3a', mist: '#527a88', top: '#8faeac', light: '#c1d1c0', edge: '#496e77', rock: '#314d60', leaf: '#547f80', leafLight: '#95b2a0', water: '#559cac', accent: '#d6e6d0', flower: '#e6e6ce' },
  { sky: '#302b30', mist: '#74524d', top: '#776958', light: '#9b8966', edge: '#584e46', rock: '#3e3537', leaf: '#6c6141', leafLight: '#a88b52', water: '#9b6050', accent: '#edbc7a', flower: '#e6a879' },
  { sky: '#27373a', mist: '#6a7a70', top: '#7a8468', light: '#a4a387', edge: '#555e54', rock: '#3d4a49', leaf: '#486957', leafLight: '#79906c', water: '#568d8b', accent: '#ded1a1', flower: '#d7d5ab' },
  { sky: '#172e30', mist: '#406862', top: '#527566', light: '#77907a', edge: '#314c44', rock: '#253d3a', leaf: '#325d54', leafLight: '#608778', water: '#387c7b', accent: '#c5d58c', flower: '#c7b8df' },
  { sky: '#203240', mist: '#526d81', top: '#718577', light: '#9ca88d', edge: '#435c59', rock: '#334956', leaf: '#3d6d65', leafLight: '#739a83', water: '#518f9e', accent: '#e1d09b', flower: '#d1d3c9' },
  { sky: '#352e3b', mist: '#7a6778', top: '#8f806f', light: '#b5a28a', edge: '#68554f', rock: '#4c4048', leaf: '#6b6a5c', leafLight: '#a39672', water: '#797f97', accent: '#e2bca0', flower: '#dca6b8' },
  { sky: '#282e43', mist: '#646880', top: '#778373', light: '#a0a88c', edge: '#4a5a57', rock: '#373d54', leaf: '#586a67', leafLight: '#879b82', water: '#697f9f', accent: '#d6c1ed', flower: '#cab5e1' },
  { sky: '#35382e', mist: '#787b59', top: '#86916d', light: '#afb185', edge: '#5b654b', rock: '#454c3f', leaf: '#54724c', leafLight: '#8c9c62', water: '#638b79', accent: '#e9cc8c', flower: '#e9c289' },
  { sky: '#263c3b', mist: '#6c8c80', top: '#8b9b75', light: '#bac39a', edge: '#5c755a', rock: '#3e5950', leaf: '#4a7758', leafLight: '#87a375', water: '#65a29b', accent: '#f1d9a0', flower: '#f2d5bc' },
];

const OUTLINE = [[-5, -3], [-3, -5], [3, -5], [5, -3], [5, 3], [3, 5], [-3, 5], [-5, 3]];
const QUESTS = [{ x: -3.1, y: 0.4 }, { x: 0.6, y: -3.2 }, { x: 3.1, y: 1.5 }];
const SPAWN = { x: -1.1, y: 3.35 };
const UNIT_X = 46;
const UNIT_Y = 23;
const TAU = Math.PI * 2;

function seeded(seed) {
  return () => {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function point(x, y, z = 0) { return { x: (x - y) * UNIT_X, y: (x + y) * UNIT_Y - z }; }
function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function inside(x, y, margin = 0) { return Math.abs(x) <= 5 - margin && Math.abs(y) <= 5 - margin && Math.abs(x) + Math.abs(y) <= 8 - margin; }
function clampPosition(p) {
  p.x = Math.max(-4.65, Math.min(4.65, p.x));
  p.y = Math.max(-4.65, Math.min(4.65, p.y));
  const sum = Math.abs(p.x) + Math.abs(p.y);
  if (sum > 7.5) { p.x *= 7.5 / sum; p.y *= 7.5 / sum; }
  return p;
}

export class World {
  constructor(canvas, { onInteract = () => {}, onNear = () => {} } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onInteract = onInteract;
    this.onNear = onNear;
    this.completed = new Set();
    this.level = 0;
    this.motion = false;
    this.paused = false;
    this.keys = new Set();
    this.player = { ...SPAWN };
    this.target = null;
    this.targetQuest = null;
    this.near = null;
    this.facing = 1;
    this.walkPhase = 0;
    this.ambient = 0;
    this.lastTime = 0;
    this.dirty = true;
    this.disposed = false;
    this.listeners = [];
    if (!canvas.hasAttribute('tabindex')) canvas.tabIndex = 0;
    canvas.style.touchAction = 'manipulation';
    this.bind(window, 'keydown', e => this.keyDown(e));
    this.bind(window, 'keyup', e => this.keys.delete(e.key.toLowerCase()));
    this.bind(window, 'blur', () => this.keys.clear());
    this.bind(canvas, 'pointerdown', e => this.pointerDown(e));
    this.bind(document, 'visibilitychange', () => { this.keys.clear(); this.lastTime = 0; });
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.setLevel(0);
    this.resize();
    this.frame = requestAnimationFrame(t => this.tick(t));
  }

  bind(target, event, handler) { target.addEventListener(event, handler); this.listeners.push([target, event, handler]); }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.dpr = dpr;
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.scale = Math.min(this.width / 850, this.height / 650);
    this.origin = { x: this.width * 0.5, y: this.height * 0.46 };
    this.dirty = true;
  }

  setLevel(index, completedTrialIndices = []) {
    this.level = Math.max(0, Math.min(9, Math.floor(Number(index) || 0)));
    this.palette = PALETTES[this.level];
    this.completed = new Set(completedTrialIndices);
    this.player = { ...SPAWN };
    this.target = null;
    this.targetQuest = null;
    this.keys.clear();
    this.near = null;
    this.onNear(null);
    this.generate();
    this.dirty = true;
  }

  setCompleted(indices = []) { this.completed = new Set(indices); this.dirty = true; }
  setPaused(paused) { this.paused = Boolean(paused); this.keys.clear(); this.target = null; this.targetQuest = null; this.dirty = true; }
  setMotion(enabled) { this.motion = Boolean(enabled); this.dirty = true; }

  generate() {
    const random = seeded(4217 + this.level * 783);
    this.tiles = [];
    this.scenery = [];
    this.particles = [];
    for (let x = -5; x < 5; x += .55) {
      for (let y = -5; y < 5; y += .55) {
        if (inside(x, y, .2)) this.tiles.push({ x, y, v: random(), size: .3 + random() * .6 });
      }
    }
    const routeDistance = p => {
      const paths = [[SPAWN, { x: 0, y: 0 }], ...QUESTS.map(q => [{ x: 0, y: 0 }, q])];
      return Math.min(...paths.map(([a,b]) => {
        const vx=b.x-a.x, vy=b.y-a.y;
        const t=Math.max(0,Math.min(1,((p.x-a.x)*vx+(p.y-a.y)*vy)/(vx*vx+vy*vy)));
        return Math.hypot(p.x-a.x-t*vx,p.y-a.y-t*vy);
      }));
    };
    for (let i = 0; i < 150; i++) {
      const x = random() * 9.2 - 4.6, y = random() * 9.2 - 4.6;
      const p = { x, y };
      if (!inside(x,y,.45) || routeDistance(p)<.48 || QUESTS.some(q => distance(q,p)<1.18) || distance(SPAWN,p)<.8) continue;
      const type = i < 42 ? 'tree' : i < 74 ? 'rock' : 'grass';
      this.scenery.push({ x, y, type, seed: random(), size: .65 + random() * .72 });
    }
    // Deliberately placed silhouettes make the landmark read clearly at every size.
    this.scenery.push({ x: -3.45, y: -2.5, type: 'tower', size: 1, seed: .5 });
    this.scenery.push({ x: 3.8, y: -2.8, type: 'ruin', size: 1, seed: .5 });
    for (let i = 0; i < 28; i++) this.particles.push({ x: random() * 860 - 430, y: random() * 450 - 260, speed: .1 + random() * .25, r: .6 + random() * .7 });
  }

  keyDown(e) {
    const target = e.target;
    if (this.paused || document.querySelector('dialog[open]') || target?.closest?.('input, textarea, select, button, a, [contenteditable="true"]')) return;
    const key = e.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
      e.preventDefault(); this.keys.add(key); this.target = null; this.targetQuest = null;
    } else if ((key === 'e' || key === ' ') && !e.repeat) {
      e.preventDefault(); this.interact();
    }
  }

  pointerDown(e) {
    if (this.paused || e.button !== 0) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - this.origin.x) / this.scale;
    const y = (e.clientY - rect.top - this.origin.y) / this.scale;
    this.canvas.focus({ preventScroll: true });
    let selected = null;
    for (let i = 0; i < QUESTS.length; i++) {
      const p = point(QUESTS[i].x, QUESTS[i].y);
      if (Math.abs(x-p.x)<42 && y>p.y-110 && y<p.y+22) selected=i;
    }
    if (selected !== null) this.travelTo(selected);
    else {
      const target = { x: (x / UNIT_X + y / UNIT_Y) / 2, y: (y / UNIT_Y - x / UNIT_X) / 2 };
      if (!inside(target.x, target.y)) return;
      this.target = clampPosition(target); this.targetQuest = null;
    }
    this.dirty = true;
  }

  /** Optional accessible navigation: walk to a waypoint, then open its activity. */
  travelTo(index) {
    if (this.paused || !QUESTS[index]) return;
    this.target = { ...QUESTS[index] };
    this.targetQuest = index;
    this.dirty = true;
  }

  /** A discrete touch movement in screen coordinates; call repeatedly for a held button. */
  move(dx, dy) {
    if (this.paused || (!dx && !dy)) return;
    const len = Math.hypot(dx,dy), step = 27;
    dx /= len; dy /= len;
    const base = this.target || this.player;
    this.target = clampPosition({ x: base.x + (dx / UNIT_X + dy / UNIT_Y) * step / 2, y: base.y + (dy / UNIT_Y - dx / UNIT_X) * step / 2 });
    this.targetQuest = null;
    this.dirty = true;
  }

  interact() {
    if (this.paused) return;
    this.updateNear();
    if (this.near !== null) { this.target = null; this.targetQuest = null; this.onInteract(this.near); }
  }

  updateNear() {
    let nearest = null, best = 1.3;
    QUESTS.forEach((q,i) => { const d = distance(q, this.player); if (d < best) { best = d; nearest = i; } });
    if (nearest !== this.near) { this.near = nearest; this.onNear(nearest); this.dirty = true; }
  }

  tick(time) {
    if (this.disposed) return;
    const dt = Math.min(.04, this.lastTime ? (time - this.lastTime) / 1000 : 0);
    this.lastTime = time;
    let walking = false;
    if (!this.paused && !document.hidden) {
      let dx = Number(this.keys.has('d') || this.keys.has('arrowright')) - Number(this.keys.has('a') || this.keys.has('arrowleft'));
      let dy = Number(this.keys.has('s') || this.keys.has('arrowdown')) - Number(this.keys.has('w') || this.keys.has('arrowup'));
      if (dx || dy) {
        const length = Math.hypot(dx,dy); dx /= length; dy /= length;
        this.player = clampPosition({ x: this.player.x+(dx/UNIT_X+dy/UNIT_Y)*120*dt/2, y:this.player.y+(dy/UNIT_Y-dx/UNIT_X)*120*dt/2 });
        walking = true; if (dx) this.facing = Math.sign(dx);
      } else if (this.target) {
        const a = point(this.player.x,this.player.y), b = point(this.target.x,this.target.y);
        const length = distance(a,b), step = 135*dt;
        if (length <= Math.max(1.3,step)) {
          this.player = { ...this.target }; this.target = null;
          const quest = this.targetQuest; this.targetQuest = null;
          if (quest !== null) this.onInteract(quest);
        } else {
          this.player.x += (this.target.x-this.player.x)*step/length;
          this.player.y += (this.target.y-this.player.y)*step/length;
          if (Math.abs(b.x-a.x)>1) this.facing = Math.sign(b.x-a.x);
          walking = true;
        }
      }
      this.updateNear();
    }
    if (walking) { this.walkPhase += dt*10; this.dirty = true; }
    if (this.motion && !this.paused && !document.hidden) { this.ambient += dt; this.dirty = true; }
    if (this.dirty && this.width > 1) { this.render(walking); this.dirty = false; }
    this.frame = requestAnimationFrame(t => this.tick(t));
  }

  polygon(points, fill, stroke = null, lineWidth = 1) {
    const c=this.ctx;
    c.beginPath(); points.forEach((p,i)=> i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y)); c.closePath();
    if(fill){c.fillStyle=fill;c.fill();} if(stroke){c.strokeStyle=stroke;c.lineWidth=lineWidth;c.stroke();}
  }

  ellipse(x,y,rx,ry,fill) { const c=this.ctx;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=fill;c.fill(); }

  line(points, color, width=1) {
    const c=this.ctx; c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.strokeStyle=color;c.lineWidth=width;c.lineJoin='round';c.lineCap='round';c.stroke();
  }

  isoPath(points, color, width) { this.line(points.map(p=>point(p.x,p.y)),color,width); }

  render(walking) {
    const c=this.ctx,p=this.palette;
    c.setTransform(this.dpr,0,0,this.dpr,0,0);
    c.clearRect(0,0,this.width,this.height);
    const sky=c.createLinearGradient(0,0,this.width*.6,this.height);
    sky.addColorStop(0,p.sky);sky.addColorStop(.7,p.mist);sky.addColorStop(1,p.sky);
    c.fillStyle=sky;c.fillRect(0,0,this.width,this.height);
    c.save();c.translate(this.origin.x,this.origin.y);c.scale(this.scale,this.scale);
    this.drawBackground();
    this.drawIsland();
    const objects=[...this.scenery,...QUESTS.map((q,i)=>({...q,type:'quest',index:i})),{...this.player,type:'player'}];
    objects.sort((a,b)=>(a.x+a.y)-(b.x+b.y));
    objects.forEach(o=>{
      const pos=point(o.x,o.y);
      c.save();c.translate(pos.x,pos.y);
      if(o.type==='tree')this.drawTree(o);
      else if(o.type==='rock')this.drawRock(o);
      else if(o.type==='grass')this.drawGrass(o);
      else if(o.type==='tower')this.drawTower();
      else if(o.type==='ruin')this.drawRuin();
      else if(o.type==='quest')this.drawQuest(o.index);
      else if(o.type==='player')this.drawPlayer(walking);
      c.restore();
    });
    if(this.target&&this.targetQuest===null){const t=point(this.target.x,this.target.y);c.strokeStyle='#f1e7c48c';c.lineWidth=1;c.beginPath();c.ellipse(t.x,t.y,9,4,0,0,TAU);c.stroke();}
    this.drawAtmosphere();
    c.restore();
    this.drawCompass();
  }

  drawBackground() {
    const c=this.ctx,p=this.palette;
    // Quiet, painted atmosphere. No pulsing, flicker, camera bob or rapid motion.
    const halo=c.createRadialGradient(290,-200,2,290,-200,180);
    halo.addColorStop(0,'#f3dbab14');halo.addColorStop(1,'#f3dbab00');c.fillStyle=halo;c.fillRect(100,-390,400,390);
    this.ellipse(290,-205,31,31,'#efe0b917');
    c.save();c.globalAlpha=.22;
    this.polygon([{x:-540,y:-90},{x:-360,y:-230},{x:-200,y:-110},{x:-50,y:-235},{x:130,y:-90}],p.sky);
    this.polygon([{x:130,y:-100},{x:280,y:-225},{x:490,y:-80},{x:600,y:-180},{x:700,y:60}],p.sky);
    c.restore();
    const fog=c.createLinearGradient(0,-140,0,160);fog.addColorStop(0,p.mist+'00');fog.addColorStop(.75,p.mist+'55');fog.addColorStop(1,p.mist+'00');c.fillStyle=fog;c.fillRect(-600,-140,1200,300);
    // Distant hanging islets give a sense of an archipelago beyond this chapter.
    this.drawDistantIsland(-370,-70,.32);
    this.drawDistantIsland(345,-95,.22);
    this.drawDistantIsland(410,126,.27);
    this.ellipse(0,257,288,43,p.sky+'60');
    this.ellipse(0,257,205,29,p.sky+'44');
  }

  drawDistantIsland(x,y,s) {
    const c=this.ctx,p=this.palette;c.save();c.translate(x,y);c.scale(s,s);c.globalAlpha=.4;
    this.polygon([{x:-110,y:0},{x:0,y:-40},{x:105,y:0},{x:20,y:90}],p.rock);
    this.polygon([{x:-110,y:0},{x:-20,y:-45},{x:105,y:0},{x:0,y:30}],p.edge);
    c.translate(-20,-20);this.drawTree({size:.95,seed:.4});c.restore();
  }

  drawIsland() {
    const c=this.ctx,p=this.palette,top=OUTLINE.map(([x,y])=>point(x,y));
    // The lower rock facets continue past the turf; each face catches different light.
    for(let i=2;i<7;i++){
      const a=top[i],b=top[(i+1)%8];
      this.polygon([a,b,{x:b.x*.83,y:b.y+93+(i%2)*16},{x:a.x*.83,y:a.y+104}],i<4?p.rock:p.edge);
      this.polygon([{x:a.x*.83,y:a.y+104},{x:b.x*.83,y:b.y+93+(i%2)*16},{x:(a.x+b.x)*.28,y:(a.y+b.y)/2+150}],i%2?p.rock:p.edge);
      this.line([{x:a.x*.85,y:a.y+25},{x:a.x*.83,y:a.y+84}],p.sky+'55',1.2);
    }
    this.polygon(top,p.top);
    c.save();c.beginPath();top.forEach((v,i)=>i?c.lineTo(v.x,v.y):c.moveTo(v.x,v.y));c.closePath();c.clip();
    for(const t of this.tiles){
      const a=point(t.x,t.y),b=point(t.x+t.size,t.y),d=point(t.x,t.y+t.size);
      this.polygon([a,b,d],t.v>.6?p.light+'25':p.edge+'18');
    }
    // A sheltered ribbon of water; paths cross it on an old plank footbridge.
    const river=[{x:-4.8,y:-1.8},{x:-3.4,y:-2},{x:-2.2,y:-1.5},{x:-1.5,y:-.9},{x:-1.3,y:.1},{x:-.4,y:1.1},{x:.1,y:2.2},{x:.6,y:4.6}];
    this.isoPath(river,p.edge+'b0',35);this.isoPath(river,p.water,26);this.isoPath(river,'#c8e5d022',2);
    for(let i=0;i<13;i++){
      const t=i/13,a=point(-3.7+t*4.1,-1.6+t*6.1);this.line([{x:a.x-5,y:a.y},{x:a.x+7,y:a.y-1}],'#cfdfd133',1);
    }
    const center={x:0,y:0};
    for(const q of [SPAWN,...QUESTS]){
      this.isoPath([center,q],p.edge+'52',29);this.isoPath([center,q],'#cabd945b',22);this.isoPath([center,q],'#e1cea22a',14);
    }
    const bridge=point(-.45,1.4);c.save();c.translate(bridge.x,bridge.y);c.rotate(-.34);
    c.fillStyle='#685e48';c.fillRect(-21,-20,42,40);
    for(let i=0;i<7;i++){c.fillStyle=i%2?'#b2a17b':'#a09270';c.fillRect(-23,-19+i*6,46,4.8);}
    this.line([{x:-26,y:-22},{x:-26,y:20}],'#5b5845',3);this.line([{x:26,y:-22},{x:26,y:20}],'#5b5845',3);c.restore();
    // Level-specific calm texture: snow, volcanic warmth, wetland plants, or a star mosaic.
    if(this.level===1){for(const t of this.tiles.filter((_,i)=>i%7===0)){const a=point(t.x,t.y);this.ellipse(a.x,a.y,13,5,'#e1e8d63b');}}
    if(this.level===2){this.isoPath([{x:2.7,y:-4.5},{x:3.1,y:-3.6},{x:4,y:-3.2}],'#e4a16e55',3);}
    if(this.level===7){const a=point(-3.45,-2.5);c.strokeStyle='#d7c1e54a';c.lineWidth=1;c.beginPath();c.ellipse(a.x,a.y,65,32,0,0,TAU);c.stroke();}
    c.restore();
    // Thin broken turf edges provide the handcrafted cutaway silhouette.
    for(let i=2;i<7;i++)this.line([top[i],top[(i+1)%8]],p.light+'80',3.5);
    const fall=point(.6,4.6);c.save();c.globalAlpha=.55;
    this.polygon([{x:fall.x-13,y:fall.y},{x:fall.x+12,y:fall.y-2},{x:fall.x+6,y:fall.y+108},{x:fall.x-9,y:fall.y+101}],p.water);
    this.line([{x:fall.x-3,y:fall.y},{x:fall.x-3,y:fall.y+91}],'#d5e3d86b',2);c.restore();
    this.ellipse(fall.x,fall.y+107,17,5,p.water+'26');
  }

  drawTree(o) {
    const c=this.ctx,p=this.palette,s=o.size;c.save();c.scale(s,s);
    this.ellipse(3,3,20,8,'#18362d35');
    this.line([{x:0,y:0},{x:0,y:-43}],'#4c5240',5);
    const snowy=this.level===1,willow=this.level===4;
    if(willow){
      this.ellipse(0,-42,24,25,p.leaf);this.ellipse(-11,-48,18,21,p.leafLight);
      for(let i=-19;i<22;i+=7)this.line([{x:i,y:-41},{x:i+2,y:-12-Math.abs(i)*.35}],p.leafLight+'bb',3);
    }else{
      const a=o.seed>.5?1:.83;
      this.polygon([{x:-27*a,y:-23},{x:0,y:-82},{x:25*a,y:-24}],p.leaf);
      this.polygon([{x:-27*a,y:-23},{x:0,y:-82},{x:0,y:-27}],p.leafLight);
      this.polygon([{x:-21*a,y:-43},{x:0,y:-88},{x:20*a,y:-43}],p.leaf);
      this.polygon([{x:-21*a,y:-43},{x:0,y:-88},{x:-2,y:-44}],p.leafLight);
      this.polygon([{x:-14*a,y:-62},{x:0,y:-94},{x:13*a,y:-62}],snowy?'#c4d9cd':p.leafLight);
      if(snowy)this.polygon([{x:-26*a,y:-24},{x:-4,y:-33},{x:23*a,y:-24},{x:0,y:-27}],'#c8d9cd');
    }
    c.restore();
  }

  drawRock(o) {
    const c=this.ctx,p=this.palette;c.save();c.scale(o.size,o.size);this.ellipse(0,2,16,6,'#152b2b2b');
    this.polygon([{x:-15,y:-3},{x:-10,y:-17},{x:2,y:-24},{x:15,y:-11},{x:12,y:2},{x:-2,y:7}],p.edge);
    this.polygon([{x:-15,y:-3},{x:-10,y:-17},{x:2,y:-24},{x:3,y:-7}],p.light+'aa');
    this.polygon([{x:3,y:-7},{x:2,y:-24},{x:15,y:-11},{x:12,y:2}],p.rock+'bb');c.restore();
  }

  drawGrass(o) {
    const p=this.palette;
    for(let i=0;i<3;i++){const x=(i-1)*4;this.line([{x,y:0},{x:x+(i-1)*2,y:-6-o.seed*6}],p.leafLight,1.4);}
    if(o.seed>.6){this.ellipse(3,-10,2,2,p.flower);this.ellipse(-4,-7,1.5,1.5,p.flower+'bb');}
  }

  block(x,y,z,w,d,h,top,left,right) {
    const a=point(x-w/2,y-d/2,z+h),b=point(x+w/2,y-d/2,z+h),cc=point(x+w/2,y+d/2,z+h),dd=point(x-w/2,y+d/2,z+h);
    this.polygon([dd,cc,{x:cc.x,y:cc.y+h},{x:dd.x,y:dd.y+h}],left);
    this.polygon([b,cc,{x:cc.x,y:cc.y+h},{x:b.x,y:b.y+h}],right);
    this.polygon([a,b,cc,dd],top);
  }

  drawTower() {
    const c=this.ctx,p=this.palette;
    this.ellipse(7,6,43,16,'#17312d34');
    this.block(0,0,0,.9,.9,15,p.light,p.edge,p.rock);
    this.block(0,0,15,.65,.65,68,p.light,p.edge,p.rock);
    this.block(0,0,83,.9,.9,9,p.light,p.edge,p.rock);
    if(this.level===7){
      c.strokeStyle=p.accent;c.lineWidth=2;c.beginPath();c.ellipse(0,-110,23,28,-.5,0,TAU);c.stroke();c.beginPath();c.ellipse(0,-110,29,11,.4,0,TAU);c.stroke();this.ellipse(0,-110,4,4,p.accent);
    }else if(this.level===9){
      this.block(0,0,92,.48,.48,32,'#e4cf9a','#c0aa79','#8f805f');
      this.polygon([{x:-25,y:-124},{x:0,y:-149},{x:25,y:-124}],p.leaf);this.ellipse(0,-108,7,11,p.accent);
    }else{
      this.polygon([{x:-30,y:-91},{x:0,y:-128},{x:30,y:-91},{x:0,y:-78}],p.leaf);
      this.polygon([{x:-30,y:-91},{x:0,y:-128},{x:0,y:-78}],p.leafLight);
      this.line([{x:0,y:-128},{x:0,y:-151}],p.accent+'aa',2);
      this.polygon([{x:0,y:-151},{x:24,y:-145},{x:0,y:-138}],p.accent+'aa');
    }
    this.line([{x:1,y:-46},{x:1,y:-64}],p.sky,6);
    this.line([{x:1,y:-46},{x:1,y:-64}],p.accent+'aa',2);
    this.line([{x:-13,y:-20},{x:-13,y:-64}],p.leafLight+'88',3);
  }

  drawRuin() {
    const p=this.palette;
    this.block(0,0,0,1.1,.75,10,p.light,p.edge,p.rock);
    this.block(-.32,0,10,.25,.3,45,p.light,p.edge,p.rock);
    this.block(.32,0,10,.25,.3,64,p.light,p.edge,p.rock);
    this.block(.15,0,74,.6,.38,8,p.light,p.edge,p.rock);
    this.line([{x:18,y:-72},{x:15,y:-42},{x:3,y:-24}],p.leafLight,4);
    this.ellipse(13,-49,7,4,p.leaf);this.ellipse(8,-33,7,4,p.leaf);
  }

  drawQuest(index) {
    const c=this.ctx,p=this.palette,done=this.completed.has(index),near=this.near===index;
    this.ellipse(0,4,36,15,'#18342d4d');
    this.ellipse(0,0,34,16,done?p.accent+'35':p.light+'80');
    c.strokeStyle=near?'#f4e8c9':p.accent+'66';c.lineWidth=near?2:1;c.beginPath();c.ellipse(0,0,34,16,0,0,TAU);c.stroke();
    this.block(0,0,0,.55,.55,12,p.light,p.edge,p.rock);
    this.block(0,0,12,.3,.3,27,p.light,p.edge,p.rock);
    this.block(0,0,39,.48,.48,6,p.light,p.edge,p.rock);
    const glow=c.createRadialGradient(0,-61,3,0,-61,35);glow.addColorStop(0,p.accent+(done?'55':'2e'));glow.addColorStop(1,p.accent+'00');c.fillStyle=glow;c.fillRect(-40,-102,80,80);
    const jewel=done?'#f0d593':p.accent;
    this.polygon([{x:0,y:-77},{x:12,y:-61},{x:0,y:-43},{x:-12,y:-61}],jewel);
    this.polygon([{x:0,y:-77},{x:0,y:-43},{x:-12,y:-61}],'#fff4cf80');
    this.line([{x:0,y:-73},{x:7,y:-61}], '#fff6dd88',1);
    // Compact map badges remain legible on touch screens without covering the world.
    c.fillStyle='#142e2beb';c.beginPath();c.roundRect(-14,-108,28,22,11);c.fill();
    c.strokeStyle=near?'#f6e8c5':p.accent+'77';c.lineWidth=1;c.stroke();
    c.font='600 11px system-ui, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle=done?'#e6d293':'#f2ead7';
    c.fillText(done?'✓':String(index+1).padStart(2,'0'),0,-96);
    if(near){c.font='10px system-ui, sans-serif';c.fillStyle='#f1e9d3';c.fillText('E · explore',0,28);}
  }

  drawPlayer(walking) {
    const c=this.ctx,p=this.palette;this.ellipse(0,1,12,5,'#10292870');
    const sway=walking&&this.motion?Math.sin(this.walkPhase)*1.4:0;
    c.save();c.translate(0,sway);
    // A warm little traveller carrying a lantern: the only moving focus in the scene.
    this.line([{x:-4,y:-4},{x:-4,y:-15}],'#313e38',4);
    this.line([{x:4,y:-4},{x:4,y:-15}],'#26372f',4);
    this.polygon([{x:-9,y:-13},{x:-6,y:-32},{x:6,y:-32},{x:11,y:-12},{x:0,y:-9}],'#d9bd83');
    this.polygon([{x:-9,y:-13},{x:-6,y:-32},{x:0,y:-30},{x:0,y:-9}],'#b99c6c');
    this.ellipse(0,-34,6.5,7,'#dcb993');
    this.polygon([{x:-7,y:-34},{x:-7,y:-41},{x:3,y:-44},{x:8,y:-37},{x:3,y:-37},{x:0,y:-40}],'#39453d');
    this.line([{x:-5,y:-29},{x:6,y:-29}],'#7e9f8a',4);
    this.polygon([{x:4,y:-28},{x:15,y:-24},{x:10,y:-20},{x:4,y:-23}],'#7e9f8a');
    const side=this.facing;
    this.line([{x:side*7,y:-25},{x:side*14,y:-19}],'#d3b484',3);
    this.line([{x:side*14,y:-19},{x:side*14,y:-12}],'#d6c18c',1);
    const halo=c.createRadialGradient(side*14,-10,1,side*14,-10,15);halo.addColorStop(0,'#f3d28c35');halo.addColorStop(1,'#f3d28c00');c.fillStyle=halo;c.fillRect(side*14-15,-25,30,30);
    c.fillStyle='#ead393';c.fillRect(side*14-3,-14,6,8);c.strokeStyle='#8a825b';c.lineWidth=1;c.strokeRect(side*14-3,-14,6,8);
    c.restore();
  }

  drawAtmosphere() {
    const c=this.ctx,p=this.palette;c.save();
    for(const q of this.particles){
      const drift=this.motion?((this.ambient*q.speed*4)%80):0;
      this.ellipse(q.x+Math.sin(q.y)*drift*.2,q.y-drift,q.r,q.r,p.accent+'44');
    }
    c.restore();
  }

  drawCompass() {
    const c=this.ctx,x=this.width-36,y=this.height-38;c.save();c.translate(x,y);c.globalAlpha=.6;
    c.strokeStyle='#dbe1cd55';c.lineWidth=1;c.beginPath();c.arc(0,0,17,0,TAU);c.stroke();
    this.polygon([{x:0,y:-12},{x:4,y:3},{x:0,y:0},{x:-4,y:3}],'#e5dbc0');
    this.polygon([{x:0,y:12},{x:4,y:-3},{x:0,y:0},{x:-4,y:-3}],'#c8d7c044');
    c.fillStyle='#e5dbc0';c.font='8px system-ui, sans-serif';c.textAlign='center';c.fillText('N',0,-23);c.restore();
  }

  destroy() {
    this.disposed=true;cancelAnimationFrame(this.frame);this.resizeObserver.disconnect();
    this.listeners.forEach(([target,event,handler])=>target.removeEventListener(event,handler));
    this.listeners=[];this.keys.clear();
  }
}
