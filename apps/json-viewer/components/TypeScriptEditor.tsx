import { useEffect, useRef, useCallback } from 'react';
import { generateTypeDeclaration } from '../src/type-generator';

interface TypeScriptEditorProps {
  jsonData: unknown;
  onResult: (result: unknown) => void;
  onError: (error: string | null) => void;
}

interface AceEditor {
  getValue: () => string;
  destroy: () => void;
  session: unknown;
}

interface AceLanguageProvider {
  registerEditor: (editor: AceEditor) => void;
  setDocumentOptions: (
    session: unknown,
    options: {
      extraLibs?: Record<string, { content: string; version: number }>;
    }
  ) => void;
}

export function TypeScriptEditor({
  jsonData,
  onResult,
  onError,
}: TypeScriptEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const aceEditorRef = useRef<AceEditor | null>(null);
  const languageProviderRef = useRef<AceLanguageProvider | null>(null);
  const typeVersionRef = useRef(0);

  // Update ambient types when jsonData changes
  useEffect(() => {
    if (!aceEditorRef.current || !languageProviderRef.current) return;
    typeVersionRef.current += 1;
    const typeDecl = generateTypeDeclaration(jsonData);
    languageProviderRef.current.setDocumentOptions(
      aceEditorRef.current.session,
      {
        extraLibs: {
          'file:///ambient.d.ts': {
            content: typeDecl,
            version: typeVersionRef.current,
          },
        },
      }
    );
  }, [jsonData]);

  useEffect(() => {
    let mounted = true;

    async function initEditor() {
      const ace = await import('ace-code');
      await import('ace-code/src/mode/typescript');
      await import('ace-code/src/theme/chrome');
      const { LanguageProvider } = await import(
        'ace-linters/build/ace-linters'
      );

      if (!mounted || !editorRef.current) return;

      const editor = ace.edit(editorRef.current, {
        mode: 'ace/mode/typescript',
        theme: 'ace/theme/chrome',
        fontSize: 13,
        showPrintMargin: false,
        tabSize: 2,
        useSoftTabs: true,
        wrap: true,
        minLines: 8,
        maxLines: 20,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
      }) as unknown as AceEditor;

      editor.getValue = (editor as unknown as { getValue: () => string })
        .getValue;

      editor.session = (editor as unknown as { session: unknown }).session;

      editor.destroy = (editor as unknown as { destroy: () => void }).destroy;

      (
        editor as unknown as {
          setValue: (val: string, cursor?: number) => void;
        }
      ).setValue(
        '// Transform the data and return the result\nreturn data;\n',
        -1
      );

      // Set up ace-linters for TypeScript intellisense
      try {
        const worker = new Worker(
          new URL(
            'ace-linters/build/service-manager.js',
            import.meta.url
          ),
          { type: 'module' }
        );
        const languageProvider = LanguageProvider.create(worker);
        languageProvider.registerEditor(editor);

        // Feed ambient type declarations for the data variable
        typeVersionRef.current += 1;
        const typeDecl = generateTypeDeclaration(jsonData);
        languageProvider.setDocumentOptions(editor.session, {
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

  const runTransform = useCallback(async () => {
    if (!aceEditorRef.current) return;
    const code = aceEditorRef.current.getValue();

    try {
      // Transpile TypeScript to JavaScript before execution
      const ts = await import('typescript');
      const transpiled = ts.transpileModule(code, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.None,
          strict: false,
        },
      });

      const fn = new Function('data', transpiled.outputText);
      const result = fn(jsonData);
      onResult(result);
      onError(null);
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Execution error');
    }
  }, [jsonData, onResult, onError]);

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
