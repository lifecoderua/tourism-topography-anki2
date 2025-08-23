
// Export the Anki deck: copy media_source/ to media_destination/export/, replace collection.anki2, zip export folder, cleanup previous output and temp folder
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const mediaSourceDir = path.join(__dirname, '../../media_source');
const mediaDestinationDir = path.join(__dirname, '../../media_destination');
const exportDir = path.join(mediaDestinationDir, 'export');
const outputDir = path.join(__dirname, '../../output');
const outputFile = path.join(outputDir, 'deck.apkg');

// Helper to recursively delete a folder
function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}

// Cleanup previous export output and temp folder if exists
if (fs.existsSync(outputFile)) {
  fs.unlinkSync(outputFile);
  console.log('Previous export output removed.');
}
if (fs.existsSync(exportDir)) {
  deleteFolderRecursive(exportDir);
  console.log('Previous export temp folder removed.');
}

// Copy media_source/ to media_destination/export/
function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  fs.readdirSync(src).forEach((item) => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

copyRecursiveSync(mediaSourceDir, exportDir);

// Replace collection.anki2 in export folder with the one from media_destination
const destAnki2 = path.join(mediaDestinationDir, 'collection.anki2');
const exportAnki2 = path.join(exportDir, 'collection.anki2');
if (fs.existsSync(destAnki2)) {
  fs.copyFileSync(destAnki2, exportAnki2);
  console.log('Replaced collection.anki2 in export folder.');
}

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Create a file to stream archive data to.
const output = fs.createWriteStream(outputFile);
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', function () {
  console.log(`Exported deck: ${outputFile} (${archive.pointer()} total bytes)`);
});

archive.on('error', function(err){
  throw err;
});

archive.pipe(output);
archive.directory(exportDir + '/', false);
archive.finalize();
