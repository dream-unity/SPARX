import test from 'node:test';
import assert from 'node:assert/strict';
import { World } from '../dist/world.js';

// Test gameplay navigation without a browser or a graphics dependency. Numeric
// drawing arguments are checked too, so malformed procedural geometry fails.
function environment() {
  const originals = new Map();
  const replace = (key, value) => { originals.set(key, globalThis[key]); globalThis[key] = value; };
  const events = () => ({ addEventListener() {}, removeEventListener() {} });
  let modal = false, disconnected = false, cancelled = false;
  replace('window', { ...events(), devicePixelRatio: 1 });
  replace('document', { ...events(), hidden: false, querySelector: () => modal ? {} : null });
  replace('ResizeObserver', class { observe() {} disconnect() { disconnected = true; } });
  replace('requestAnimationFrame', () => 1);
  replace('cancelAnimationFrame', () => { cancelled = true; });
  const validate = args => args.filter(x => typeof x === 'number').forEach(x => assert(Number.isFinite(x), 'Canvas coordinates must be finite'));
  const ctx = new Proxy({}, {
    get(object, key) {
      if (key in object) return object[key];
      return (...args) => {
        validate(args);
        if (key.startsWith('create')) return { addColorStop() {} };
      };
    },
    set(object, key, value) { object[key] = value; return true; }
  });
  const canvas = {
    ...events(), style: {}, getContext: () => ctx, hasAttribute: () => false,
    getBoundingClientRect: () => ({ width: 900, height: 650, left: 0, top: 0 }),
    focus() {}
  };
  return {
    canvas, setModal: value => { modal = value; },
    cleaned: () => disconnected && cancelled,
    restore() { for (const [key, value] of originals) { if (value === undefined) delete globalThis[key]; else globalThis[key] = value; } }
  };
}

test('every waypoint in all ten worlds can be reached, interacted with and completed', () => {
  const env = environment();
  const visits = [];
  let world, time = 1;
  try {
    world = new World(env.canvas, { onInteract(index) { visits.push([world.level, index]); world.setPaused(true); } });
    for (let level = 0; level < 10; level++) {
      world.setLevel(level);
      world.render(false);
      for (let waypoint = 0; waypoint < 3; waypoint++) {
        world.setPaused(false);
        world.travelTo(waypoint);
        for (let frame = 0; frame < 500 && world.target; frame++) world.tick(time += 16);
        assert.deepEqual(visits.at(-1), [level, waypoint], `Could not reach chapter ${level + 1}, waypoint ${waypoint + 1}`);
        assert.equal(world.near, waypoint);
        world.setCompleted(Array.from({ length: waypoint + 1 }, (_, i) => i));
        world.render(false);
      }
      assert.equal(world.completed.size, 3);
    }
    assert.equal(visits.length, 30, 'Arrival must open each activity exactly once');
  } finally {
    world?.destroy();
    assert(env.cleaned(), 'World must release animation and resize subscriptions');
    env.restore();
  }
});

test('pause and form/modal focus protect the keyboard; touch movement works without ambient motion', () => {
  const env = environment();
  let world, time = 1;
  const key = (value, blocked = false) => ({ key: value, repeat: false, target: { closest: () => blocked ? {} : null }, preventDefault() { this.prevented = true; } });
  try {
    world = new World(env.canvas);
    assert.equal(world.motion, false);
    const start = { ...world.player };
    world.move(1, 0);
    for (let frame = 0; frame < 50; frame++) world.tick(time += 16);
    assert(world.player.x > start.x && world.player.y < start.y, 'Right movement must be right in screen coordinates');
    world.travelTo(0);
    world.setPaused(true);
    assert.equal(world.target, null, 'Pausing cancels queued walking and automatic interaction');
    world.move(1, 0);
    world.travelTo(2);
    world.keyDown(key('w'));
    assert.equal(world.target, null);
    assert.equal(world.keys.size, 0);
    world.setPaused(false);
    world.keyDown(key('w', true));
    assert.equal(world.keys.size, 0, 'Typing into a field must not move the character');
    env.setModal(true);
    world.keyDown(key('ArrowRight'));
    assert.equal(world.keys.size, 0, 'A modal must retain its keyboard events');
    env.setModal(false);
    const movement = key('ArrowRight');
    world.keyDown(movement);
    assert(world.keys.has('arrowright'));
    assert(movement.prevented, 'Movement keys must not scroll the page');
    world.setPaused(true);
    assert.equal(world.keys.size, 0, 'Pausing clears held keys');
  } finally {
    world?.destroy();
    env.restore();
  }
});
