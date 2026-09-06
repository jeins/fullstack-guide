import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'

const allowedHosts = (process.env.API_GUIDE_ALLOWED_HOSTS ?? '')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean)

const javaSourceRoot = path.resolve(
  process.env.JAVA_GUIDE_SOURCE ?? '/root/Claude-senior-java-engineer',
)

const readingStateFile = path.resolve(
  process.env.API_GUIDE_READING_STATE_FILE
    ?? path.join(process.env.XDG_STATE_HOME ?? '/root/.local/state', 'api-guide', 'reading-state.json'),
)

const javaCategories = [
  { id: 'fundamentals', title: 'Java Fundamentals', from: 1, to: 5 },
  { id: 'oop', title: 'Object-Oriented Java', from: 6, to: 10 },
  { id: 'exceptions', title: 'Exception Handling', from: 11, to: 12 },
  { id: 'functional', title: 'Functional Java & Streams', from: 13, to: 16 },
  { id: 'memory-model', title: 'Java Memory Model', from: 17, to: 19 },
  { id: 'concurrency', title: 'Concurrency & Virtual Threads', from: 20, to: 26 },
  { id: 'modern-java', title: 'Modern Java 8–21', from: 27, to: 30 },
  { id: 'principles', title: 'Engineering Principles', from: 31, to: 35 },
  { id: 'patterns', title: 'Design Patterns', from: 36, to: 38 },
  { id: 'production', title: 'JVM & Production Java', from: 39, to: 45 },
]

function extractTitle(filePath, fallback) {
  if (!existsSync(filePath)) return fallback
  const match = readFileSync(filePath, 'utf8').match(/^#\s+(.+)$/m)
  return match?.[1]?.replace(/^\d+(?:\.\d+)*\.?\s*/, '').trim() || fallback
}

function listFiles(root, extension) {
  if (!existsSync(root)) return []
  return readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => path.relative(javaSourceRoot, path.join(entry.parentPath, entry.name)).split(path.sep).join('/'))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
}

function createJavaManifest() {
  if (!existsSync(javaSourceRoot)) {
    throw new Error(`Java guide source is unavailable: ${javaSourceRoot}`)
  }
  const modules = readdirSync(javaSourceRoot, { withFileTypes: true })
    .filter((entry) => {
      const number = Number(entry.name.slice(0, 2))
      return entry.isDirectory() && /^\d{2}-/.test(entry.name) && number >= 1 && number <= 45
    })
    .map((entry) => {
      const number = Number(entry.name.slice(0, 2))
      const moduleRoot = path.join(javaSourceRoot, entry.name)
      const overviewPath = `${entry.name}/README.md`
      const lessons = readdirSync(moduleRoot)
        .filter((name) => /^README_.+\.md$/.test(name))
        .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
        .map((name) => ({
          path: `${entry.name}/${name}`,
          title: extractTitle(path.join(moduleRoot, name), name.replace(/^README_|\.md$/g, '')),
        }))
      const category = javaCategories.find((item) => number >= item.from && number <= item.to)
      const wordCount = lessons.reduce((total, lesson) => {
        const filePath = path.join(javaSourceRoot, lesson.path)
        return total + readFileSync(filePath, 'utf8').trim().split(/\s+/).length
      }, 0)

      return {
        id: `J${String(number).padStart(2, '0')}`,
        number,
        slug: entry.name,
        title: extractTitle(path.join(moduleRoot, 'README.md'), entry.name.replace(/^\d{2}-/, '')),
        categoryId: category?.id ?? 'other',
        overviewPath,
        lessons,
        examples: listFiles(path.join(moduleRoot, 'src/main'), '.java'),
        tests: listFiles(path.join(moduleRoot, 'src/test'), '.java'),
        wordCount,
        readingMinutes: Math.max(1, Math.round(wordCount / 220)),
      }
    })
    .sort((left, right) => left.number - right.number)

  return {
    generatedAt: new Date().toISOString(),
    source: {
      title: 'Claude Senior Java Engineer',
      creator: 'msorkhpar',
      url: 'https://github.com/msorkhpar/Claude-senior-java-engineer',
      license: 'CC BY 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    },
    categories: javaCategories.map(({ from, to, ...category }) => ({
      ...category,
      modules: modules.filter((module) => module.categoryId === category.id).map((module) => module.id),
    })),
    modules,
  }
}

function resolveJavaFile(relativePath) {
  if (!relativePath || path.isAbsolute(relativePath) || !/\.(md|java)$/.test(relativePath)) return null
  if (!existsSync(javaSourceRoot)) return null
  const candidate = path.resolve(javaSourceRoot, relativePath)
  if (!existsSync(candidate) || !statSync(candidate).isFile()) return null
  const realRoot = realpathSync(javaSourceRoot)
  const realCandidate = realpathSync(candidate)
  return realCandidate.startsWith(`${realRoot}${path.sep}`) ? realCandidate : null
}

function sanitizeReadingState(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null

  const sectionId = typeof input.sectionId === 'string' && /^[a-z0-9-]{1,64}$/.test(input.sectionId)
    ? input.sectionId
    : null
  const topicId = typeof input.topicId === 'string' && /^[A-Za-z0-9-]{1,16}$/.test(input.topicId)
    ? input.topicId
    : null

  let java = null
  if (input.java && typeof input.java === 'object' && !Array.isArray(input.java)) {
    const moduleId = typeof input.java.moduleId === 'string' && /^J\d{2}$/.test(input.java.moduleId)
      ? input.java.moduleId
      : null
    const view = ['lesson', 'code', 'test'].includes(input.java.view) ? input.java.view : 'lesson'
    const selectedPath = typeof input.java.path === 'string'
      && input.java.path.length <= 512
      && !input.java.path.includes('\0')
      ? input.java.path
      : null
    if (moduleId) java = { moduleId, view, path: selectedPath }
  }

  if (!sectionId) return null
  return {
    version: 1,
    sectionId,
    topicId,
    java,
    updatedAt: new Date().toISOString(),
  }
}

function readReadingState() {
  if (!existsSync(readingStateFile)) return null
  try {
    return sanitizeReadingState(JSON.parse(readFileSync(readingStateFile, 'utf8')))
  } catch {
    return null
  }
}

function writeReadingState(state) {
  mkdirSync(path.dirname(readingStateFile), { recursive: true })
  const temporaryFile = `${readingStateFile}.${process.pid}.tmp`
  writeFileSync(temporaryFile, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 })
  renameSync(temporaryFile, readingStateFile)
}

