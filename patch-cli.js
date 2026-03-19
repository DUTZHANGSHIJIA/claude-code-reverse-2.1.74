#!/usr/bin/env node
/**
 * Monkey patch script for Claude Code cli.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLI_PATH = '/usr/local/lib/node_modules/@anthropic-ai/claude-code/cli.js';

console.log('🔧 Claude Code Monkey Patch Tool\n');

// Read the file
console.log('📖 Reading cli.js...');
const content = fs.readFileSync(CLI_PATH, 'utf-8');
const lines = content.split('\n');

console.log(`   Total lines: ${lines.length}`);

// Check if already patched
if (content.includes('// MONKEY PATCH')) {
  console.log('⚠️  File already patched! Skipping...');
  process.exit(0);
}

// === Helper code to insert ===
const helperCode = `
// ============ MONKEY PATCH START ============
const MONKEY_PATCH_LOG_PATH = hD.join(Y8A(), '.claude', 'api-messages.log');
try { M3.mkdirSync(hD.dirname(MONKEY_PATCH_LOG_PATH), { recursive: true }); } catch (e) {}
M3.writeFileSync(MONKEY_PATCH_LOG_PATH, \`Claude Code Session \${new Date().toISOString()}\\n\`, { flag: 'w' });

function MP_isAsyncIterable(x) { return x && typeof x[Symbol.asyncIterator] === 'function'; }
const MP_ts = () => new Date().toISOString();
function MP_uid() { return \`\${Date.now().toString(36)}-\${Math.random().toString(36).slice(2, 8)}\`; }

function MP_tapIteratorInPlace(inner, onFinal) {
  if (!inner) return inner;
  const TAPPED = Symbol.for('anthropic.tap.iterator');
  if (inner[TAPPED]) return inner;
  Object.defineProperty(inner, TAPPED, { value: true, configurable: true });

  const byteLen = s => typeof Buffer !== 'undefined' ? Buffer.byteLength(s, 'utf8') : new TextEncoder().encode(s).length;

  const makeWrapper = getOrigIter => function() {
    const it = getOrigIter();
    let text = '';
    const open = new Map();
    const done = [];
    const PREVIEW_CAP = Infinity;

    const start = (id, name) => {
      if (id == null || open.has(id)) return;
      open.set(id, { id, name: name||'unknown', startedAt: Date.now(), inputBytes: 0, preview: '' });
    };
    const delta = (id, chunk) => {
      if (id == null) return;
      if (!open.has(id)) start(id);
      const rec = open.get(id);
      if (!rec) return;
      const s = typeof chunk==='string' ? chunk : JSON.stringify(chunk||'');
      rec.inputBytes += byteLen(s);
      if (rec.preview.length < PREVIEW_CAP) {
        rec.preview += s.slice(0, PREVIEW_CAP - rec.preview.length);
      }
    };
    const stop = id => {
      const rec = open.get(id);
      if (!rec) return;
      open.delete(id);
      const finishedAt = Date.now();
      done.push({ ...rec, finishedAt, durationMs: finishedAt - rec.startedAt });
    };
    const finalizeDangling = err => {
      for (const rec of open.values()) {
        done.push({ ...rec, finishedAt: Date.now(), durationMs: Date.now() - rec.startedAt, errored: err ? (err.stack||String(err)) : undefined });
      }
      open.clear();
    };

    return (async function*() {
      try {
        for await (const ev of it) {
          if (ev?.type==='content_block_delta' && ev.delta?.type==='text_delta' && typeof ev.delta.text==='string') {
            text += ev.delta.text;
          }
          if (ev?.type==='content_block_start' && ev.content_block?.type==='tool_use') {
            start(ev.index, ev.content_block.name);
          }
          if (ev?.type==='content_block_delta') {
            const d = ev.delta;
            if (typeof d.input_json_delta==='string') delta(ev.index, d.input_json_delta);
            if (typeof d.input_text_delta==='string') delta(ev.index, d.input_text_delta);
            if (typeof d.tool_use_delta==='string') delta(ev.index, d.tool_use_delta);
            if (d.type==='input_json_delta') delta(ev.index, d.partial_json);
            if (d.type==='input_text_delta') delta(ev.index, d.partial_text);
          }
          if (ev?.type==='content_block_stop' && ev.content_block?.type==='tool_use') {
            stop(ev.index);
          }
          if (ev?.type==='tool_use') {
            if (ev.start) start(ev.index, ev.name);
            if (typeof ev.delta==='string') delta(ev.index, ev.delta);
            if (ev.stop) stop(ev.index);
          }
          yield ev;
        }
        finalizeDangling();
        onFinal({ text, tools: done });
      } catch (e) {
        finalizeDangling(e);
        onFinal({ text, tools: done });
        throw e;
      }
    })();
  };

  const origSym = inner[Symbol.asyncIterator];
  if (typeof origSym==='function') {
    Object.defineProperty(inner, Symbol.asyncIterator, {
      value: makeWrapper(origSym.bind(inner)),
      configurable: true, writable: true
    });
    return inner;
  }
  if (typeof inner.iterator==='function') {
    Object.defineProperty(inner, 'iterator', {
      value: makeWrapper(inner.iterator.bind(inner)),
      configurable: true, writable: true
    });
    if (!inner[Symbol.asyncIterator]) {
      Object.defineProperty(inner, Symbol.asyncIterator, {
        value: () => inner.iterator(),
        configurable: true
      });
    }
  }
  return inner;
}

console.log(\`[Monkey Patch] Logging to: \${MONKEY_PATCH_LOG_PATH}\`);
// ============ MONKEY PATCH HELPERS END ============
`;

// === STEP 1: Insert helpers ===
console.log('\n📝 Step 1: Inserting helper functions...');
lines.splice(3483, 0, helperCode);
console.log('   ✓ Inserted helper functions');

// === STEP 2: Find and patch constructor ===
console.log('\n📝 Step 2: Searching for KC class constructor...');

let found = false;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line && line.includes('this.completions = new') &&
      line.includes('this.messages = new') &&
      line.includes('this.models = new') &&
      line.includes('this.beta = new')) {

    console.log(`   Found constructor at line ${i + 1}`);

    const indent = line.match(/^(\s*)/)[1];

    // New constructor with monkey patch
    const newCode = `${indent}this.completions = new ho(this), this.messages = new lN(this), this.models = new PJ6(this), this.beta = new IW(this);
${indent}// MONKEY PATCH
${indent}{
${indent}  const origCreate = this.beta.messages.create.bind(this.beta.messages);
${indent}  this.beta.messages.create = (...args) => {
${indent}    const params = args[0] || {};
${indent}    const callUid = MP_uid();
${indent}    try { M3.appendFileSync(MONKEY_PATCH_LOG_PATH, \`\${MP_ts()} uid=\${callUid} input: \${JSON.stringify(params)}\\n\`); } catch (e) {}
${indent}    const ret = origCreate(...args);
${indent}    if (!params.stream) {
${indent}      ret.then(
${indent}        data => { try { M3.appendFileSync(MONKEY_PATCH_LOG_PATH, \`\${MP_ts()} uid=\${callUid} output: \${JSON.stringify(data)}\\n\`); } catch (e) {} },
${indent}        err => { try { M3.appendFileSync(MONKEY_PATCH_LOG_PATH, \`\${MP_ts()} uid=\${callUid} error: \${err.stack||String(err)}\\n\`); } catch (e) {} }
${indent}      );
${indent}      return ret;
${indent}    }
${indent}    return ret._thenUnwrap((data, _props) => {
${indent}      if (MP_isAsyncIterable(data)) {
${indent}        return MP_tapIteratorInPlace(data, final => {
${indent}          try { M3.appendFileSync(MONKEY_PATCH_LOG_PATH, \`\${MP_ts()} uid=\${callUid} stream.final: \${JSON.stringify(final)}\\n\`); } catch (e) {}
${indent}        });
${indent}      }
${indent}      return data;
${indent}    });
${indent}  };
${indent}}`;

    lines[i] = newCode;
    found = true;
    console.log(`   ✓ Patched constructor at line ${i + 1}`);
    break;
  }
}

if (!found) {
  console.error('   ✗ Could not find constructor!');
  process.exit(1);
}

// === STEP 3: Write output ===
console.log('\n💾 Writing patched file...');
const patchedContent = lines.join('\n');
const tempPath = path.join(__dirname, 'cli.js.patched');
fs.writeFileSync(tempPath, patchedContent, 'utf-8');
console.log(`   ✓ Written to: ${tempPath}`);

console.log('\n✅ Patch completed successfully!');
console.log('\n📋 Next steps:');
console.log(`   1. Review: less ${tempPath}`);
console.log(`   2. Apply: sudo cp ${tempPath} ${CLI_PATH}`);
console.log(`   3. Log: ~/.claude/api-messages.log`);
console.log(`   4. Backup: ~/Desktop/cli.js.backup\n`);
