const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const COMMANDS = {
  python: (script) => ['python3', script],
  cpp: (script) => ['sh', '-c', `g++ ${script} -o /tmp/a.out && /tmp/a.out`],
  javascript: (script) => ['node', script],
  sql: (script) => ['sqlite3', ':memory:', '-init', script, '-cmd', '.quit'],
};

async function runCode(language, code, stdin) {
  const execId = uuidv4();
  const tmpDir = path.join('/tmp', execId);
  const ext = { python: 'py', cpp: 'cpp', javascript: 'js', sql: 'sql' }[language];
  const scriptPath = path.join(tmpDir, `script.${ext}`);

  fs.mkdirSync(tmpDir, { recursive: true });
  fs.writeFileSync(scriptPath, code, { mode: 0o500 }); // чтение+выполнение только владельцу

  return new Promise((resolve, reject) => {
    const cmd = COMMANDS[language](scriptPath);
    const child = spawn(cmd[0], cmd.slice(1), {
      cwd: tmpDir,
      timeout: (parseInt(process.env.EXEC_TIMEOUT || '10')) * 1000,
      env: { ...process.env, HOME: tmpDir },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });

    if (stdin) {
      child.stdin.write(stdin);
    }
    child.stdin.end();

    child.on('close', (code) => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
      resolve({
        stdout: stdout.slice(0, 1048576),
        stderr: stderr.slice(0, 1048576),
        exitCode: code,
      });
    });

    child.on('error', (err) => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
      reject(err);
    });
  });
}

module.exports = { runCode };