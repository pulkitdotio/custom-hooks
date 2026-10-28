import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Braces,
  Check,
  ChevronRight,
  Code2,
  GitFork,
  Moon,
  Search,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { hooks, repository } from './examples/catalog';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useEventListener } from './hooks/useEventListener';
import { CodeBlock } from './components/CodeBlock';

const categories = ['State', 'Values & timing', 'Browser'] as const;
function currentHook() {
  const name =
    typeof window === 'undefined' ? '' : window.location.hash.slice(1);
  return hooks.find((hook) => hook.name === name)?.name ?? 'useToggle';
}

export default function App() {
  const [active, setActive] = useState(currentHook);
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>(
    'custom-hooks:theme',
    'dark',
  );
  const activeIndex = Math.max(
    0,
    hooks.findIndex((hook) => hook.name === active),
  );
  const hook = hooks[activeIndex]!;
  const Demo = hook.Demo;
  const filtered = hooks.filter((item) =>
    `${item.name} ${item.category} ${item.description}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme === 'light' ? 'light' : 'dark';
  }, [theme]);
  useEventListener('hashchange', () => {
    const selected = hooks.find(
      (item) => item.name === window.location.hash.slice(1),
    );
    if (selected) setActive(selected.name);
  });

  function select(name: string) {
    setActive(name);
    window.location.hash = name;
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to playground
      </a>
      <header className="site-header">
        <a
          href="#useToggle"
          className="brand"
          onClick={(event) => {
            event.preventDefault();
            select('useToggle');
          }}
          aria-label="Custom Hooks home"
        >
          <span className="brand-icon">
            <Braces size={23} strokeWidth={2} />
          </span>
          <span>
            Custom Hooks<span className="text-accent">.</span>
          </span>
        </a>
        <span className="header-caption">Little helpers. Better React.</span>
        <div className="header-actions">
          <a
            className="button github-button"
            href={repository}
            target="_blank"
            rel="noreferrer"
            aria-label="View on GitHub"
          >
            <GitFork size={16} />
            <span>View on GitHub</span>
            <ArrowUpRight size={13} className="muted" />
          </a>
          <span className="header-divider" />
          <button
            type="button"
            className="theme-button"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            onClick={() =>
              setTheme((value) => (value === 'dark' ? 'light' : 'dark'))
            }
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <div className="page-layout">
        <aside className="sidebar" aria-label="Hook collection">
          <div className="sidebar-heading">
            <span className="small-label">THE COLLECTION</span>
            <span className="count-badge">10</span>
          </div>
          <div className="search-field">
            <Search size={15} />
            <input
              aria-label="Search hooks"
              placeholder="Find a hook…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch('')}
              >
                <X size={13} />
              </button>
            ) : (
              <span className="search-hint" aria-hidden="true">
                ⌕
              </span>
            )}
          </div>
          <nav aria-label="Hooks">
            {categories.map((category) => {
              const entries = filtered.filter(
                (item) => item.category === category,
              );
              return (
                entries.length > 0 && (
                  <div className="nav-group" key={category}>
                    <h2>{category}</h2>
                    {entries.map((item) => (
                      <a
                        href={`#${item.name}`}
                        onClick={(event) => {
                          event.preventDefault();
                          select(item.name);
                        }}
                        key={item.name}
                        className={`nav-link ${active === item.name ? 'active' : ''}`}
                        aria-current={active === item.name ? 'page' : undefined}
                      >
                        <span className="nav-index">
                          {String(hooks.indexOf(item) + 1).padStart(2, '0')}
                        </span>
                        <span>{item.name}</span>
                        {active === item.name && <ChevronRight size={13} />}
                      </a>
                    ))}
                  </div>
                )
              );
            })}
            {filtered.length === 0 && (
              <div className="empty-search">
                <p>No hooks found.</p>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => setSearch('')}
                >
                  Clear search
                </button>
              </div>
            )}
          </nav>
          <div className="sidebar-footer">
            <span className="tiny-icon">
              <Code2 size={17} />
            </span>
            <p>
              Less boilerplate.
              <br />
              <strong>More building.</strong>
            </p>
            <span className="sidebar-footnote">
              TypeScript · React · Yours to explore
            </span>
          </div>
        </aside>

        <main className="main-content" id="main-content" tabIndex={-1}>
          <div className="intro-line">
            <span>
              <span className="status-dot" />A practical collection for everyday
              React
            </span>
            <a
              href={`${repository}#getting-started`}
              target="_blank"
              rel="noreferrer"
            >
              Getting started
              <ArrowUpRight size={12} />
            </a>
          </div>
          <div className="breadcrumb">
            <span>Hooks</span>
            <ChevronRight size={12} />
            <span>{hook.category}</span>
            <ChevronRight size={12} />
            <span className="font-mono">{hook.name}</span>
          </div>
          <div className="hook-heading">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1>
                  {hook.name}
                  <span className="heading-parentheses">()</span>
                </h1>
                <span className="category-badge">{hook.category}</span>
              </div>
              <p>{hook.description}</p>
            </div>
            <a
              className="docs-link"
              href={`${repository}/blob/main/docs/hooks/${hook.name}.md`}
              target="_blank"
              rel="noreferrer"
            >
              <BookOpen size={15} />
              Read docs
              <ArrowUpRight size={13} />
            </a>
          </div>

          <section
            className="playground-section"
            aria-labelledby="playground-title"
          >
            <div className="section-heading">
              <h2 id="playground-title">
                <span className="section-icon">
                  <Sparkles size={15} />
                </span>
                Playground
              </h2>
              <span className="live-badge">
                <span className="status-dot" />
                LIVE EXAMPLE
              </span>
            </div>
            <div className="playground-card">
              <div className="demo-area">
                <Demo key={hook.name} />
              </div>
              <div className="demo-explainer">
                <span className="small-label">GIVE IT A TRY</span>
                <h3>{hook.hint}</h3>
                <p>{hook.detail}</p>
                <div className="real-hook-note">
                  <Check size={13} />
                  Runs the actual hook
                </div>
              </div>
            </div>
          </section>

          <section className="usage-section" aria-labelledby="usage-title">
            <div className="section-heading">
              <h2 id="usage-title">
                <Code2 size={17} />
                In your code
              </h2>
              <a
                className="text-link"
                href={`${repository}/blob/main/src/hooks/${hook.name}.ts`}
                target="_blank"
                rel="noreferrer"
              >
                View hook source
                <ArrowUpRight size={12} />
              </a>
            </div>
            <CodeBlock code={hook.code} key={hook.name} />
          </section>
          <div className="api-summary">
            <div>
              <span className="small-label">PARAMETERS</span>
              <code>{hook.parameters}</code>
            </div>
            <div>
              <span className="small-label">RETURNS</span>
              <code>{hook.returns}</code>
            </div>
          </div>
          <p className="copy-note">
            <ArrowDown size={13} />
            Copy the hook file into your project, then adjust the import path.
            <a
              href={`${repository}#reusing-a-hook`}
              target="_blank"
              rel="noreferrer"
            >
              How to use
              <ArrowUpRight size={11} />
            </a>
          </p>
          <footer className="content-footer">
            <span>
              {String(activeIndex + 1).padStart(2, '0')}
              <span className="muted"> / 10 hooks</span>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="button"
                disabled={activeIndex === 0}
                onClick={() => select(hooks[activeIndex - 1]!.name)}
              >
                <ArrowLeft size={14} />
                Previous
              </button>
              <button
                type="button"
                className="button"
                disabled={activeIndex === hooks.length - 1}
                onClick={() => select(hooks[activeIndex + 1]!.name)}
              >
                Next hook
                <ArrowRight size={14} />
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
