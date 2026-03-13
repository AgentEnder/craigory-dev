import { useEffect, useRef, useCallback } from 'react';
import { generateTypeDeclaration } from '../src/type-generator';

interface TypeScriptEditorProps {
  jsonData: unknown;
  onResult: (result: unknown) => void;
  onError: (error: string | null) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AceEditor = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AceLanguageProvider = any;

const DEFAULT_CODE = `export default function transform(data: DataType) {
  return data;
}
`;

export function TypeScriptEditor({
  jsonData,
  onResult,
  onError,
}: TypeScriptEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const aceEditorRef = useRef<AceEditor>(null);
  const languageProviderRef = useRef<AceLanguageProvider>(null);
  const typeVersionRef = useRef(0);
  const autoRunTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const runTransformRef = useRef<() => void>(() => {});

  // Update ambient types when jsonData changes
  useEffect(() => {
    if (!languageProviderRef.current) return;
    typeVersionRef.current += 1;
    const typeDecl = generateTypeDeclaration(jsonData);
    languageProviderRef.current.setGlobalOptions('typescript', {
      extraLibs: {
        'file:///ambient.d.ts': {
          content: typeDecl,
          version: typeVersionRef.current,
        },
      },
    });
  }, [jsonData]);

  useEffect(() => {
    let mounted = true;

    async function initEditor() {
      const ace = await import('ace-code');
      const tsMode = await import('ace-code/src/mode/typescript');
      const chromeTheme = await import('ace-code/src/theme/chrome');
      await import('ace-code/src/ext/language_tools');
      const { LanguageProvider } = await import(
        'ace-linters/build/ace-linters'
      );

      if (!mounted || !editorRef.current) return;

      // Create editor without string-based mode/theme to avoid
      // ace's internal module loader ("loader is not configured")
      const editor = ace.edit(editorRef.current, {
        fontSize: 13,
        showPrintMargin: false,
        tabSize: 2,
        useSoftTabs: true,
        wrap: true,
        minLines: 8,
        maxLines: 20,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
      });

      // Set mode and theme directly via object references
      editor.session.setMode(new tsMode.Mode());
      editor.setTheme(chromeTheme);

      editor.setValue(DEFAULT_CODE, -1);

      // Set up ace-linters with custom worker that registers the TypeScript service
      try {
        const worker = new Worker(
          new URL('../src/typescript-worker.ts', import.meta.url),
          { type: 'module' }
        );
        const languageProvider = LanguageProvider.create(worker);
        languageProvider.registerEditor(editor);

        // Feed ambient type declarations via global options
        // (extraLibs is read from globalOptions, not per-document options)
        typeVersionRef.current += 1;
        const typeDecl = generateTypeDeclaration(jsonData);
        languageProvider.setGlobalOptions('typescript', {
          extraLibs: {
            'file:///ambient.d.ts': {
              content: typeDecl,
              version: typeVersionRef.current,
            },
          },
        });

        languageProviderRef.current = languageProvider;
      } catch (e) {
        console.warn(
          'ace-linters setup failed, continuing without intellisense:',
          e
        );
      }

      // Auto-run transform when annotations change and there are no errors
      editor.session.on('changeAnnotation', () => {
        const annotations = editor.session.getAnnotations() || [];
        const hasErrors = annotations.some(
          (a: { type: string }) => a.type === 'error'
        );
        if (!hasErrors) {
          clearTimeout(autoRunTimerRef.current);
          autoRunTimerRef.current = setTimeout(() => {
            runTransformRef.current();
          }, 500);
        }
      });

      aceEditorRef.current = editor;
    }

    initEditor();

    return () => {
      mounted = false;
      if (aceEditorRef.current) {
        aceEditorRef.current.destroy();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep ref in sync so the annotation listener always calls the latest version
  const runTransform = useCallback(async () => {
    if (!aceEditorRef.current) return;
    const code = aceEditorRef.current.getValue();

    try {
      // Transpile TypeScript to JavaScript (CommonJS so we can extract exports)
      const ts = await import('typescript');
      const transpiled = ts.transpileModule(code, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.CommonJS,
          strict: false,
          esModuleInterop: true,
        },
      });

      // Execute the transpiled code — CommonJS wraps `export default` as
      // `exports.default = ...` so we can extract the transform function
      const exports: Record<string, unknown> = {};
      const fn = new Function('exports', transpiled.outputText);
      fn(exports);

      const transform = exports.default;
      if (typeof transform !== 'function') {
        onError('Module must have a default export function');
        return;
      }

      const result = transform(jsonData);
      onResult(result);
      onError(null);
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Execution error');
    }
  }, [jsonData, onResult, onError]);

  runTransformRef.current = runTransform;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium text-gray-500">
          TypeScript transform
        </label>
        <button
          onClick={runTransform}
          className="bg-black text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-800 transition-all duration-200 active:scale-95"
        >
          Run
        </button>
      </div>
      <div
        ref={editorRef}
        className="w-full border border-gray-200 rounded-xl overflow-hidden"
        style={{ minHeight: '200px' }}
      />
    </div>
  );
}
