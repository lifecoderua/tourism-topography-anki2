
// Repopulate the destination Anki2 DB with translations from processedCards.json
// Only update text, preserve image tags and HTML, using sourceCards.json as reference
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '../../media_destination/collection.anki2');
const processedPath = path.join(__dirname, '../../media_source/processedCards.json');
const sourceCardsPath = path.join(__dirname, '../../media_destination/sourceCards.json');

// Load processed translations and original extracted text
const processed = JSON.parse(fs.readFileSync(processedPath, 'utf8'));
const sourceCards = JSON.parse(fs.readFileSync(sourceCardsPath, 'utf8'));
const sourceById = Object.fromEntries(sourceCards.map(card => [card.id, card]));
const processedById = Object.fromEntries(processed.map(card => [card.id, card]));

// Open DB for writing
const db = new Database(dbPath);

// Get all notes
const notes = db.prepare('SELECT id, flds FROM notes').all();

// Helper to split and join flds
function splitFlds(flds) {
	return flds.split('\x1f');
}
function joinFlds(parts) {
	return parts.join('\x1f');
}

let updated = 0;
const updateStmt = db.prepare('UPDATE notes SET flds = ? WHERE id = ?');


for (const note of notes) {
	const { id, flds } = note;
	const sourceCardDescription = sourceById[id];
	const processedCardDescription = processedById[id];
	if (!sourceCardDescription || !processedCardDescription) {
    console.log(`Missing description for note ${id}`);
    continue;
  }
	const cardParts = splitFlds(flds);
	// cardParts: [primaryImage, primaryDescription, secondaryImage, secondaryDescription]
	let changed = false;
	if (cardParts[1] === sourceCardDescription.primaryDescription && processedCardDescription.primaryDescription) {
		cardParts[1] = processedCardDescription.primaryDescription;
		changed = true;
	}
	if (cardParts[3] === sourceCardDescription.secondaryDescription && processedCardDescription.secondaryDescription) {
		cardParts[3] = processedCardDescription.secondaryDescription;
		changed = true;
	}
	if (changed) {
		updateStmt.run(joinFlds(cardParts), id);
		updated++;
	}
}

console.log(`Updated ${updated} notes in ${dbPath}`);