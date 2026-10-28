import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const themeRoot = path.resolve(import.meta.dirname, '..');
const runtimeRoot = path.join(themeRoot, 'runtime');
const logFile = path.join(runtimeRoot, 'watch-home.log');
const endpoint = 'http://127.0.0.1:8080/json';
const runtimeSource = await fs.readFile(path.join(runtimeRoot, 'native-home.js'), 'utf8');
const runtimeCss = await fs.readFile(path.join(runtimeRoot, 'home.css'), 'utf8');
const baseCss = await fs.readFile(path.join(themeRoot, 'shared.css'), 'utf8') + '\n' +
  await fs.readFile(path.join(themeRoot, 'settings.css'), 'utf8') + '\n' +
  await fs.readFile(path.join(themeRoot, 'options', 'scheme', 'dark.css'), 'utf8') + `
  html[data-shfs-bpm], html[data-shfs-bpm] body, html[data-shfs-bpm] #Main {
    background-color: var(--shfs-background-custom, #2d2d2d) !important;
  }`;
const runtimeVersion = runtimeSource.match(/\bconst VERSION = '([^']+)'/)?.[1];
if (!runtimeVersion) throw Error('Could not determine Switch Home runtime version');
let translations = {};
try {
  translations = JSON.parse(await fs.readFile(path.join(process.env.USERPROFILE, 'homebrew', 'themes', 'css_translations.json'), 'utf8'));
} catch {}

const classMap = {};
const currentByAlias = new Map();
for (const [friendly, values] of Object.entries(translations)) {
  if (!Array.isArray(values) || !values.length) continue;
  const current = values.at(-1);
  classMap[friendly] = current;
  currentByAlias.set(friendly, current);
  for (const oldName of values) currentByAlias.set(oldName, current);
}
classMap.gamepadhome_RecentSection_39tNv = classMap.QcGXoqZ7_RecentSection || currentByAlias.get('_39tNvaLedsTrVh0fFsP4Jm') || '_39tNvaLedsTrVh0fFsP4Jm';
classMap.gamepadhome_ScrollArea_3PhGY = classMap.QcGXoqZ7_ScrollArea || currentByAlias.get('_3PhGYbMWIcIaZCfllWN19N') || '_3PhGYbMWIcIaZCfllWN19N';
const cssForSteam = runtimeCss.replace(/\.([_a-zA-Z][-_a-zA-Z0-9]*)/g, (match, name) =>
  currentByAlias.has(name) ? `.${currentByAlias.get(name)}` : match);
const baseCssForSteam = baseCss.replace(/\.([_a-zA-Z][-_a-zA-Z0-9]*)/g, (match, name) =>
  currentByAlias.has(name) ? `.${currentByAlias.get(name)}` : match);
const quote = value => JSON.stringify(value);
const injectExpression = `(() => {
  const sectionSelector = '.' + CSS.escape(${quote(classMap.gamepadhome_RecentSection_39tNv)});
  const apply = () => {
  // Steam can host its memory-router HOME at /index.html. Inspect the mounted
  // HOME section, not the browser URL, to avoid disabling the theme on startup.
  window.__shfsClasses = ${quote(classMap)};
  document.documentElement.setAttribute('data-shfs-bpm', '');
  let baseStyle = document.getElementById('shfs-bpm-style');
  if (!baseStyle) { baseStyle = document.createElement('style'); baseStyle.id = 'shfs-bpm-style'; document.head.appendChild(baseStyle); }
  if (baseStyle.textContent !== ${quote(baseCssForSteam)}) baseStyle.textContent = ${quote(baseCssForSteam)};
  let style = document.getElementById('shfs-runtime-style');
  if (!style) { style = document.createElement('style'); style.id = 'shfs-runtime-style'; document.head.appendChild(style); }
  if (style.textContent !== ${quote(cssForSteam)}) style.textContent = ${quote(cssForSteam)};
  const ready = document.querySelector('.' + CSS.escape(window.__shfsClasses.gamepadhome_RecentSection_39tNv || '_39tNvaLedsTrVh0fFsP4Jm'));
  if (!ready) { window.__switchHome?.dispose(); return { outsideHome: location.pathname }; }
  if (window.__switchHome?.status().mounted) {
    if (window.__switchHome.version === ${quote(runtimeVersion)}) return window.__switchHome.sync();
    window.__switchHome.dispose();
  }
  document.documentElement.dataset.shfsPending = 'true';
  setTimeout(() => { delete document.documentElement.dataset.shfsPending; }, 2000);
  try { return ${runtimeSource}; }
  catch (error) { delete document.documentElement.dataset.shfsPending; throw error; }
  };
  if (window.__shfsRouteWatch?.version !== ${quote(runtimeVersion)}) {
    window.__shfsRouteWatch?.observer.disconnect();
    const watch = { version: ${quote(runtimeVersion)}, section: document.querySelector(sectionSelector) };
    watch.observer = new MutationObserver(() => {
      const section = document.querySelector(sectionSelector);
      if (section === watch.section) return;
      watch.section = section;
      queueMicrotask(() => { try { apply(); } catch (error) { console.warn('Switch Home mount failed', error); } });
    });
    watch.observer.observe(document.documentElement, { childList: true, subtree: true });
    window.__shfsRouteWatch = watch;
  }
  return apply();
})()`;

function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
async function log(message) {
  try { await fs.appendFile(logFile, `[${new Date().toISOString()}] ${message}\n`, 'utf8'); } catch {}
}
async function evaluateTarget() {
  const targets = await fetch(endpoint, { signal: AbortSignal.timeout(2500) }).then(response => response.json());
  const target = targets.find(item => item.type === 'page' && item.title?.includes('Big Picture'));
  if (!target) return { waiting: 'Steam Big Picture target' };
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(Error('CDP websocket open timed out')), 2500);
    socket.addEventListener('open', () => { clearTimeout(timer); resolve(); }, { once: true });
    socket.addEventListener('error', event => { clearTimeout(timer); reject(Error(String(event.message || 'CDP websocket error'))); }, { once: true });
  });
  try {
    const result = await new Promise((resolve, reject) => {
      const id = 1;
      const timer = setTimeout(() => reject(Error('Steam renderer evaluation timed out')), 4000);
      const onMessage = event => {
        const message = JSON.parse(event.data);
        if (message.id !== id) return;
        clearTimeout(timer);
        socket.removeEventListener('message', onMessage);
        if (message.error) reject(Error(JSON.stringify(message.error)));
        else if (message.result?.exceptionDetails) reject(Error(message.result.exceptionDetails.exception?.description || message.result.exceptionDetails.text));
        else resolve(message.result?.result?.value);
      };
      socket.addEventListener('message', onMessage);
      socket.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression: injectExpression, returnByValue: true, awaitPromise: true } }));
    });
    return result;
  } finally { socket.close(); }
}

await log(`watcher started; theme=${themeRoot}`);
let lastState = '';
let lastError = '';
for (;;) {
  try {
    const state = await evaluateTarget();
    const summary = state?.mounted ? `mounted:${state.version}:${state.stage}` : state?.outsideHome ? 'outside-home' : state?.waiting || JSON.stringify(state);
    if (summary !== lastState) { await log(summary); lastState = summary; }
    lastError = '';
  } catch (error) {
    const message = String(error?.stack || error);
    if (message !== lastError) { await log(`retrying after error: ${message}`); lastError = message; }
  }
  await delay(900);
}
