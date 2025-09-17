import { Plugin } from 'vite';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';

export interface RedirectOptions {
  redirects: Array<[string, string] | [RegExp, (match: RegExpMatchArray) => string]>;
}

export function clientRedirects(options: RedirectOptions): Plugin {
  return {
    name: 'client-redirects',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) {
          next();
          return;
        }

        for (const redirect of options.redirects) {
          const [from, to] = redirect;
          
          if (typeof from === 'string') {
            if (req.url === from || req.url === from + '/') {
              const targetUrl = typeof to === 'string' ? to : to([req.url]);
              res.writeHead(302, { Location: targetUrl });
              res.end();
              return;
            }
          } else if (from instanceof RegExp) {
            const match = req.url.match(from);
            if (match && typeof to === 'function') {
              const targetUrl = to(match);
              res.writeHead(302, { Location: targetUrl });
              res.end();
              return;
            }
          }
        }
        
        next();
      });
    },
    generateBundle(options, bundle) {
      for (const redirect of options.redirects) {
        const [from, to] = redirect;
        
        if (typeof from === 'string') {
          const targetUrl = typeof to === 'string' ? to : '';
          if (targetUrl) {
            this.emitFile({
              type: 'asset',
              fileName: from.startsWith('/') ? from.slice(1) + '/index.html' : from + '/index.html',
              source: generateRedirectHtml(targetUrl)
            });
          }
        }
      }
    },
    closeBundle() {
      const outDir = this.getOption('build')?.outDir || 'dist';
      
      for (const redirect of options.redirects) {
        const [from, to] = redirect;
        
        if (typeof from === 'string') {
          const targetUrl = typeof to === 'string' ? to : '';
          if (targetUrl) {
            const redirectPath = from.startsWith('/') ? from.slice(1) : from;
            const filePath = join(outDir, redirectPath, 'index.html');
            const dirPath = dirname(filePath);
            
            if (!existsSync(dirPath)) {
              mkdirSync(dirPath, { recursive: true });
            }
            
            writeFileSync(filePath, generateRedirectHtml(targetUrl));
          }
        }
      }
    }
  };
}

function generateRedirectHtml(targetUrl: string): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>Redirecting...</title>
    <link rel="canonical" href="${targetUrl}" />
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=${targetUrl}" />
  </head>
  <body>
    <p>Redirecting...</p>
  </body>
</html>`;
}