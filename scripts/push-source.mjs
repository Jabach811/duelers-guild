import { spawnSync } from 'node:child_process';

// Credentials arrive over stdin, never through argv, a file, or Git configuration.
if (process.stdin.isTTY) process.stdin.setRawMode(true);
process.stdin.setEncoding('utf8');
process.stdin.resume();
let input = '';
console.log('Ready for short-lived repository authentication.');
const receive = chunk => {
  input += chunk;
  if (input.includes('\u0003')) process.exit(130);
  const lineEnd = input.search(/[\r\n]/);
  if (lineEnd === -1) return;
  process.stdin.removeListener('data', receive);
  process.stdin.pause();
  const line = input.slice(0, lineEnd).trim();
  let credential;
  try { credential = JSON.parse(line); } catch { console.error('Invalid repository input.'); process.exit(1); }
  if (!credential.token || !credential.remote_url || !credential.branch || credential.auth_mode !== 'http_extra_header') {
    console.error('Unsupported repository credential.'); process.exit(1);
  }
  const result = spawnSync('git', ['-c', `safe.directory=${process.cwd().replaceAll('\\', '/')}`, 'push', credential.remote_url, `HEAD:refs/heads/${credential.branch}`], {
    encoding:'utf8', timeout:120000,
    env:{ ...process.env, GIT_TERMINAL_PROMPT:'0', GIT_CONFIG_COUNT:'1', GIT_CONFIG_KEY_0:'http.extraHeader', GIT_CONFIG_VALUE_0:`Authorization: Bearer ${credential.token}` }
  });
  const safe = value => String(value || '').split(credential.token).join('[redacted]');
  if (result.stdout) process.stdout.write(safe(result.stdout));
  if (result.stderr) process.stderr.write(safe(result.stderr));
  if (result.error) console.error(safe(result.error.message));
  process.exit(result.status ?? 1);
};
process.stdin.on('data', receive);
