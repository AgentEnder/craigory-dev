const fs = require('fs');
const path = require('path');

const workspaceRoot = path.join(__dirname, '..');
const appsDir = path.join(workspaceRoot, 'apps');
const distDir = path.join(workspaceRoot, 'dist', 'apps');
const targetDir = path.join(distDir, 'craigory-dev', 'client');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Get all app directories
const appDirs = fs.readdirSync(appsDir).filter((dir) => {
  const dirPath = path.join(appsDir, dir);
  return fs.statSync(dirPath).isDirectory();
});

// Copy built local projects
for (const appDir of appDirs) {
  // Skip craigory-dev itself and e2e tests
  if (appDir === 'craigory-dev' || appDir.endsWith('-e2e')) {
    continue;
  }

  const metadataPath = path.join(appsDir, appDir, 'project-metadata.json');

  // Only copy if it has metadata (marking it as a local project)
  if (!fs.existsSync(metadataPath)) {
    continue;
  }

  const targetPath = path.join(targetDir, appDir);

  // Try both locations: monorepo root dist and project's own dist
  const monorepoDistPath = path.join(distDir, appDir);
  const projectDistPath = path.join(appsDir, appDir, 'dist', 'client');

  let sourcePath = null;

  if (fs.existsSync(monorepoDistPath)) {
    sourcePath = monorepoDistPath;
    console.log(`Copying local project from monorepo dist: ${appDir}`);
  } else if (fs.existsSync(projectDistPath)) {
    sourcePath = projectDistPath;
    console.log(`Copying local project from project dist: ${appDir}`);
  }

  if (fs.existsSync(path.join(sourcePath, 'client'))) {
    sourcePath = path.join(sourcePath, 'client');
  }

  if (sourcePath) {
    copyRecursiveSync(sourcePath, targetPath);
  }
}

// Also copy to server directory for SSR
const serverTargetDir = path.join(
  distDir,
  'craigory-dev',
  'server'
);
if (!fs.existsSync(serverTargetDir)) {
  fs.mkdirSync(serverTargetDir, { recursive: true });
}

for (const appDir of appDirs) {
  if (appDir === 'craigory-dev' || appDir.endsWith('-e2e')) {
    continue;
  }

  const metadataPath = path.join(appsDir, appDir, 'project-metadata.json');
  if (!fs.existsSync(metadataPath)) {
    continue;
  }

  const targetPath = path.join(serverTargetDir, appDir);

  // Try both locations: monorepo root dist and project's own dist
  const monorepoDistPath = path.join(distDir, appDir);
  const projectDistPath = path.join(appsDir, appDir, 'dist', 'client');

  let sourcePath = null;

  if (fs.existsSync(monorepoDistPath)) {
    sourcePath = monorepoDistPath;
  } else if (fs.existsSync(projectDistPath)) {
    sourcePath = projectDistPath;
  }

  if (sourcePath) {
    copyRecursiveSync(sourcePath, targetPath);
  }
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Local projects copied successfully');
