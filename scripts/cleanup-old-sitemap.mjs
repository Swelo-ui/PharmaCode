import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

// Files to delete
const filesToDelete = [
  path.join(rootDir, 'public', 'sitemap.xml'),
  path.join(rootDir, 'public', 'sitemap-0.xml'),
  path.join(rootDir, 'public', 'robots.txt'),
  path.join(rootDir, 'next-sitemap.config.js'),
  path.join(rootDir, 'next-sitemap.config.cjs'),
  path.join(rootDir, 'next-sitemap.config.mjs'),
];

console.log('--- Cleaning up old sitemap files ---');
for (const file of filesToDelete) {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      console.log(`✅ Deleted: ${file}`);
    } catch (err) {
      console.error(`❌ Failed to delete ${file}:`, err);
    }
  } else {
    console.log(`ℹ️ Not found (already clean): ${file}`);
  }
}

// Modify package.json
const packageJsonPath = path.join(rootDir, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Remove postbuild script
    if (pkg.scripts && pkg.scripts.postbuild) {
      delete pkg.scripts.postbuild;
      console.log('✅ Removed postbuild script from package.json');
    }
    
    // Remove next-sitemap from dependencies/devDependencies
    if (pkg.dependencies && pkg.dependencies['next-sitemap']) {
      delete pkg.dependencies['next-sitemap'];
      console.log('✅ Removed next-sitemap from dependencies');
    }
    if (pkg.devDependencies && pkg.devDependencies['next-sitemap']) {
      delete pkg.devDependencies['next-sitemap'];
      console.log('✅ Removed next-sitemap from devDependencies');
    }
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 4) + '\n', 'utf8');
    console.log('✅ Saved package.json');
  } catch (err) {
    console.error('❌ Failed to update package.json:', err);
  }
} else {
  console.error('❌ package.json not found in current directory!');
}

console.log('--- Cleanup complete ---');
