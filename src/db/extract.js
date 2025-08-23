const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Path to the Anki SQLite database
const dbPath = path.join(__dirname, '../../media_source/collection.anki2');
// Output JSON file
const outputPath = path.join(__dirname, '../../media_destination/sourceCards.json');

// Open the database
const db = new Database(dbPath, { readonly: true });

// Query the notes table
const rows = db.prepare('SELECT id, flds FROM notes').all();

// Helper to split the flds field (Anki uses \x1f as separator)
function parseFlds(flds) {
  const [primaryImage, primaryDescription, secondaryImage, secondaryDescription] = flds.split('\x1f');
  return { primaryDescription, secondaryDescription };
}

const result = rows.map(row => {
  const { primaryDescription, secondaryDescription } = parseFlds(row.flds);
  return {
    id: row.id,
    primaryDescription,
    secondaryDescription
  };
});

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
console.log(`Extracted ${result.length} entries to ${outputPath}`);
