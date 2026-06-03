import {
  isValidElement,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';

import styles from './code-wrapper.module.scss';

interface CodeWrapperProps {
  children: ReactNode;
  filename?: string;
  /** Force-hide the copy button on this block. */
  noCopy?: boolean;
  /** Force-show the copy button even on languages that default off. */
  copy?: boolean;
}

const NON_COPYABLE_LANGUAGES = new Set([
  'text',
  'plaintext',
  'plain',
  'output',
  'console',
]);

const LANGUAGE_LABELS: Record<string, string> = {
  ini: 'ini',
  yaml: 'yaml',
  toml: 'toml',
  bash: 'bash',
  shell: 'shell',
  sh: 'sh',
  json: 'json',
  typescript: 'ts',
  ts: 'ts',
  tsx: 'tsx',
  javascript: 'js',
  js: 'js',
  jsx: 'jsx',
  text: 'text',
  plaintext: 'text',
};

function getCodeLanguage(node: ReactNode): string | undefined {
  if (!isValidElement(node)) return undefined;
  const className = (node as ReactElement<{ className?: string }>).props
    ?.className;
  if (!className) return undefined;
  const match = /(?:^|\s)language-([\w-]+)/i.exec(className);
  return match?.[1]?.toLowerCase();
}

export function CodeWrapper({
  children,
  filename,
  noCopy,
  copy,
}: CodeWrapperProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const language = getCodeLanguage(children);
  const isNonCopyable = !language || NON_COPYABLE_LANGUAGES.has(language);
  const showCopy = copy ?? (!noCopy && !isNonCopyable);
  const showLanguage = !!language && !NON_COPYABLE_LANGUAGES.has(language);
  const renderHeader = !!filename || showCopy || showLanguage;

  const handleCopy = async () => {
    const text = preRef.current?.innerText ?? '';
    try {
      await navigator.clipboard.writeText(text.replace(/\n+$/, ''));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Silently swallow — clipboard can fail under restrictive permissions.
    }
  };

  return (
    <div
      className={[
        styles['code-block'],
        renderHeader ? styles['has-header'] : '',
      ].join(' ')}
    >
      {renderHeader && (
        <div className={styles['code-header']}>
          <div className={styles['code-header-left']}>
            {showLanguage && language && (
              <span className={styles['language-pill']}>
                {LANGUAGE_LABELS[language] ?? language}
              </span>
            )}
            {filename && (
              <span className={styles['filename']}>{filename}</span>
            )}
          </div>
          {showCopy && (
            <button
              type="button"
              className={[
                styles['copy-button'],
                copied ? styles['copied'] : '',
              ].join(' ')}
              onClick={handleCopy}
              aria-label={
                copied ? 'Copied to clipboard' : 'Copy code to clipboard'
              }
            >
              {copied ? (
                <>
                  <CheckIcon />
                  Copied
                </>
              ) : (
                <>
                  <CopyIcon />
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      )}
      <pre ref={preRef} className={styles['code-wrapper']}>
        {children}
      </pre>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="5" width="9" height="9" rx="1.5" />
      <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8.5l3.5 3.5L13 5" />
    </svg>
  );
}
