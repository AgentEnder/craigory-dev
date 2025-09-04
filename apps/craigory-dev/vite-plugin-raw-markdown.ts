import { Plugin } from 'vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export function rawMarkdownPlugin(): Plugin {
  return {
    name: 'raw-markdown',
    resolveId(id) {
      if (id.endsWith('.md?raw')) {
        return id;
      }
    },
    load(id) {
      if (id.endsWith('.md?raw')) {
        // Remove the ?raw query to get the actual file path
        const filePath = id.replace('?raw', '');
        
        try {
          // Read the file as raw text
          const content = readFileSync(resolve(filePath), 'utf-8');
          
          // Return as an ES module with default export
          return `export default ${JSON.stringify(content)};`;
        } catch (error) {
          console.error('Failed to read markdown file:', filePath, error);
          return `export default '';`;
        }
      }
    },
  };
}