const fs = require('fs').promises;
const path = require('path');
const os = require('os');

async function createSymlinks(projectRoot, platformConfig) {
  const results = [];
  const isWindows = os.platform() === 'win32';

  for (const target of platformConfig.targets) {
    const sourcePath = path.join(projectRoot, target.source);
    const targetPath = path.join(projectRoot, target.target);

    try {
      await ensureDirectoryExists(path.dirname(targetPath));
      
      await removeIfExists(targetPath);

      if (isWindows) {
        await createWindowsSymlink(sourcePath, targetPath);
      } else {
        await createUnixSymlink(sourcePath, targetPath, projectRoot);
      }

      results.push({
        source: target.source,
        target: target.target,
        success: true,
        type: isWindows ? 'junction' : 'symlink'
      });
    } catch (error) {
      results.push({
        source: target.source,
        target: target.target,
        success: false,
        error: error.message
      });
    }
  }

  return results;
}

async function ensureDirectoryExists(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function removeIfExists(filePath) {
  try {
    const stats = await fs.lstat(filePath);
    if (stats.isSymbolicLink() || stats.isFile()) {
      await fs.unlink(filePath);
    } else if (stats.isDirectory()) {
      await fs.rmdir(filePath, { recursive: true });
    }
  } catch (error) {
  }
}

async function createUnixSymlink(sourcePath, targetPath, projectRoot) {
  const targetDir = path.dirname(targetPath);
  const relativeSource = path.relative(targetDir, sourcePath);
  
  await fs.symlink(relativeSource, targetPath, 'file');
}

async function createWindowsSymlink(sourcePath, targetPath) {
  const { execSync } = require('child_process');
  
  try {
    execSync(`mklink "${targetPath}" "${sourcePath}"`, { stdio: 'ignore' });
  } catch (error) {
    await fs.copyFile(sourcePath, targetPath);
  }
}

async function verifySymlinks(projectRoot, platformConfig) {
  const results = [];

  for (const target of platformConfig.targets) {
    const targetPath = path.join(projectRoot, target.target);
    
    try {
      const stats = await fs.lstat(targetPath);
      const exists = stats.isSymbolicLink() || stats.isFile();
      
      results.push({
        target: target.target,
        exists,
        isSymlink: stats.isSymbolicLink()
      });
    } catch {
      results.push({
        target: target.target,
        exists: false,
        isSymlink: false
      });
    }
  }

  return results;
}

module.exports = { createSymlinks, verifySymlinks };