function handleReadingState(request, response) {
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')

  if (request.method === 'GET') {
    response.end(JSON.stringify({ state: readReadingState() }))
    return
  }

  if (request.method !== 'PUT') {
    response.statusCode = 405
    response.setHeader('Allow', 'GET, PUT')
    response.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  let body = ''
  request.on('data', (chunk) => {
    body += chunk
    if (body.length > 8192) request.destroy()
  })
  request.on('end', () => {
    try {
      const state = sanitizeReadingState(JSON.parse(body))
      if (!state) {
        response.statusCode = 400
        response.end(JSON.stringify({ error: 'Invalid reading state' }))
        return
      }
      writeReadingState(state)
      response.end(JSON.stringify({ state }))
    } catch {
      response.statusCode = 400
      response.end(JSON.stringify({ error: 'Invalid JSON payload' }))
    }
  })
}

function javaGuidePlugin() {
  const middleware = (request, response, next) => {
    const requestUrl = new URL(request.url, 'http://localhost')
    if (requestUrl.pathname === '/api/java-guide/manifest') {
      try {
        response.setHeader('Content-Type', 'application/json; charset=utf-8')
        response.setHeader('Cache-Control', 'no-store')
        response.end(JSON.stringify(createJavaManifest()))
      } catch (error) {
        response.statusCode = 503
        response.end(JSON.stringify({ error: error.message }))
      }
      return
    }
    if (requestUrl.pathname === '/api/java-guide/file') {
      const filePath = resolveJavaFile(requestUrl.searchParams.get('path'))
      if (!filePath) {
        response.statusCode = 404
        response.end('Java guide file not found')
        return
      }
      response.setHeader('Content-Type', 'text/plain; charset=utf-8')
      response.setHeader('Cache-Control', 'no-store')
      response.end(readFileSync(filePath, 'utf8'))
      return
    }
    if (requestUrl.pathname === '/api/reading-state') {
      handleReadingState(request, response)
      return
    }
    next()
  }

  return {
    name: 'local-java-guide',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}

export default defineConfig({
  plugins: [react(), javaGuidePlugin()],
  server: {
    host: '0.0.0.0',
    port: 1234,
    allowedHosts
  }
})
