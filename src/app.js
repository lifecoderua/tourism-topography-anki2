const fs = require('fs');
const path = require('path');

const mediaJsonPath = path.join(__dirname, '../media_source/media');
const sourceDir = path.join(__dirname, '../media_source');
const destDir = path.join(__dirname, '../media_destination');

function getExtension(filename) {
  return path.extname(filename).toLowerCase();
}

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function main() {
  // Read the media JSON catalogue
  let media;
  try {
    media = JSON.parse(fs.readFileSync(mediaJsonPath, 'utf8'));
  } catch (err) {
    console.error('Failed to read or parse media JSON:', err);
    process.exit(1);
  }

  ensureDirSync(destDir);

  for (const [id, origFilename] of Object.entries(media)) {
    const ext = getExtension(origFilename);
    const srcPath = path.join(sourceDir, id);
    const destPath = path.join(destDir, id + ext);

    if (!fs.existsSync(srcPath)) {
      console.warn(`Source file missing: ${srcPath}`);
      continue;
    }

    try {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${srcPath} -> ${destPath}`);
    } catch (err) {
      console.error(`Failed to copy ${srcPath} to ${destPath}:`, err);
    }
  }
}

main();
