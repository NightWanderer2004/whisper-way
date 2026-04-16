import fs from 'node:fs/promises'
import { execSync } from 'node:child_process'
import path from 'node:path'

const repoRoot = process.cwd()

const SKIP_PATH_PREFIXES = ['.next/', 'node_modules/', '.git/']

const KEY_LIKE_PATTERNS = [
   {
      name: 'OpenAI key (sk-...)',
      regex: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/g,
   },
]

const FORBIDDEN_PATTERNS = [
   {
      name: 'OpenAI browser mode (dangerouslyAllowBrowser)',
      regex: /\bdangerouslyAllowBrowser\b/g,
   },
]

function shouldSkip(filePath) {
   const normalized = filePath.replaceAll(path.sep, '/')
   return SKIP_PATH_PREFIXES.some(prefix => normalized.startsWith(prefix))
}

function isTextFile(filePath) {
   const lower = filePath.toLowerCase()
   return (
      lower.endsWith('.js') ||
      lower.endsWith('.jsx') ||
      lower.endsWith('.ts') ||
      lower.endsWith('.tsx') ||
      lower.endsWith('.mjs') ||
      lower.endsWith('.cjs') ||
      lower.endsWith('.json') ||
      lower.endsWith('.md') ||
      lower.endsWith('.txt') ||
      lower.endsWith('.yml') ||
      lower.endsWith('.yaml') ||
      lower.endsWith('.css') ||
      lower.endsWith('.html') ||
      lower.endsWith('.env') ||
      lower.includes('.env.')
   )
}

function getTrackedFiles() {
   const out = execSync('git ls-files -z', { stdio: ['ignore', 'pipe', 'ignore'] })
   return out
      .toString('utf8')
      .split('\0')
      .map(s => s.trim())
      .filter(Boolean)
}

const files = getTrackedFiles().filter(f => !shouldSkip(f)).filter(isTextFile)

const findings = []

for (const file of files) {
   if (file === 'scripts/check-secrets.mjs') continue
   const fullPath = path.join(repoRoot, file)
   let content
   try {
      content = await fs.readFile(fullPath, 'utf8')
   } catch {
      continue
   }

   for (const { name, regex } of [...KEY_LIKE_PATTERNS, ...FORBIDDEN_PATTERNS]) {
      const matches = content.match(regex)
      if (!matches?.length) continue
      findings.push({
         file,
         name,
         count: matches.length,
      })
   }
}

if (findings.length) {
   console.error('Potential secrets / unsafe config found:\n')
   for (const f of findings) {
      console.error(`- ${f.file}: ${f.name} (${f.count})`)
   }
   console.error('\nFix and re-run `npm run check:secrets`.')
   process.exit(1)
}

console.log('OK: no obvious secrets found in tracked files.')
