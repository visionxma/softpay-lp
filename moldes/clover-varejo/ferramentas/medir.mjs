// Mede uma página no Chrome sem janela (porta 9444) por CDP puro: abre UMA aba, ajusta a largura, carrega a URL,
// roda a expressão e fecha a aba no finally. Também tira foto da página inteira (--foto <arquivo.png>).
// uso: node ferramentas/medir.mjs <url> <largura> '<expressão JS que devolve JSON>' [--foto arq.png] [--altura 900]
import { writeFileSync } from 'node:fs';

const [url, largura = '1440', expr = 'document.title', ...resto] = process.argv.slice(2);
const op = (n) => { const i = resto.indexOf(n); return i >= 0 ? resto[i + 1] : null; };
const foto = op('--foto');
const altura = Number(op('--altura') || 900);
const PORTA = process.env.PORTA_CDP || '9444';

const alvo = await (await fetch(`http://127.0.0.1:${PORTA}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(alvo.webSocketDebuggerUrl);
let id = 0; const espera = new Map(); const eventos = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && espera.has(d.id)) { espera.get(d.id)(d); espera.delete(d.id); } else if (d.method) eventos.push(d.method); };
const cdp = (method, params = {}) => new Promise((ok, falha) => {
  const n = ++id; espera.set(n, (d) => (d.error ? falha(new Error(method + ': ' + d.error.message)) : ok(d.result)));
  ws.send(JSON.stringify({ id: n, method, params }));
});
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
try {
  await new Promise((r) => { ws.onopen = r; });
  await cdp('Page.enable'); await cdp('Runtime.enable');
  await cdp('Emulation.setDeviceMetricsOverride', { width: Number(largura), height: altura, deviceScaleFactor: 1, mobile: Number(largura) < 800 });
  eventos.length = 0;
  await cdp('Page.navigate', { url });
  for (let t = 0; t < 150 && !eventos.includes('Page.loadEventFired'); t++) await pausa(100);
  await cdp('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
  await pausa(600);
  // a expressão pode devolver uma Promise (sonda que rola e espera): o await resolve antes do JSON
  const r = await cdp('Runtime.evaluate', { expression: `(async()=>JSON.stringify(await (${expr})))()`, returnByValue: true, awaitPromise: true });
  console.log(r.result?.value ?? JSON.stringify(r.exceptionDetails?.exception?.description || r));
  if (foto) {
    // a tela NÃO cresce até a altura da página: com ela crescida, a hero de 100svh viraria a página inteira.
    // Rola até o fim (carrega o preguiçoso e dispara o revelar), volta ao topo e fotografa por recorte.
    await cdp('Runtime.evaluate', { expression: `(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=innerHeight*0.6){scrollTo(0,y);await new Promise(r=>setTimeout(r,120))}scrollTo(0,0);await Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;setTimeout(r,4000)})))})()`, awaitPromise: true });
    await pausa(900);
    const { cssContentSize } = await cdp('Page.getLayoutMetrics');
    const h = Math.min(Math.ceil(cssContentSize.height), 16000);
    const { data } = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: Number(largura), height: h, scale: 1 } });
    writeFileSync(foto, Buffer.from(data, 'base64'));
    console.log(`foto ${foto} ${Number(largura)}x${h}`);
  }
} finally {
  try { ws.close(); } catch {}
  await fetch(`http://127.0.0.1:${PORTA}/json/close/${alvo.id}`).catch(() => {});
}
