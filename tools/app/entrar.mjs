// Entra no app SoftPay na aba que JÁ EXISTE no Chrome do agente (porta 9333), com a
// conta do cofre (~/.claude/credenciais/softpay.md). Autorizado pelo Victor em
// 25/09/2026 ("tu sabe a senha ... FAÇA"). A senha é lida do cofre e nunca impressa.
// Nenhuma página ou contexto novo; o navegador nunca é fechado.
// uso: node tools/app/entrar.mjs [--so-olhar]   (depois: node tools/app/capturar-tela.mjs /relatorios saida.png --y=214)
import fs from 'node:fs';
import os from 'node:os';
import { chromium } from '/Users/victorgabryellferreiraqueiroz/.jarvis/design-engine/node_modules/playwright/index.mjs';

const soOlhar = process.argv.includes('--so-olhar');
const cofre = fs.readFileSync(os.homedir() + '/.claude/credenciais/softpay.md', 'utf8');
const bloco = cofre.split('## Acesso ao sistema')[1] || '';
const email = (bloco.match(/E-mail:\s*`?([^`\s]+)`?/) || [])[1];
const senha = (bloco.match(/Senha:\s*`?([^`\n]+?)`?\s*$/m) || [])[1];
if (!email || !senha) { console.log('cofre sem e-mail/senha no bloco "Acesso ao sistema"'); process.exit(2); }

const nav = await chromium.connectOverCDP('http://127.0.0.1:9333', { timeout: 60000 });
const ctx = nav.contexts()[0];
const aba = ctx.pages().find((p) => p.url().includes('www.softpaybr.com'));
if (!aba) { console.log('nenhuma aba do app aberta'); process.exit(2); }
console.log('aba', aba.url());

// o formulário, sem valores
const campos = await aba.evaluate(() => [...document.querySelectorAll('input, button')].map((e) => ({
  tag: e.tagName, type: e.type, name: e.name, id: e.id, ph: e.placeholder, txt: (e.innerText || '').trim().slice(0, 30),
  vis: !!(e.offsetWidth || e.offsetHeight),
})));
console.log(JSON.stringify(campos.filter((c) => c.vis)));
if (soOlhar) process.exit(0);

// o login é em dois passos: e-mail → "Continuar" → senha
await aba.locator('#porta-email, input[type="email"]').first().fill(email);
await aba.locator('button:has-text("Continuar")').first().click();
const campoSenha = aba.locator('input[type="password"]').first();
await campoSenha.waitFor({ state: 'visible', timeout: 20000 });
console.log('passo 2:', JSON.stringify(await aba.evaluate(() => [...document.querySelectorAll('button')]
  .filter((b) => b.offsetWidth).map((b) => (b.innerText || '').trim().slice(0, 30)))));
await campoSenha.fill(senha);
// o Turnstile da Cloudflare resolve sozinho (sem clique) e grava o token num campo
// escondido; "Entrar" antes disso não envia (Enter também não)
await aba.waitForFunction(() => [...document.querySelectorAll('input[name="cf-turnstile-response"]')].some((i) => i.value), null, { timeout: 45000 })
  .catch(() => console.log('Turnstile sem token em 45 s; tento assim mesmo'));
await aba.getByRole('button', { name: 'Entrar', exact: true }).click();
try {
  await aba.waitForURL((u) => !/\/auth|\/login/.test(u.toString()), { timeout: 30000 });
} catch {
  const aviso = await aba.evaluate(() => [...document.querySelectorAll('[role="alert"], [data-sonner-toast], .text-destructive, .error')]
    .map((e) => e.innerText.trim()).filter(Boolean).join(' | '));
  console.log('continua no login; aviso na tela:', aviso || '(nenhum)');
}
await aba.waitForTimeout(2500);
console.log('url', aba.url(), 'titulo', await aba.title());
process.exit(0);
