# Step 1

- use nodejs, provide a `package.json` running `src/app.js`
- copy the `media_source/` images to `media_destination/`, preserve the file name, set the extension based on the `media` JSON catalogue
- supply `Readme.md` with installation and run instructions

# Step 2

- provide an HTML to showcase the processed images;
- use shadcn components to display the contents;
- display as Anki cards, for IDs in pairs: even on top, odd on bottom. E.g. first card top is image `0`, bottom image `1`. Second card top image `2`, bottom image `3`. And so on;

# Step 3

- consult `db/info.md` for DB structure context
- provide data extraction logic in `db.js`
- provide a separate DB handling execution command in `package.json`
- run through the SQLite, collect entries and output as JSON `media_destination/sourceCards.json`
- each entry should contain `{ id, primaryDescription, secondaryDescription }`

# Step 4

- implement `src/db/repopulate.js` and provide a package.json script
- consult `db/info.md` for DB structure
- copy the `media_source/collection.anki2` to the `media_destination/collection.anki2`
- update the destination DB copy with cards translations from `media_source/processedCards.json` by ID
- only update text, preserve the image tags / rest of HTML. Reference the original extracted text from `media_destination/sourceCards.json` to do a safe replacement