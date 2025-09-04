import { Plugin } from 'vite';
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync, readFileSync } from 'fs';
import { join, dirname, relative } from 'path';

export function copyAssetsPlugin(options: {
  src: string;
  dest: string;
}): Plugin {
  return {
    name: 'copy-assets',
    configureServer(server) {
      // Handle asset serving during development
      server.middlewares.use(`/${options.dest}`, (req, res, next) => {
        if (!req.url) return next();
        
        const srcPath = join(process.cwd(), options.src);
        // Decode URL to handle spaces and special characters properly
        const decodedUrl = decodeURIComponent(req.url.replace(/^\//, ''));
        const assetPath = join(srcPath, decodedUrl);
        
        console.log('Asset request:', req.url, '-> decoded:', decodedUrl, '-> path:', assetPath);
        
        if (existsSync(assetPath) && statSync(assetPath).isFile()) {
          try {
            const content = readFileSync(assetPath);
            
            // Set appropriate content type based on file extension
            const ext = assetPath.split('.').pop()?.toLowerCase();
            const contentTypes: Record<string, string> = {
              'png': 'image/png',
              'jpg': 'image/jpeg',
              'jpeg': 'image/jpeg',
              'gif': 'image/gif',
              'svg': 'image/svg+xml',
              'mp4': 'video/mp4',
              'webm': 'video/webm',
            };
            
            const contentType = contentTypes[ext || ''] || 'application/octet-stream';
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=3600');
            res.end(content);
            return;
          } catch (error) {
            console.error(`Error serving asset ${assetPath}:`, error);
          }
        }
        
        next();
      });
    },
    writeBundle(options_bundle) {
      const outputDir = options_bundle.dir || 'dist';
      const srcPath = join(process.cwd(), options.src);
      const destPath = join(outputDir, options.dest);

      function copyRecursive(source: string, destination: string) {
        if (!existsSync(source)) {
          console.warn(`Source path does not exist: ${source}`);
          return;
        }

        // Ensure destination directory exists
        if (!existsSync(destination)) {
          mkdirSync(destination, { recursive: true });
        }

        const items = readdirSync(source);

        for (const item of items) {
          const sourcePath = join(source, item);
          const destPath = join(destination, item);

          if (statSync(sourcePath).isDirectory()) {
            copyRecursive(sourcePath, destPath);
          } else {
            // Ensure parent directory exists
            const parentDir = dirname(destPath);
            if (!existsSync(parentDir)) {
              mkdirSync(parentDir, { recursive: true });
            }
            
            try {
              copyFileSync(sourcePath, destPath);
              console.log(`Copied: ${relative(process.cwd(), sourcePath)} -> ${relative(process.cwd(), destPath)}`);
            } catch (error) {
              console.error(`Failed to copy ${sourcePath} to ${destPath}:`, error);
            }
          }
        }
      }

      console.log(`[copy-assets] Copying from ${srcPath} to ${destPath}`);
      copyRecursive(srcPath, destPath);
    },
  };
}