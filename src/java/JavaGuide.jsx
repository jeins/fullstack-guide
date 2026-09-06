import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileCode2,
  FlaskConical,
  LoaderCircle,
} from 'lucide-react';

const MANIFEST_URL = '/api/java-guide/manifest';
const fileUrl = (filePath) => `/api/java-guide/file?path=${encodeURIComponent(filePath)}`;

export function useJavaGuide() {
  const [manifest, setManifest] = useState(null);
  const [moduleId, setModuleId] = useState(null);
  const [view, setView] = useState('lesson');
  const [selectedPaths, setSelectedPaths] = useState({ lesson: null, code: null, test: null });
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch(MANIFEST_URL)
      .then((response) => {
        if (!response.ok) throw new Error('Manifest materi Java tidak dapat dibaca.');
        return response.json();
      })
      .then((data) => {
        if (cancelled) return;
        setManifest(data);
        setModuleId(data.modules[0]?.id ?? null);
        setLoading(false);
      })
      .catch((reason) => {
        if (cancelled) return;
        setError(reason.message);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const selectedModule = useMemo(
    () => manifest?.modules.find((module) => module.id === moduleId) ?? manifest?.modules[0] ?? null,
    [manifest, moduleId],
  );

  useEffect(() => {
    if (!selectedModule) return;
    setSelectedPaths((current) => ({
      lesson: selectedModule.lessons.some((lesson) => lesson.path === current.lesson)
        ? current.lesson
        : selectedModule.lessons[0]?.path ?? selectedModule.overviewPath,
      code: selectedModule.examples.includes(current.code) ? current.code : selectedModule.examples[0] ?? null,
      test: selectedModule.tests.includes(current.test) ? current.test : selectedModule.tests[0] ?? null,
    }));
    setView((current) => {
      if (current === 'code' && selectedModule.examples.length) return current;
      if (current === 'test' && selectedModule.tests.length) return current;
      return 'lesson';
    });
  }, [selectedModule]);

  const activePath = selectedPaths[view];

  useEffect(() => {
    if (!activePath) {
      setContent('');
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError('');
    fetch(fileUrl(activePath), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('File materi Java tidak dapat dibaca.');
        return response.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((reason) => {
        if (reason.name === 'AbortError') return;
        setError(reason.message);
        setLoading(false);
      });
    return () => controller.abort();
  }, [activePath]);

  const selectModule = (nextModuleId) => setModuleId(nextModuleId);
  const selectPath = (kind, nextPath) => {
    setSelectedPaths((current) => ({ ...current, [kind]: nextPath }));
    setView(kind);
  };

  const restoreState = (state) => {
    if (!manifest || !state) return false;
    const targetModule = manifest.modules.find((module) => module.id === state.moduleId);
    if (!targetModule) return false;

    const validPaths = {
      lesson: targetModule.lessons.map((lesson) => lesson.path),
      code: targetModule.examples,
      test: targetModule.tests,
    };
    const targetView = ['lesson', 'code', 'test'].includes(state.view) && validPaths[state.view].length
      ? state.view
      : 'lesson';
    const defaults = {
      lesson: targetModule.lessons[0]?.path ?? targetModule.overviewPath,
      code: targetModule.examples[0] ?? null,
      test: targetModule.tests[0] ?? null,
    };
    const restoredPath = validPaths[targetView].includes(state.path) ? state.path : defaults[targetView];

    setModuleId(targetModule.id);
    setSelectedPaths({ ...defaults, [targetView]: restoredPath });
    setView(targetView);
    return true;
  };

  return {
    manifest,
    selectedModule,
    selectedPaths,
    view,
    content,
    loading,
    error,
    setView,
    selectModule,
    selectPath,
    restoreState,
  };
}

export function JavaSidebar({ guide, query, onNavigate }) {
  const { manifest, selectedModule, selectModule } = guide;
  if (!manifest) return <div className="empty-mini">Memuat katalog Java…</div>;

  const term = query.trim().toLowerCase();
  const visibleModules = manifest.modules.filter((module) => {
    if (!term) return true;
    return [module.title, module.slug, ...module.lessons.map((lesson) => lesson.title)]
      .join(' ')
      .toLowerCase()
      .includes(term);
  });

  return (
    <div className="java-nav">
      {manifest.categories.map((category) => {
        const modules = visibleModules.filter((module) => module.categoryId === category.id);
        if (!modules.length) return null;
        const isCurrentCategory = modules.some((module) => module.id === selectedModule?.id);
        return (
          <details className="java-nav-group" key={category.id} open={isCurrentCategory || Boolean(term)}>
            <summary>
              <span>{category.title}</span>
              <small>{modules.length}</small>
            </summary>
            <div className="java-nav-modules">
              {modules.map((module) => (
                <button
                  type="button"
                  key={module.id}
                  className={`java-nav-module ${module.id === selectedModule?.id ? 'active' : ''}`}
                  onClick={() => {
                    selectModule(module.id);
                    onNavigate();
                  }}
                >
                  <span>{String(module.number).padStart(2, '0')}</span>
                  <strong>{module.title}</strong>
                </button>
              ))}
            </div>
          </details>
        );
      })}
      {!visibleModules.length && <div className="empty-mini">Topik Java tidak ditemukan.</div>}
    </div>
  );
}

function FileSelect({ label, value, files, onChange }) {
  if (!files.length) return null;
  return (
    <label className="java-file-select">
      <span>{label}</span>
      <select value={value ?? ''} onChange={(event) => onChange(event.target.value)}>
        {files.map((filePath) => (
          <option key={filePath} value={filePath}>{filePath.split('/').at(-1)}</option>
        ))}
      </select>
    </label>
  );
}

function MarkdownContent({ source }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([import('dompurify'), import('marked')]).then(([domPurifyModule, markedModule]) => {
      if (cancelled) return;
      const sanitized = domPurifyModule.default.sanitize(markedModule.marked.parse(source, { gfm: true }));
      setHtml(sanitized);
    });
    return () => { cancelled = true; };
  }, [source]);

  return <div className="java-markdown" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function JavaContent({ guide }) {
  const {
    manifest,
    selectedModule,
    selectedPaths,
    view,
    content,
    loading,
    error,
    setView,
    selectModule,
    selectPath,
  } = guide;

  if (!manifest || !selectedModule) {
    return (
      <section className="card java-status">
        {error ? <AlertTriangle size={22} /> : <LoaderCircle className="spin" size={22} />}
        <p>{error || 'Memuat materi Java dari folder lokal…'}</p>
      </section>
    );
  }

  const category = manifest.categories.find((item) => item.id === selectedModule.categoryId);
  const moduleIndex = manifest.modules.findIndex((module) => module.id === selectedModule.id);
  const previousModule = manifest.modules[moduleIndex - 1];
  const nextModule = manifest.modules[moduleIndex + 1];
  const fileOptions = view === 'lesson'
    ? selectedModule.lessons
    : (view === 'code' ? selectedModule.examples : selectedModule.tests).map((filePath) => ({ path: filePath }));

  return (
    <>
      <section className="card java-article">
        <div className="meta">
          <span className="badge">Modul {String(selectedModule.number).padStart(2, '0')}</span>
          <span className="badge mobile-hide">{category?.title}</span>
          <span className="badge">Java 21</span>
        </div>

        <h3>{selectedModule.title}</h3>
        <p className="short-desc">
          {selectedModule.lessons.length} subtopik · {selectedModule.examples.length} contoh Java · {selectedModule.tests.length} unit test · sekitar {selectedModule.readingMinutes} menit materi lengkap
        </p>

        <div className="java-view-tabs" role="tablist" aria-label="Jenis konten Java">
          <button className={view === 'lesson' ? 'active' : ''} onClick={() => setView('lesson')}><BookOpen size={16} /> Materi</button>
          <button disabled={!selectedModule.examples.length} className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}><FileCode2 size={16} /> Contoh</button>
          <button disabled={!selectedModule.tests.length} className={view === 'test' ? 'active' : ''} onClick={() => setView('test')}><FlaskConical size={16} /> Test</button>
        </div>

        <FileSelect
          label={view === 'lesson' ? 'Subtopik' : view === 'code' ? 'File contoh' : 'File test'}
          value={selectedPaths[view]}
          files={fileOptions.map((item) => item.path)}
          onChange={(nextPath) => selectPath(view, nextPath)}
        />

        {loading && <div className="java-status"><LoaderCircle className="spin" size={20} /> Memuat file…</div>}
        {!loading && error && <div className="java-status error"><AlertTriangle size={20} /> {error}</div>}
        {!loading && !error && view === 'lesson' && <MarkdownContent source={content} />}
        {!loading && !error && view !== 'lesson' && (
          <div className="code-block java-source-code">
            <div className="code-head"><span>{selectedPaths[view]?.split('/').at(-1)}</span></div>
            <pre><code>{content}</code></pre>
          </div>
        )}

        <footer className="java-attribution">
          Materi diadaptasi dari{' '}
          <a href={manifest.source.url} target="_blank" rel="noreferrer">{manifest.source.title} <ExternalLink size={13} /></a>
          {' '}oleh {manifest.source.creator}, berdasarkan <a href={manifest.source.licenseUrl} target="_blank" rel="noreferrer">{manifest.source.license}</a>.
        </footer>
      </section>

      <section className="java-module-pagination card-lite">
        <button disabled={!previousModule} onClick={() => previousModule && selectModule(previousModule.id)}>
          <ChevronLeft size={16} />
          <span><small>Sebelumnya</small>{previousModule?.title ?? 'Awal kurikulum'}</span>
        </button>
        <button disabled={!nextModule} onClick={() => nextModule && selectModule(nextModule.id)}>
          <span><small>Berikutnya</small>{nextModule?.title ?? 'Kurikulum selesai'}</span>
          <ChevronRight size={16} />
        </button>
      </section>
    </>
  );
}
