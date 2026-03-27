export function Head() {
  return (
    <>
      <title>PR Digest</title>
      <meta
        name="description"
        content="Generate comprehensive digests of GitHub pull requests for AI agent handoffs."
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
if (typeof globalThis.process === 'undefined') {
  globalThis.process = {
    env: {},
    argv: [],
    platform: 'browser',
    version: 'v0.0.0',
    versions: {},
    release: {},
    stdout: { write: function() {} },
    stderr: { write: function() {} },
    exit: function() {},
    cwd: function() { return '/'; },
    nextTick: function(fn) { Promise.resolve().then(fn); },
    emit: function() {},
    on: function() { return globalThis.process; },
    off: function() { return globalThis.process; },
    listeners: function() { return []; },
  };
}`,
        }}
      />
    </>
  );
}
